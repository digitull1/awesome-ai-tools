"""Synthesise a royalty-free soundtrack for one Short from its spec.

Usage: python3 audio.py spec.json out.wav

Everything here is generated from scratch (sine tones and filtered noise), so
there is nothing to license: a soft four-chord pad, plus a pop for reveals, a
clock tick for countdowns and a thud for stamps, at the cue times in the spec.
"""
import json
import sys
import wave

import numpy as np

SR = 48000


def midi_hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def pad(duration):
    # IV - V - vi - I in C, each chord 2.4 s, with raised-cosine crossfades.
    chords = [[41, 48, 57, 64], [43, 50, 59, 64], [45, 52, 55, 60], [36, 48, 55, 59, 64]]
    chord_len, fade = 2.4, 0.6
    n = int(duration * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    k = 0
    start = -fade / 2
    while start < duration:
        notes = chords[k % len(chords)]
        a, b = max(0.0, start), min(duration, start + chord_len + fade)
        i0, i1 = int(a * SR), int(b * SR)
        tt = t[i0:i1]
        env = np.ones_like(tt)
        rise = np.clip((tt - start) / fade, 0, 1)
        fall = np.clip((start + chord_len + fade - tt) / fade, 0, 1)
        env *= 0.5 - 0.5 * np.cos(np.pi * rise)
        env *= 0.5 - 0.5 * np.cos(np.pi * fall)
        for j, note in enumerate(notes):
            f = midi_hz(note)
            amp = 0.5 if j == 0 else 0.28
            for side, cents in ((0, -3), (1, 3)):
                fd = f * 2 ** (cents / 1200)
                wave_ = np.sin(2 * np.pi * fd * tt) + 0.12 * np.sin(2 * np.pi * 2 * fd * tt)
                out[i0:i1, side] += amp * env * wave_
        start += chord_len
        k += 1
    lfo = 1 + 0.08 * np.sin(2 * np.pi * 0.2 * t)
    out *= lfo[:, None]
    rms = np.sqrt(np.mean(out ** 2)) + 1e-9
    return out * (10 ** (-27 / 20) / rms)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def pop():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    f = 1300 * np.exp(-t * 22) + 520
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_exp(n, 0.025) * 10 ** (-13 / 20)


def tick():
    n = int(0.035 * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(n)
    noise = noise - np.convolve(noise, np.ones(8) / 8, mode='same')  # crude high-pass
    click = 0.6 * noise + 0.8 * np.sin(2 * np.pi * 2400 * t)
    return click * env_exp(n, 0.006) * 10 ** (-9 / 20)


def thud():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 95 * np.exp(-t * 7) + 42
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_exp(n, 0.11)
    rng = np.random.default_rng(3)
    slap = rng.standard_normal(n) * env_exp(n, 0.012)
    slap = np.convolve(slap, np.ones(12) / 12, mode='same')
    return (0.9 * body + 0.5 * slap) * 10 ** (-4 / 20)


SFX = {'pop': pop, 'tick': tick, 'thud': thud}


def cues(spec):
    out = []
    for sc in spec['scenes']:
        for b in sc['blocks']:
            if b.get('sfx'):
                out.append((b['in'], b['sfx']))
            if b['type'] == 'timer' and b.get('ticks'):
                out += [(b['in'] + k, 'tick') for k in range(b['from'])]
            if b['type'] == 'card' and b.get('stamp'):
                out.append((b['stamp']['in'], 'thud'))
    return sorted(out)


def main(spec_path, wav_path):
    spec = json.load(open(spec_path))
    dur = spec['duration']
    mix = pad(dur)
    n = mix.shape[0]
    for at, kind in cues(spec):
        s = SFX[kind]()
        i = int(at * SR)
        j = min(n, i + len(s))
        if i < n:
            mix[i:j, 0] += s[: j - i]
            mix[i:j, 1] += s[: j - i]
    # Short fades so the loop point doesn't click.
    f = int(0.03 * SR)
    mix[:f] *= np.linspace(0, 1, f)[:, None]
    g = int(0.25 * SR)
    mix[-g:] *= np.linspace(1, 0, g)[:, None]
    peak = np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix / peak * 1.1) / np.tanh(1.1) * 10 ** (-1 / 20)
    pcm = (mix * 32767).astype('<i2')
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"audio {wav_path}: {dur:.1f}s, {len(cues(spec))} cues")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
