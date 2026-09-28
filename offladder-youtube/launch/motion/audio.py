"""Score and sound design for an OffLadder motion piece.

Usage: python3 audio.py piece.meta.json out.wav

The meta file comes from the piece's own timeline (render.cjs writes it): the duration, a music plan
with one entry per bar, and every sound cue the motion kit recorded (impacts, whooshes, pops, ticks,
typing and so on). So the soundtrack is cut to the picture by construction: every hit lands on the
frame it belongs to, and the music's bars are the same grid the animation uses.

Everything is synthesised here from oscillators and filtered noise, so there's nothing to license.
The mix wraps its tail back onto the start, so the Short loops without a seam.
"""
import json
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
TAIL = 4.0
NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6,
        'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
QUALITY = {'': (0, 4, 7), 'm': (0, 3, 7), '5': (0, 7, 12), 'sus2': (0, 2, 7), 'sus4': (0, 5, 7),
           '7': (0, 4, 7, 10), 'm7': (0, 3, 7, 10), 'maj7': (0, 4, 7, 11), 'add9': (0, 4, 7, 14), 'madd9': (0, 3, 7, 14)}


# ---------------------------------------------------------------- basics
def hz(m):
    return 440.0 * 2 ** ((np.asarray(m, dtype=float) - 69) / 12)


def secs(n):
    return np.arange(int(n * SR)) / SR


def rng(seed):
    return np.random.default_rng(seed)


def expdec(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def adsr(n, a=0.005, d=0.1, s=0.7, r=0.1):
    """Attack, decay, sustain for the note's length, then release inside n samples."""
    env = np.full(n, s, dtype=float)
    ia, idd, ir = int(a * SR), int(d * SR), int(r * SR)
    ia = min(ia, n)
    env[:ia] = np.linspace(0, 1, ia, endpoint=False) if ia else env[:ia]
    j = min(n, ia + idd)
    if j > ia:
        env[ia:j] = 1 - (1 - s) * np.linspace(0, 1, j - ia)
    if ir and n > ir:
        env[-ir:] *= np.linspace(1, 0, ir) ** 2
    return env


def sos(kind, f, order=2):
    nyq = SR / 2
    if kind == 'bp':
        lo, hi = max(20, f[0]), min(nyq * 0.95, f[1])
        return signal.butter(order, [lo / nyq, hi / nyq], btype='band', output='sos')
    f = min(max(20, f), nyq * 0.95)
    return signal.butter(order, f / nyq, btype={'lp': 'low', 'hp': 'high'}[kind], output='sos')


def filt(x, kind, f, order=2):
    return signal.sosfilt(sos(kind, f, order), x, axis=0)


def sweep_filter(x, kind, fc, block=256, q_order=2):
    """Time-varying Butterworth filter; fc is an array of cutoffs, one per sample."""
    x = np.asarray(x, dtype=float)
    mono = x.ndim == 1
    if mono:
        x = x[:, None]
    out = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), block):
        c = float(np.mean(fc[i:i + block]))
        s = sos(kind, c, q_order)
        if zi is None or zi.shape[0] != s.shape[0]:
            zi = np.zeros((s.shape[0], 2, x.shape[1]))
        out[i:i + block], zi = signal.sosfilt(s, x[i:i + block], axis=0, zi=zi)
    return out[:, 0] if mono else out


def saw(f, t, phase=0.0):
    """PolyBLEP sawtooth: cheap and free of the worst aliasing."""
    inc = np.broadcast_to(np.asarray(f, dtype=float), t.shape) / SR
    ph = (np.cumsum(inc) + phase / (2 * np.pi)) % 1.0
    y = 2 * ph - 1
    lo = ph < inc
    x = ph[lo] / inc[lo]
    y[lo] -= x + x - x * x - 1
    hi = ph > 1 - inc
    x = (ph[hi] - 1) / inc[hi]
    y[hi] -= x * x + x + x + 1
    return y


def sine_sweep(f, n):
    return np.sin(2 * np.pi * np.cumsum(f[:n]) / SR)


def pan(x, p):
    """Equal-power pan, p in -1 (left) .. 1 (right). x mono -> stereo."""
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def stereo(x):
    return np.stack([x, x], axis=1) if x.ndim == 1 else x


def add(bus, x, at, gain=1.0):
    i = int(round(at * SR))
    x = stereo(x) * gain
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(bus), i + len(x))
    if j > i:
        bus[i:j] += x[:j - i]


def chord_notes(name):
    if not name:
        return None, ()
    root = name[:2] if len(name) > 1 and name[1] in '#b' else name[:1]
    return NOTE[root], QUALITY[name[len(root):]]


def near(pc, lo):
    """The pitch class pc in the octave starting at MIDI note lo."""
    return lo + ((pc - lo) % 12)


# ---------------------------------------------------------------- instruments
def kick(g=1.0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 44 + 120 * np.exp(-t * 32) + 30 * np.exp(-t * 9)
    body = sine_sweep(f, n) * np.exp(-t / 0.26)
    click = filt(rng(1).standard_normal(n), 'hp', 2500) * np.exp(-t / 0.004) * 0.35
    x = np.tanh((body + click) * 1.6) / np.tanh(1.6)
    return x * g


def clap(seed=2):
    n = int(0.4 * SR)
    r = rng(seed)
    out = np.zeros((n, 2))
    for ch in range(2):
        noise = r.standard_normal(n)
        env = np.zeros(n)
        for k, off in enumerate((0, 0.011, 0.022)):
            i = int(off * SR)
            env[i:] += np.exp(-np.arange(n - i) / (0.007 * SR)) * (0.8 if k < 2 else 1.0)
        i = int(0.022 * SR)
        env[i:] += 0.5 * np.exp(-np.arange(n - i) / (0.12 * SR))
        out[:, ch] = filt(noise * env, 'bp', (800, 3800))
    return out * 0.8


def snare(g=1.0, seed=3):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (185 * t + 30 * (1 - np.exp(-t * 40)) / 40)) * np.exp(-t / 0.05)
    noise = filt(rng(seed).standard_normal(n), 'bp', (1200, 8000)) * np.exp(-t / 0.09)
    return (0.55 * body + 0.9 * noise) * g


def hat(open_=False, seed=4):
    n = int((0.35 if open_ else 0.06) * SR)
    x = filt(rng(seed).standard_normal(n), 'hp', 7200, 4)
    return x * expdec(n, 0.2 if open_ else 0.022) * (0.5 if open_ else 0.6)


