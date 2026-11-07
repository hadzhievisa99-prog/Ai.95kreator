#!/usr/bin/env bash
# Grades the raw shot renders (public/shots/*.mp4) and encodes them as VP9 WebM,
# which the open-source Chromium used for rendering can decode.
# Usage: capture/grade.sh [shotId ...]
set -euo pipefail
cd "$(dirname "$0")/../public/shots"
G="colorbalance=rs=0.05:bs=-0.07:rm=0.06:gm=0.01:bm=-0.06:rh=0.03:bh=-0.05,eq=contrast=1.13:saturation=1.12:gamma=0.99,curves=master='0/0.015 0.22/0.18 0.5/0.5 0.78/0.81 1/0.97',vignette=angle=PI/5:mode=forward,unsharp=5:5:0.35"
ids=("$@"); [ ${#ids[@]} -eq 0 ] && ids=($(ls *.mp4 | sed 's/\.mp4$//'))
for id in "${ids[@]}"; do
  ffmpeg -loglevel error -y -i "$id.mp4" -vf "$G" -c:v libvpx-vp9 -crf 20 -b:v 0 -row-mt 1 -deadline good -cpu-used 4 -pix_fmt yuv420p "$id.webm"
  echo "graded $id"
done
