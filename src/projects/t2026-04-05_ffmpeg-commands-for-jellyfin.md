---
title: ffmpeg commands for jellyfin
description: Collection of commands that I use to store more with less
type: page
---

In general the workflow is like this:

1. Get movies
2. Reencode the best ones
3. Combine them in a container.

The Command:

```sh
ffmpeg \
-loglevel repeat+level+error \
-stats \
-i high_quality_source.mov \
-map 0:v:0 \
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \
-c:v libsvtav1 \
-preset 4 \
-crf 26 \
-pix_fmt yuv420p10le \
-svtav1-params film-grain=10:tune=0:keyint=10s:enable-overlays=1 \
-an -sn output.mkv
```