def bass_note(m, dur, g=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    raw = 0.7 * saw(np.full(n, f), t) + 0.9 * np.sin(2 * np.pi * f * t)
    cut = 180 + 900 * np.exp(-t / 0.05)
    x = sweep_filter(raw, 'lp', cut, block=128)
    return np.tanh(1.4 * x * adsr(n, 0.003, 0.08, 0.75, 0.05)) * g


def pad_chord(notes, dur, seed=5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = rng(seed)
    out = np.zeros((n, 2))
    for m in notes:
        for k, det in enumerate((-9, 0, 8)):
            f = hz(m) * 2 ** (det / 1200)
            w = saw(np.full(n, f), t, r.uniform(0, 6.28))
            out += pan(w, (-0.6, 0.0, 0.6)[k]) * (0.5 if k == 1 else 0.38)
    out = filt(out, 'lp', 1900)
    return out * adsr(n, 0.06, 0.3, 0.85, 0.25)[:, None] / max(1, len(notes))


def pluck(m, g=1.0, dur=0.32):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    raw = saw(np.full(n, f), t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    x = sweep_filter(raw, 'lp', 700 + 5200 * np.exp(-t / 0.045), block=128)
    return x * np.exp(-t / 0.11) * g


def bell(m, dur=1.4, g=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    x = np.zeros(n)
    for ratio, amp, tau in ((1, 1, 0.9), (2.0, 0.45, 0.5), (3.01, 0.25, 0.3), (4.2, 0.18, 0.18), (5.43, 0.1, 0.1)):
        x += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / tau)
    return x * adsr(n, 0.002, 0.05, 1, 0.05) * g * 0.5


# ---------------------------------------------------------------- effects
def fx_impact(seed=11, big=1.0):
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    sub = sine_sweep(38 + 60 * np.exp(-t * 10), n) * np.exp(-t / (0.55 * big))
    r = rng(seed)
    punch = filt(r.standard_normal(n), 'lp', 1800) * np.exp(-t / 0.09)
    crack = filt(r.standard_normal(n), 'hp', 2200) * np.exp(-t / 0.025)
    x = 1.2 * sub + 0.8 * punch + 0.45 * crack
    return np.tanh(1.3 * x) * 0.9


def fx_boom(seed=12):
    n = int(3.0 * SR)
    t = np.arange(n) / SR
    sub = sine_sweep(32 + 40 * np.exp(-t * 6), n) * np.exp(-t / 1.1)
    rumble = filt(rng(seed).standard_normal(n), 'lp', 220) * np.exp(-t / 0.7) * 0.6
    return np.tanh(1.2 * (sub + rumble))


def fx_whoosh(dur=0.6, seed=13, up=True):
    n = int(max(0.2, dur) * SR)
    x = np.linspace(0, 1, n)
    peak = 0.62
    env = np.where(x < peak, (x / peak) ** 2.4, np.exp(-(x - peak) / 0.12))
    r = rng(seed)
    fc = 350 * (22 ** (x if up else 1 - x))
    out = np.zeros((n, 2))
    for ch in range(2):
        noise = r.standard_normal(n)
        lo = sweep_filter(noise, 'lp', fc * 1.8, block=128)
        out[:, ch] = sweep_filter(lo, 'hp', fc * 0.45, block=128) * env
    p = np.linspace(-0.7, 0.7, n)
    out[:, 0] *= np.cos((p + 1) * np.pi / 4) * 1.4
    out[:, 1] *= np.sin((p + 1) * np.pi / 4) * 1.4
    return out * 0.9


def fx_riser(dur, seed=14):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    r = rng(seed)
    noise = r.standard_normal((n, 2))
    fc = 300 * (40 ** (x ** 1.4))
    band = np.stack([sweep_filter(noise[:, c], 'lp', fc * 1.6, block=128) for c in range(2)], axis=1)
    band = np.stack([sweep_filter(band[:, c], 'hp', fc * 0.5, block=128) for c in range(2)], axis=1)
    t = np.arange(n) / SR
    tone = saw(110 * 2 ** (3 * x ** 1.6), t) * 0.25
    env = x ** 2.2
    return (band * 0.9 + stereo(filt(tone, 'lp', 3000))) * env[:, None]


def fx_downer(dur=1.2, seed=15):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    noise = rng(seed).standard_normal(n)
    fc = 7000 * (0.03 ** x)
    y = sweep_filter(noise, 'lp', fc, block=128) * (1 - x) ** 1.5
    return stereo(y) * 0.7


def fx_pop(note=0, seed=16):
    """A soft, pitched pop. `note` climbs A minor pentatonic, so a run of pops rises."""
    pent = [0, 3, 5, 7, 10]
    m = 69 + 12 * (note // 5) + pent[note % 5]
    f = hz(m)
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    body = sine_sweep(f * (1 + 0.9 * np.exp(-t * 60)), n) * np.exp(-t / 0.05)
    click = filt(rng(seed).standard_normal(n), 'hp', 3000) * np.exp(-t / 0.003) * 0.25
    return (body + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.02) + click) * 0.8


def fx_tick(tock=False, seed=17):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    f = 1760 if not tock else 1318.5
    ping = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.012)
    click = filt(rng(seed).standard_normal(n), 'bp', (2000, 9000)) * np.exp(-t / 0.0025)
    wood = np.sin(2 * np.pi * 620 * t) * np.exp(-t / 0.008)
    return 0.55 * ping + 0.8 * click + 0.4 * wood


def fx_type(seed=18):
    r = rng(seed)
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    click = filt(r.standard_normal(n), 'hp', 1800) * np.exp(-t / 0.004)
    thock = np.sin(2 * np.pi * r.uniform(150, 230) * t) * np.exp(-t / 0.012)
    return 0.6 * click + 0.5 * thock


def fx_sparkle(seed=19, root=81):
    r = rng(seed)
    n = int(1.6 * SR)
    out = np.zeros((n, 2))
    for k, step in enumerate((0, 7, 12, 16, 19, 24)):
        b = bell(root + step, 1.2, 0.5 * (0.85 ** k))
        i = int(k * 0.045 * SR)
        out[i:i + len(b)] += pan(b[:n - i], r.uniform(-0.6, 0.6))
    return out


def fx_ident(notes, seed=20):
    """OffLadder's sonic logo: three rising rungs."""
    n = int(2.0 * SR)
    out = np.zeros((n, 2))
    for k, m in enumerate(notes):
        b = bell(m, 1.6, 0.8) + 0.5 * pluck(m - 12, 1.0, 1.6)[:int(1.6 * SR)]
        i = int(k * 0.11 * SR)
        out[i:i + len(b)] += pan(b[:n - i], (-0.35, 0, 0.35)[k % 3])
    return out


def fx_scribble(dur=0.6, seed=21):
    n = int(dur * SR)
    r = rng(seed)
    noise = filt(r.standard_normal(n), 'bp', (1800, 6500))
    strokes = np.abs(np.sin(np.pi * np.cumsum(r.uniform(4, 9, n)) / SR * 2)) ** 0.6
    grit = 0.7 + 0.3 * r.random(n)
    x = np.linspace(0, 1, n)
    env = np.minimum(1, x * 12) * np.minimum(1, (1 - x) * 10)
    return noise * strokes * grit * env * 0.5


def fx_glitch(seed=22):
    r = rng(seed)
    n = int(0.28 * SR)
    out = np.zeros(n)
    i = 0
    while i < n:
        L = int(r.uniform(0.008, 0.03) * SR)
        f = r.choice([180, 360, 720, 1440, 2880])
        seg = np.sign(np.sin(2 * np.pi * f * np.arange(L) / SR)) * r.uniform(0.2, 0.6)
        out[i:i + L] = seg[:max(0, min(L, n - i))]
        i += L + int(r.uniform(0, 0.01) * SR)
    return filt(out, 'lp', 6000) * 0.5


def fx_deal(seed=23):
    r = rng(seed)
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    swish = filt(r.standard_normal(n), 'bp', (1500, 7000)) * (np.exp(-t / 0.03) * np.minimum(1, t / 0.01))
    slap = filt(r.standard_normal(n), 'lp', 1200) * np.exp(-(t - 0.07).clip(0) / 0.015) * (t > 0.07)
    return swish * 0.7 + slap * 0.9


def fx_flip(seed=24):
    r = rng(seed)
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    flut = filt(r.standard_normal(n), 'bp', (900, 5000)) * (0.5 + 0.5 * np.sin(2 * np.pi * 38 * t)) * np.exp(-t / 0.06)
    return flut * 0.8


def fx_heart(seed=25):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for off, g in ((0, 1.0), (0.16, 0.7)):
        tt = (t - off).clip(0)
        out += (t >= off) * sine_sweep(45 + 30 * np.exp(-tt * 30), n) * np.exp(-tt / 0.09) * g
    return np.tanh(1.5 * out)


def fx_shimmer(dur=1.2, seed=26, root=81):
    r = rng(seed)
    n = int((dur + 1.0) * SR)
    out = np.zeros((n, 2))
    k = 0
    pent = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22]
    t = 0.0
    while t < dur:
        m = root + pent[r.integers(len(pent))]
        b = bell(m, 0.6, 0.18 + 0.2 * (t / dur))
        i = int(t * SR)
        out[i:i + len(b)] += pan(b[:n - i], r.uniform(-0.9, 0.9))
        t += r.uniform(0.02, 0.06)
        k += 1
    swell = filt(r.standard_normal((n, 2)), 'hp', 6000) * 0.08
    x = np.linspace(0, 1, n)
    swell *= (np.sin(np.pi * np.clip(x * (dur + 1) / dur, 0, 1)) ** 2)[:, None]
    return out + swell


def fx_thud(seed=27):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    body = sine_sweep(52 + 70 * np.exp(-t * 14), n) * np.exp(-t / 0.12)
    slap = filt(rng(seed).standard_normal(n), 'lp', 900) * np.exp(-t / 0.018)
    return np.tanh(1.4 * (body + 0.6 * slap))


def fx_flap(seed=28):
    """One leaf of a split-flap display falling: a dry plastic clack."""
    r = rng(seed)
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    click = filt(r.standard_normal(n), 'bp', (1200, 6500)) * np.exp(-t / 0.004)
    body = np.sin(2 * np.pi * r.uniform(650, 1100) * t) * np.exp(-t / 0.006)
    return 0.7 * click + 0.35 * body


def fx_click(seed=29):
    """A trackpad click."""
    r = rng(seed)
    n = int(0.04 * SR)
    t = np.arange(n) / SR
    return filt(r.standard_normal(n), 'hp', 2500) * np.exp(-t / 0.003) * 0.8 + np.sin(2 * np.pi * 380 * t) * np.exp(-t / 0.008) * 0.4


# ---------------------------------------------------------------- reverb
def make_ir(dur=2.4, rt60=1.7, seed=31):
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = rng(seed)
    ir = np.zeros((n, 2))
    for c in range(2):
        noise = r.standard_normal(n)
        lo = filt(noise, 'lp', 900) * np.exp(-6.9 * t / rt60)
        mid = filt(noise, 'bp', (900, 4000)) * np.exp(-6.9 * t / (rt60 * 0.7))
        hi = filt(noise, 'hp', 4000) * np.exp(-6.9 * t / (rt60 * 0.35))
        ir[:, c] = lo + 0.8 * mid + 0.5 * hi
    pre = int(0.018 * SR)
    ir = np.vstack([np.zeros((pre, 2)), ir])
    ir *= np.minimum(1, np.arange(len(ir)) / (0.01 * SR))[:, None]
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def reverb(x, ir):
    return np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], axis=1)


