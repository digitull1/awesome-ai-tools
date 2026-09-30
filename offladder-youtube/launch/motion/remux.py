"""Give rendered Shorts a fresh soundtrack without re-rendering the picture.

Usage: python3 remux.py <piece> [<piece> ...]

For each piece: synthesises the score from out/<piece>.meta.json (written by render.cjs), normalises
it to -14 LUFS in two passes, and muxes it with the existing video stream (copied, not re-encoded)
into videos/<piece>.mp4.
"""
import json
import os
import shutil
import subprocess
import sys

import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()


def loudnorm_filter(wav):
    r = subprocess.run([FF, '-hide_banner', '-nostats', '-i', wav, '-af',
                        'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True)
    txt = r.stderr[r.stderr.rindex('{'):]
    m = json.loads(txt[:txt.index('}') + 1])
    return ('loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={input_i}:measured_TP={input_tp}:'
            'measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true').format(**m)


def remux(piece):
    out = os.path.join(HERE, 'out')
    meta = os.path.join(out, f'{piece}.meta.json')
    wav = os.path.join(out, f'{piece}.wav')
    video = os.path.join(HERE, 'videos', f'{piece}.mp4')
    if not os.path.exists(video):
        shutil.copy(os.path.join(out, f'{piece}.mp4'), video)
    subprocess.run([sys.executable, os.path.join(HERE, 'audio.py'), meta, wav], check=True)
    tmp = os.path.join(out, f'{piece}.remux.mp4')
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', video, '-i', wav, '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-af', loudnorm_filter(wav), '-ar', '48000', '-c:a', 'aac', '-b:a', '256k',
                    '-movflags', '+faststart', '-shortest', tmp], check=True)
    os.replace(tmp, video)
    print(f'remuxed {video}')


if __name__ == '__main__':
    for p in sys.argv[1:]:
        remux(p)
