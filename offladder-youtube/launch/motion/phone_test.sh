#!/bin/sh
# Loudness of a mix as heard on a phone speaker (nothing below ~300 Hz) against full range.
FF=$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')
full=$($FF -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | sed -n '/Summary/,$p' | grep -m1 " I:" | awk '{print $2}')
phone=$($FF -hide_banner -nostats -i "$1" -af "highpass=f=300:poles=2,highpass=f=300:poles=2,lowpass=f=12000,ebur128" -f null - 2>&1 | sed -n '/Summary/,$p' | grep -m1 " I:" | awk '{print $2}')
echo "$1: full $full LUFS, phone $phone LUFS"