# ---------------------------------------------------------------- music
def build_music(plan, n):
    bpm = plan.get('bpm', 120)
    beat = 60 / bpm
    bar = 4 * beat
    six = beat / 4
    drums = np.zeros((n, 2))
    bassb = np.zeros((n, 2))
    padb = np.zeros((n, 2))
    arpb = np.zeros((n, 2))
    send = np.zeros((n, 2))
    kicks = []
    K = kick()
    CL = clap()
    HC = [hat(False, s) for s in range(4)]
    HO = hat(True, 9)
    lp = np.ones(n) * 20000.0

    bars = plan['bars']
    for b, spec in enumerate(bars):
        t0 = b * bar + plan.get('offset', 0.0)
        g = spec.get('gain', 1.0)
        mode = spec.get('drums', 'none')
        # Filter sweep for this bar: a number (fixed) or [from, to] (0 = closed, 1 = open).
        f = spec.get('lp', 1.0)
        f0, f1 = (f, f) if not isinstance(f, list) else f
        i0, i1 = int(t0 * SR), min(n, int((t0 + bar) * SR))
        if i1 > i0:
            x = np.linspace(f0, f1, i1 - i0)
            lp[i0:i1] = 180 * (20000 / 180) ** (x ** 1.2)
        # Drums
        if mode in ('intro', 'four', 'full', 'build'):
            for k in range(4):
                if spec.get('kick', True):
                    add(drums, K, t0 + k * beat, 0.95 * g)
                    kicks.append(t0 + k * beat)
        if mode == 'pulse':
            # A heartbeat: lub-dub on beats one and three, nothing else.
            for k in (0, 2):
                add(drums, K, t0 + k * beat, 0.9 * g); kicks.append(t0 + k * beat)
                add(drums, K, t0 + k * beat + 0.16, 0.5 * g)
        if mode == 'half':
            add(drums, K, t0, 0.95 * g); kicks.append(t0)
            add(drums, K, t0 + 2.5 * beat, 0.7 * g); kicks.append(t0 + 2.5 * beat)
            add(drums, CL, t0 + 2 * beat, 0.55 * g)
            add(send, CL, t0 + 2 * beat, 0.25 * g)
        if mode in ('full', 'build'):
            for k in (1, 3):
                add(drums, CL, t0 + k * beat, 0.5 * g)
                add(send, CL, t0 + k * beat, 0.22 * g)
        if mode in ('four', 'full', 'build', 'half', 'break', 'intro'):
            for s in range(16):
                at = t0 + s * six
                if s % 4 == 2:
                    add(drums, pan(HO, 0.15), at, (0.32 if mode != 'intro' else 0.18) * g)
                elif mode in ('full', 'build', 'break') or (mode in ('four', 'half') and s % 2 == 0):
                    vel = (0.28, 0.12, 0.0, 0.16)[s % 4]
                    add(drums, pan(HC[s % 4], -0.2), at, vel * g)
        if spec.get('fill'):
            for s in range(12, 16):
                add(drums, snare(0.35 + 0.1 * (s - 12)), t0 + s * six, g)
        # Harmony
        root, q = chord_notes(spec.get('chord'))
        if root is None:
            continue
        if spec.get('bass', 0):
            bm = near(root, 33)
            for k in range(4):
                add(bassb, bass_note(bm, beat * 0.45, 0.9), t0 + k * beat + beat / 2, spec['bass'] * g)
        if spec.get('pad', 0):
            notes = sorted(near((root + iv) % 12, 55) for iv in q)
            notes = [near(root, 43)] + notes
            add(padb, pad_chord(notes, bar + 0.25, seed=b), t0, 0.55 * spec['pad'] * g)
        arp = spec.get('arp')
        if arp:
            tones = sorted(near((root + iv) % 12, 69) for iv in q[:3])
            seq = tones + [tones[0] + 12] + [tones[1] + 12] + [tones[0] + 12] + tones[::-1][:2]
            if arp == 'down':
                seq = seq[::-1]
            step = six if spec.get('arp16', True) else beat / 2
            for s in range(int(bar / step + 1e-6)):
                m = seq[s % len(seq)]
                p = pluck(m, 0.5 + 0.15 * (s % 4 == 0))
                add(arpb, pan(p, 0.35 * np.sin(s * 1.3)), t0 + s * step, 0.42 * spec.get('arpgain', 1.0) * g)
                add(send, pan(p, 0), t0 + s * step, 0.12 * g)

    # Sidechain: the pad and bass duck under each kick.
    duck = np.ones(n)
    for kt in kicks:
        i = int(kt * SR)
        if i >= n:
            continue
        L = min(n - i, int(0.42 * SR))
        x = np.arange(L) / SR
        duck[i:i + L] = np.minimum(duck[i:i + L], 1 - 0.72 * np.exp(-x / 0.11))
    padb *= duck[:, None]
    arpb *= (0.55 + 0.45 * duck)[:, None]
    bassb *= (0.35 + 0.65 * duck)[:, None]

    # Ping-pong delay on the arp (dotted eighth).
    d = int(0.75 * beat * SR)
    delayed = np.zeros_like(arpb)
    fb = 0.38
    src = arpb.copy()
    for k in range(1, 5):
        sh = d * k
        if sh >= n:
            break
        tap = src[:n - sh] * (fb ** k)
        ch = k % 2
        delayed[sh:, ch] += tap[:, 0] + tap[:, 1]
    arpb += filt(delayed, 'lp', 3500) * 0.6

    for rz in plan.get('risers', []):
        a, b_ = rz[0], rz[1]
        gg = rz[2] if len(rz) > 2 else 1.0
        add(drums, fx_riser(b_ - a, seed=int(a * 10)), a, 0.5 * gg)
    for rl in plan.get('rolls', []):
        a, b_ = rl[0], rl[1]
        t = a
        k = 0
        while t < b_ - 1e-6:
            p = (t - a) / (b_ - a)
            step = six * 2 if p < 0.5 else (six if p < 0.8 else six / 2)
            add(drums, snare(0.2 + 0.6 * p, seed=40 + k), t, 1.0)
            t += step
            k += 1

    music = drums + bassb * 0.85 + padb * 0.8 + arpb
    music = sweep_filter(music, 'lp', lp, block=256)
    # Hard stops: silence the music (not its reverb) from each stop time until the next bar starts.
    for st in plan.get('stops', []):
        i = int(st[0] * SR)
        j = int(st[1] * SR) if len(st) > 1 else n
        L = int(0.012 * SR)
        music[i:i + L] *= np.linspace(1, 0, min(L, n - i))[:, None]
        music[i + L:j] = 0
    send = sweep_filter(send, 'lp', lp, block=256)
    return music, send, padb * 0.25 + arpb * 0.3


def chord_at(plan, t):
    beat = 60 / plan.get('bpm', 120)
    b = int((t - plan.get('offset', 0.0)) // (4 * beat))
    bars = plan['bars']
    b = max(0, min(len(bars) - 1, b))
    return bars[b].get('chord') or 'Am'


# ---------------------------------------------------------------- the epic score
# A cinematic hybrid orchestra, synthesised from scratch: string ostinatos, low strings, brass,
# choir, taikos and braams. It reads the same per-bar plan as before (chord, drums, bass, pad,
# arp, lp) and plays it as a trailer-style arrangement. Its energy sits in the midrange, so it
# carries on a phone speaker, not just on headphones.

def ensemble(f, n, voices=5, detune=12.0, seed=0, spread=0.8):
    """Detuned sawtooth ensemble. f is a frequency array (vibrato and scoops welcome)."""
    t = np.arange(n) / SR
    r = rng(seed)
    out = np.zeros((n, 2))
    for v in range(voices):
        c = 0.0 if voices == 1 else (v / (voices - 1) * 2 - 1) * detune
        w = saw(f * 2 ** (c / 1200), t, r.uniform(0, 6.28))
        out += pan(w, (0.0 if voices == 1 else (v / (voices - 1) * 2 - 1)) * spread)
    return out / np.sqrt(voices)


def env_asr(n, a, r, hold):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    rel = np.clip((t - hold) / max(r, 1e-4), 0, 1)
    return e * (1 - rel) ** 2


def strings_pad(notes, dur, g=1.0, seed=0, bright=3400, tremolo=0.0):
    n = int((dur + 0.6) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for i, m in enumerate(notes):
        f = hz(m) * (1 + 0.0032 * np.sin(2 * np.pi * (5.1 + 0.3 * i) * t + i))
        out += ensemble(f, n, 5, 11, seed + i)
    out = filt(filt(out, 'lp', bright), 'hp', 110)
    e = env_asr(n, 0.28, 0.55, dur)
    if tremolo:
        e = e * (1 - tremolo + tremolo * np.abs(np.sin(2 * np.pi * 7.5 * t)))
    return out * e[:, None] * g / max(1, len(notes)) ** 0.5


def spiccato(m, g=1.0, seed=0, bright=True):
    n = int(0.34 * SR)
    t = np.arange(n) / SR
    x = ensemble(np.full(n, hz(m)), n, 3, 9, seed, 0.5)
    hi = filt(x, 'lp', 6200 if bright else 3000) * (np.exp(-t / 0.025))[:, None]
    lo = filt(x, 'lp', 1900) * (np.exp(-t / 0.09))[:, None]
    e = np.minimum(1, t / 0.003)[:, None]
    return np.tanh(1.5 * (hi * 0.8 + lo)) * e * g


def low_string(m, dur, g=1.0, seed=0):
    n = int((dur + 0.15) * SR)
    t = np.arange(n) / SR
    x = ensemble(np.full(n, hz(m)), n, 3, 10, seed, 0.3)
    x = filt(x, 'lp', 1700) + stereo(0.22 * np.sin(2 * np.pi * hz(m) * t))
    e = np.minimum(1, t / 0.004) * np.exp(-t / 0.16) * 0.7 + 0.3 * env_asr(n, 0.004, 0.08, dur)
    return np.tanh(1.3 * x * e[:, None]) * g


def brass(m, dur, g=1.0, seed=0, stab=False):
    n = int((dur + 0.35) * SR)
    t = np.arange(n) / SR
    scoop = 2 ** ((-0.4 / 12) * np.exp(-t / 0.045))
    vib = 1 + 0.0045 * np.sin(2 * np.pi * 5.0 * t) * np.minimum(1, t / 0.5)
    f = hz(m) * scoop * vib
    x = ensemble(f, n, 3, 7, seed, 0.4)
    fc = 450 + (2800 if not stab else 3600) * (1 - np.exp(-t / 0.05)) * (np.exp(-t / 1.6) * 0.5 + 0.5)
    x = np.stack([sweep_filter(x[:, c], 'lp', fc, block=256) for c in range(2)], axis=1)
    e = env_asr(n, 0.025, 0.25, dur) if not stab else np.minimum(1, t / 0.01) * np.exp(-t / 0.22)
    return np.tanh(1.8 * x * e[:, None]) * g


def choir(notes, dur, g=1.0, seed=0):
    n = int((dur + 0.9) * SR)
    t = np.arange(n) / SR
    src = np.zeros((n, 2))
    for i, m in enumerate(notes):
        f = hz(m) * (1 + 0.005 * np.sin(2 * np.pi * (4.6 + 0.4 * i) * t + 2 * i))
        src += ensemble(f, n, 3, 16, seed + 10 * i, 0.9)
    ah = filt(src, 'bp', (650, 950)) * 1.0 + filt(src, 'bp', (1050, 1350)) * 0.6 + filt(src, 'bp', (2500, 3100)) * 0.28
    e = env_asr(n, 0.55, 0.85, dur)
    return ah * e[:, None] * g / max(1, len(notes)) ** 0.5


def braam(root_m, g=1.0, seed=0, dur=2.8):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros((n, 2))
    for i, m in enumerate((root_m, root_m + 7, root_m + 12)):
        x += ensemble(np.full(n, hz(m)), n, 5, 22, seed + i, 0.9)
    x = np.tanh(3.2 * x)
    fc = 260 + 2600 * np.exp(-((t - 0.18) / 0.45) ** 2) + 500 * np.exp(-t / 1.2)
    x = np.stack([sweep_filter(x[:, c], 'lp', fc, block=256) for c in range(2)], axis=1)
    sub = np.sin(2 * np.pi * hz(root_m - 12) * t) * 0.6
    e = np.minimum(1, t / 0.03) * np.exp(-t / 1.25)
    return (x + stereo(sub)) * e[:, None] * g * 0.8


def taiko(g=1.0, pitch=1.0, seed=0):
    n = int(1.1 * SR)
    t = np.arange(n) / SR
    f = (58 + 120 * np.exp(-t * 20)) * pitch
    body = sine_sweep(f, n) * np.exp(-t / 0.28) * 0.75
    over = sine_sweep(f * 1.51, n) * np.exp(-t / 0.12) * 0.6 + sine_sweep(f * 2.63, n) * np.exp(-t / 0.06) * 0.3
    slap = filt(rng(seed).standard_normal(n), 'bp', (220 * pitch, 2400 * pitch)) * np.exp(-t / 0.03) * 1.15
    return np.tanh(2.2 * (body + over + slap)) * g


def epic_snare(g=1.0, seed=0):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    r = rng(seed)
    noise = filt(r.standard_normal((n, 2)), 'bp', (900, 9000)) * np.exp(-t / 0.2)[:, None]
    body = stereo(np.sin(2 * np.pi * (200 + 60 * np.exp(-t * 30)) * t) * np.exp(-t / 0.07))
    return np.tanh(1.4 * (0.9 * noise + 0.7 * body)) * g


def crash(g=1.0, seed=0, dur=2.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = rng(seed)
    x = filt(r.standard_normal((n, 2)), 'hp', 3200) * np.exp(-t / 1.1)[:, None]
    x += filt(r.standard_normal((n, 2)), 'bp', (5000, 12000)) * (0.4 * np.exp(-t / 0.3))[:, None]
    return x * np.minimum(1, t / 0.002)[:, None] * g * 0.5


def shaker(g=1.0, seed=0):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    x = filt(rng(seed).standard_normal(n), 'bp', (4500, 11000)) * np.sin(np.pi * np.clip(t / 0.06, 0, 1)) ** 2
    return x * g


def piano(m, dur=2.2, g=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    x = np.zeros(n)
    for k in range(1, 9):
        fk = k * f * np.sqrt(1 + 0.00035 * k * k)
        if fk > 16000:
            break
        x += np.sin(2 * np.pi * fk * t) * (1 / k ** 1.25) * np.exp(-t / (1.8 / (1 + 0.45 * k)))
    hammer = filt(rng(int(m)).standard_normal(n), 'bp', (900, 4200)) * np.exp(-t / 0.008) * 0.15
    return (x + hammer) * np.minimum(1, t / 0.002) * g * 0.45


def build_epic(plan, n):
    """Returns (music, reverb send, extra) for the mixer, like build_music."""
    bpm = plan.get('bpm', 120)
    beat = 60 / bpm
    bar = 4 * beat
    six = beat / 4
    bars = plan['bars']
    drums = np.zeros((n, 2)); low = np.zeros((n, 2)); mid = np.zeros((n, 2)); send = np.zeros((n, 2))
    lp = np.ones(n) * 20000.0
    T_LO, T_HI = taiko(1.0, 1.0, 1), taiko(1.0, 1.75, 2)
    SN = epic_snare(1.0, 3)
    prev_mode = 'none'
    for b, spec in enumerate(bars):
        t0 = b * bar + plan.get('offset', 0.0)
        g = spec.get('gain', 1.0)
        mode = spec.get('drums', 'none')
        f = spec.get('lp', 1.0)
        f0, f1 = (f, f) if not isinstance(f, list) else f
        i0, i1 = int(t0 * SR), min(n, int((t0 + bar) * SR))
        if i1 > i0:
            x = np.linspace(f0, f1, i1 - i0)
            lp[i0:i1] = 900 * (20000 / 900) ** x          # never fully muffled: phones need the mids
        root, q = chord_notes(spec.get('chord'))
        # A drop: the music arrives. Braam, crash, and a reversed cymbal sucking into it.
        drop = mode in ('four', 'full', 'build') and prev_mode in ('none', 'pulse', 'intro', 'half')
        if (drop or b == 0 or spec.get('hit')) and root is not None:
            add(mid, braam(near(root, 33), 1.0, seed=b), t0, (0.55 if b else 0.7) * g)
            add(send, braam(near(root, 33), 1.0, seed=b), t0, 0.25 * g)
            add(drums, T_LO, t0, 1.0 * g)
            if b:
                add(drums, crash(1.0, b), t0, 0.8 * g)
                rc = crash(1.0, 50 + b, 1.2)[::-1]
                add(drums, rc, t0 - len(rc) / SR, 0.5 * g)
        # Drums
        if mode == 'pulse':
            for k in (0, 2):
                add(drums, T_LO, t0 + k * beat, 0.85 * g)
                add(drums, T_LO, t0 + k * beat + 0.2, 0.45 * g)
        if mode == 'intro':
            for k, v in ((0, 0.9), (1.5, 0.55), (2, 0.8), (3.5, 0.5)):
                add(drums, T_LO, t0 + k * beat, v * g)
        if mode in ('four', 'full', 'build'):
            for k, v in ((0, 1.0), (0.75, 0.55), (2, 0.95), (2.5, 0.6)):
                add(drums, T_LO, t0 + k * beat, v * g)
            for k in (1, 3):
                add(drums, SN, t0 + k * beat, 0.62 * g)
                add(send, SN, t0 + k * beat, 0.3 * g)
            for s in range(16):
                add(drums, pan(shaker(1.0, s), 0.3 if s % 2 else -0.3), t0 + s * six, (0.22 if s % 4 == 2 else 0.12) * g)
            if mode in ('full', 'build'):
                for k in (0.5, 1.5, 2.75, 3.5):
                    add(drums, T_HI, t0 + k * beat, 0.45 * g)
        if mode == 'half':
            add(drums, T_LO, t0, 1.0 * g)
            add(drums, T_LO, t0 + 1.5 * beat, 0.6 * g)
            add(drums, SN, t0 + 2 * beat, 0.7 * g)
            add(send, SN, t0 + 2 * beat, 0.4 * g)
        if mode == 'build' or spec.get('fill'):
            start = 2 if mode == 'build' else 3
            steps = int((4 - start) * 4)
            for s in range(steps):
                v = 0.35 + 0.6 * s / max(1, steps - 1)
                add(drums, T_HI if s % 2 else T_LO, t0 + start * beat + s * six, v * g)
        prev_mode = mode
        if root is None:
            continue
        chord_pcs = [(root + iv) % 12 for iv in q[:3]]
        # Low strings: driving eighths on the root, octave jump on the 'and' of 2.
        if spec.get('bass', 0):
            bm = near(root, 36)
            for s in range(8):
                m = bm + (12 if s in (3, 7) else 0)
                v = (1.0 if s in (0, 3, 4) else 0.62) * spec['bass']
                add(low, low_string(m, beat / 2 * 0.9, 1.0, seed=b * 8 + s), t0 + s * beat / 2, 0.5 * v * g)
        # Strings pad and choir.
        if spec.get('pad', 0):
            notes = sorted(near(pc, 55) for pc in chord_pcs) + [near(chord_pcs[0], 67)]
            trem = 0.5 if mode in ('pulse', 'none') else 0.0
            add(mid, strings_pad(notes, bar, 1.0, seed=b, tremolo=trem), t0, 0.5 * spec['pad'] * g)
            add(send, strings_pad(notes, bar, 1.0, seed=b + 99), t0, 0.18 * spec['pad'] * g)
            if mode not in ('pulse',):
                cn = sorted(near(pc, 60) for pc in chord_pcs)
                add(mid, choir(cn, bar, 1.0, seed=b), t0, 0.34 * spec['pad'] * g)
                add(send, choir(cn, bar, 1.0, seed=b + 7), t0, 0.22 * spec['pad'] * g)
        # Spiccato ostinato: the engine of an epic cue.
        arp = spec.get('arp')
        if arp:
            tones = sorted(near(pc, 57) for pc in chord_pcs)
            pat = [tones[0], tones[0], tones[2], tones[0], tones[1] + 12, tones[0], tones[2], tones[1]]
            if arp == 'down':
                pat = pat[::-1]
            ag = spec.get('arpgain', 1.0)
            for s in range(16):
                m = pat[s % 8] + (12 if s % 8 == 4 else 0)
                acc = 1.0 if s % 4 == 0 else (0.75 if s % 2 == 0 else 0.55)
                add(mid, pan(spiccato(m, 1.0, seed=s + b * 16)[:, 0], 0.25 * np.sin(s)), t0 + s * six, 0.3 * acc * ag * g)
        # The theme: brass in the big moments, piano when it's quiet.
        mel = spec.get('melody')
        if mel is None and b >= len(bars) - 3 and mode in ('full', 'four', 'build'):
            mel = 'brass'
        if mel:
            top = sorted(near(pc, 64) for pc in chord_pcs)
            phrase = [(0, 1.5, top[2]), (1.5, 0.5, top[0] + 12 if top[0] + 12 <= 81 else top[1]), (2.0, 2.0, top[1] + 12 if top[1] + 12 <= 83 else top[2])]
            for (s, d, m) in phrase:
                if mel == 'brass':
                    x = brass(m, d * beat, 1.0, seed=b * 3 + int(s * 2))
                    add(mid, x, t0 + s * beat, 0.34 * g)
                    add(mid, brass(m - 12, d * beat, 1.0, seed=b * 5 + 1), t0 + s * beat, 0.22 * g)
                    add(send, x, t0 + s * beat, 0.22 * g)
                else:
                    x = piano(m, 2.2)
                    add(mid, stereo(x), t0 + s * beat, 0.5 * g)
                    add(send, stereo(x), t0 + s * beat, 0.3 * g)
    # Risers and rolls from the plan.
    for rz in plan.get('risers', []):
        a, b_ = rz[0], rz[1]
        gg = rz[2] if len(rz) > 2 else 1.0
        add(drums, fx_riser(b_ - a, seed=int(a * 10)), a, 0.45 * gg)
    for rl in plan.get('rolls', []):
        a, b_ = rl[0], rl[1]
        t = a
        k = 0
        while t < b_ - 1e-6:
            p = (t - a) / (b_ - a)
            add(drums, epic_snare(0.3 + 0.6 * p, seed=40 + k), t, 0.55)
            t += six * (2 if p < 0.5 else 1)
            k += 1
    music = drums * 0.9 + low * 0.85 + mid * 1.1
    music = sweep_filter(music, 'lp', lp, block=256)
    send = sweep_filter(send, 'lp', lp, block=256)
    return music, send, np.zeros_like(music)



# ---------------------------------------------------------------- the beat style
# For games, lists and tier lists: punchy drums, a saturated 808 that phones can hear through its
# harmonics, snaps and claps, marimba-like mallets, a warm pad ducked by the kick, and a short motif.
def kick808(m, dur, g=1.0, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m) * (1 + 1.4 * np.exp(-t * 34))
    body = sine_sweep(f, n) * np.exp(-t / max(0.12, dur * 0.6))
    knock = sine_sweep(170 + 220 * np.exp(-t * 55), n) * np.exp(-t / 0.022) * 0.7
    click = filt(rng(seed).standard_normal(n), 'hp', 3200) * np.exp(-t / 0.0022) * 0.35
    x = np.tanh(3.6 * (body + knock)) / np.tanh(3.6) + click
    x = filt(x, 'hp', 48) + 0.35 * filt(x, 'bp', (140, 900))
    return x * adsr(n, 0.001, 0.05, 1, min(0.04, dur * 0.2)) * g


def kick_tight(seed=5):
    """The beat style's kick: less sub than the cinematic one, more knock, so it punches on a phone."""
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    body = 0.8 * sine_sweep(56 + 115 * np.exp(-t * 40), n) * np.exp(-t / 0.15)
    knock = sine_sweep(190 + 160 * np.exp(-t * 70), n) * np.exp(-t / 0.024) * 0.55
    click = filt(rng(seed).standard_normal(n), 'hp', 2800) * np.exp(-t / 0.003) * 0.4
    x = np.tanh((body + knock) * 2.0) / np.tanh(2.0) + click
    return filt(x, 'hp', 30)


def snap(seed=6):
    n = int(0.14 * SR)
    t = np.arange(n) / SR
    r = rng(seed)
    crack = filt(r.standard_normal(n), 'bp', (1800, 7500)) * np.exp(-t / 0.014)
    tone = np.sin(2 * np.pi * 2100 * t) * np.exp(-t / 0.006) * 0.4
    return (crack + tone) * 0.9


def mallet(m, g=1.0, dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.22)
         + 0.38 * np.sin(2 * np.pi * f * 3.99 * t) * np.exp(-t / 0.035)
         + 0.16 * np.sin(2 * np.pi * f * 10.2 * t) * np.exp(-t / 0.008))
    return x * np.minimum(1, t / 0.0015) * g


def roll_env(n, times, depth=0.55, rel=0.13):
    """Sidechain: a gain curve that dips at each kick and recovers."""
    g = np.ones(n)
    for tt in times:
        i = int(tt * SR)
        if i >= n:
            continue
        L = min(n - i, int(0.5 * SR))
        x = np.arange(L) / SR
        g[i:i + L] = np.minimum(g[i:i + L], 1 - depth * np.exp(-x / rel))
    return g


def build_beat(plan, n):
    bpm = plan.get('bpm', 120)
    beat = 60 / bpm
    bar = 4 * beat
    six = beat / 4
    bars = plan['bars']
    drums = np.zeros((n, 2)); low = np.zeros((n, 2)); mid = np.zeros((n, 2)); send = np.zeros((n, 2))
    lp = np.ones(n) * 20000.0
    kicks = []
    KICK = kick_tight()
    CLAP = clap(9)
    prev_mode = 'none'
    for b, spec in enumerate(bars):
        t0 = b * bar + plan.get('offset', 0.0)
        g = spec.get('gain', 1.0)
        mode = spec.get('drums', 'none')
        f = spec.get('lp', 1.0)
        f0, f1 = (f, f) if not isinstance(f, list) else f
        i0, i1 = int(t0 * SR), min(n, int((t0 + bar) * SR))
        if i1 > i0:
            lp[i0:i1] = 900 * (20000 / 900) ** np.linspace(f0, f1, i1 - i0)
        root, q = chord_notes(spec.get('chord'))
        drop = mode in ('bounce', 'trap', 'build') and prev_mode in ('none', 'intro', 'half')
        if (drop or b == 0 or spec.get('hit')) and root is not None:
            add(drums, stereo(fx_impact(60 + b, 0.8)), t0, 0.55 * g)
            if b:
                add(drums, crash(1.0, b), t0, 0.6 * g)
                rc = crash(1.0, 70 + b, 1.0)[::-1]
                add(drums, rc, t0 - len(rc) / SR, 0.4 * g)
        # Drums
        if mode in ('intro', 'bounce', 'build'):
            for s in range(8):
                add(drums, pan(hat(False, 30 + s), 0.25), t0 + s * beat / 2 + beat / 4 * (mode != 'intro'), (0.5 if mode == 'intro' else 0.42) * g)
            for k in (1, 3):
                add(drums, pan(snap(40 + k), -0.15), t0 + k * beat, (0.65 if mode == 'intro' else 0.5) * g)
        if mode in ('bounce', 'build'):
            for k in range(4):
                add(drums, stereo(KICK), t0 + k * beat, 0.95 * g); kicks.append(t0 + k * beat)
            for k in (1, 3):
                add(drums, CLAP, t0 + k * beat, 1.05 * g); add(send, CLAP, t0 + k * beat, 0.3 * g)
            for s in range(16):
                add(drums, pan(hat(False, 50 + s), -0.3 if s % 2 else 0.3), t0 + s * six, (0.32 if s % 4 == 2 else 0.18) * g)
            add(drums, pan(hat(True, 7), 0.2), t0 + 3.5 * beat, 0.35 * g)
        if mode == 'trap':
            for k in (0, 1.75, 2.5):
                kicks.append(t0 + k * beat)
            add(drums, CLAP, t0 + 2 * beat, 1.1 * g); add(send, CLAP, t0 + 2 * beat, 0.35 * g)
            add(drums, pan(snap(8), 0.1), t0 + 2 * beat, 0.7 * g)
            s = 0.0
            while s < 4 - 1e-6:
                roll = s >= 3.5
                step = beat / 6 if roll else beat / 2 if s < 1 else beat / 4
                add(drums, pan(hat(False, 90 + int(s * 16)), 0.35), t0 + s * beat, (0.3 if roll else 0.24) * g)
                s += step / beat
        if mode == 'half':
            add(drums, stereo(KICK), t0, 0.9 * g); kicks.append(t0)
            add(drums, CLAP, t0 + 2 * beat, 0.75 * g); add(send, CLAP, t0 + 2 * beat, 0.35 * g)
        if mode == 'build' or spec.get('fill'):
            start = 2 if mode == 'build' else 3
            steps = int((4 - start) * 4)
            for s in range(steps):
                v = 0.3 + 0.6 * s / max(1, steps - 1)
                add(drums, snare(v, 60 + s), t0 + start * beat + s * six, 0.55)
        prev_mode = mode
        if root is None:
            continue
        chord_pcs = [(root + iv) % 12 for iv in q[:3]]
        # Bass: an 808 in trap bars, a bouncing sub on the off-beats in bounce bars.
        if spec.get('bass', 0):
            bm = near(root, 33)
            if mode == 'trap':
                for k, L in ((0, 1.6), (1.75, 0.7), (2.5, 1.4)):
                    add(low, stereo(kick808(bm, L * beat, 1.0, seed=b * 4 + int(k * 4))), t0 + k * beat, 0.42 * spec['bass'] * g)
            else:
                for k in range(4):
                    add(low, stereo(kick808(bm + (12 if k == 3 else 0), beat * 0.45, 1.0, seed=b * 8 + k)), t0 + k * beat + beat / 2, 0.3 * spec['bass'] * g)
        if spec.get('pad', 0):
            notes = sorted(near(pc, 55) for pc in chord_pcs) + [near(chord_pcs[0], 67)]
            x = pad_chord(notes, bar, seed=b)
            add(mid, x, t0, 0.72 * spec['pad'] * g); add(send, x, t0, 0.3 * spec['pad'] * g)
            if mode in ('bounce', 'build'):
                # Off-beat chord stabs: the bounce, and the presence a phone speaker needs.
                stab = sorted(near(pc, 67) for pc in chord_pcs)
                for k in (0.5, 1.5, 2.5, 3.5):
                    x = sum(pluck(m, 1.0, 0.2) for m in stab)
                    add(mid, pan(x, 0.2 if k % 2 else -0.2), t0 + k * beat, 0.2 * g)
        arp = spec.get('arp')
        if arp:
            tones = sorted(near(pc, 64) for pc in chord_pcs)
            pat = [tones[0], tones[2], tones[1] + 12, tones[2], tones[0] + 12, tones[2], tones[1] + 12, tones[2]]
            if arp == 'down':
                pat = pat[::-1]
            ag = spec.get('arpgain', 1.0)
            for s in range(16):
                if s % 8 in (3, 7) and mode == 'trap':
                    continue
                acc = 1.0 if s % 4 == 0 else 0.7
                add(mid, pan(mallet(pat[s % 8], 1.0), 0.3 * np.sin(s * 1.3)), t0 + s * six, 0.4 * acc * ag * g)
                add(mid, pan(pluck(pat[s % 8] + 12, 1.0, 0.18), -0.3 * np.sin(s * 1.3)), t0 + s * six, 0.16 * acc * ag * g)
        # The motif: four notes that close the piece (and any bar that asks for it).
        mel = spec.get('melody')
        if mel is None and b >= len(bars) - 2 and mode in ('bounce', 'trap'):
            mel = 'motif'
        if mel:
            top = sorted(near(pc, 72) for pc in chord_pcs)
            for (s, m) in ((0, top[2]), (0.75, top[1]), (1.5, top[0]), (2.5, top[2] + 12 if top[2] + 12 <= 91 else top[1])):
                x = stereo(bell(m, 1.2, 0.9) + 0.6 * mallet(m, 1.0, 1.2))
                add(mid, x, t0 + s * beat, 0.3 * g); add(send, x, t0 + s * beat, 0.3 * g)
    for rz in plan.get('risers', []):
        a, b_ = rz[0], rz[1]
        add(drums, fx_riser(b_ - a, seed=int(a * 10)), a, 0.4 * (rz[2] if len(rz) > 2 else 1.0))
    for rl in plan.get('rolls', []):
        a, b_ = rl[0], rl[1]
        t = a; k = 0
        while t < b_ - 1e-6:
            p = (t - a) / (b_ - a)
            add(drums, snare(0.3 + 0.6 * p, seed=140 + k), t, 0.5)
            t += six * (2 if p < 0.5 else 1); k += 1
    duck = roll_env(n, kicks)[:, None]
    mid = mid + 0.6 * filt(mid, 'bp', (1200, 4200))
    music = drums * 0.95 + low * 0.9 * duck + mid * 1.05 * duck
    music = sweep_filter(music, 'lp', lp, block=256)
    send = sweep_filter(send, 'lp', lp, block=256)
    return music, send, np.zeros_like(music)

# ---------------------------------------------------------------- mix
def main(meta_path, wav_path):
    meta = json.load(open(meta_path))
    dur = meta['duration']
    n = int((dur + TAIL) * SR)
    plan = meta.get('music') or {'bpm': meta.get('bpm', 120), 'bars': []}

    music, msend, music_verb = (build_beat if plan.get('style') == 'beat' else build_epic)(plan, n)
    sfx = np.zeros((n, 2))
    send = msend + music_verb

    count = {}
    for c in meta['cues']:
        name, t, g = c['name'], c['t'], c.get('gain', 1.0)
        k = count.get(name, 0)
        count[name] = k + 1
        seed = c.get('seed', 100 + k)
        if name == 'impact':
            x = fx_impact(seed, c.get('big', 1.0)); add(sfx, x, t, 0.75 * g); add(send, x, t, 0.35 * g)
        elif name == 'boom':
            add(sfx, fx_boom(seed), t, 0.8 * g)
        elif name == 'whoosh':
            x = fx_whoosh(c.get('dur', 0.6), seed, c.get('up', True)); add(sfx, x, t, 0.55 * g); add(send, x, t, 0.2 * g)
        elif name == 'downer':
            add(sfx, fx_downer(c.get('dur', 1.2), seed), t, 0.5 * g)
        elif name == 'riser':
            add(sfx, fx_riser(c.get('dur', 1.0), seed), t, 0.45 * g)
        elif name == 'pop':
            x = fx_pop(c.get('note', k % 5), seed); add(sfx, pan(x, c.get('pan', 0)), t, 0.4 * g); add(send, x, t, 0.12 * g)
        elif name == 'tick':
            add(sfx, fx_tick(c.get('tock', k % 2 == 1), seed), t, 0.45 * g)
        elif name == 'type':
            add(sfx, pan(fx_type(seed), 0.1), t, 0.3 * g)
        elif name == 'sparkle':
            root, q = chord_notes(chord_at(plan, t))
            x = fx_sparkle(seed, near(root, 76)); add(sfx, x, t, 0.35 * g); add(send, x, t, 0.35 * g)
        elif name == 'ident':
            root, q = chord_notes(chord_at(plan, t))
            notes = [near((root + iv) % 12, 69 + 3 * j) for j, iv in enumerate(q[:3])]
            notes = sorted(notes)
            x = fx_ident(notes, seed); add(sfx, x, t, 0.4 * g); add(send, x, t, 0.4 * g)
        elif name == 'scribble':
            add(sfx, pan(fx_scribble(c.get('dur', 0.6), seed), 0.1), t, 0.5 * g)
        elif name == 'glitch':
            add(sfx, fx_glitch(seed), t, 0.4 * g)
        elif name == 'deal':
            add(sfx, pan(fx_deal(seed), c.get('pan', 0)), t, 0.6 * g)
        elif name == 'flip':
            add(sfx, fx_flip(seed), t, 0.55 * g)
        elif name == 'heart':
            add(sfx, fx_heart(seed), t, 0.8 * g)
        elif name == 'shimmer':
            root, q = chord_notes(chord_at(plan, t))
            x = fx_shimmer(c.get('dur', 1.2), seed, near(root, 76)); add(sfx, x, t, 0.35 * g); add(send, x, t, 0.4 * g)
        elif name == 'flap':
            add(sfx, pan(fx_flap(seed), c.get('pan', 0)), t, 0.3 * g)
        elif name == 'click':
            add(sfx, fx_click(seed), t, 0.5 * g)
        elif name == 'thud':
            add(sfx, fx_thud(seed), t, 0.7 * g); add(send, fx_thud(seed), t, 0.2 * g)
        else:
            raise SystemExit(f'unknown cue {name}')

    ir = make_ir(dur=3.4, rt60=2.6)
    wet = reverb(send, ir)
    mix = music * 0.9 + sfx + wet * 0.42
    # Master EQ for small speakers: clear the sub rumble, lift the presence band.
    mix = filt(mix, 'hp', 38)
    mix = mix + 0.35 * filt(mix, 'bp', (1400, 5200))

    # The Short loops, so whatever rings past the end plays over the start.
    N = int(dur * SR)
    tail = mix[N:]
    mix = mix[:N].copy()
    mix[:len(tail)] += tail[:N]

    # Glue: a slow RMS compressor, then a soft clip, then peak to -1 dBFS.
    rms = np.sqrt(signal.lfilter([1 - np.exp(-1 / (0.05 * SR))], [1, -np.exp(-1 / (0.05 * SR))], np.mean(mix ** 2, axis=1)) + 1e-12)
    thr = np.percentile(rms, 90) * 0.7
    gain = np.where(rms > thr, (thr / rms) ** (1 - 1 / 2.0), 1.0)
    gain = signal.lfilter([1 - np.exp(-1 / (0.08 * SR))], [1, -np.exp(-1 / (0.08 * SR))], gain)
    mix *= gain[:, None]
    peak = np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix / peak * 1.4) / np.tanh(1.4) * 10 ** (-1 / 20)
    wavfile.write(wav_path, SR, mix.astype(np.float32))
    print(f'audio {wav_path}: {dur:.2f}s, {len(meta["cues"])} cues, {len(plan.get("bars", []))} bars')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
