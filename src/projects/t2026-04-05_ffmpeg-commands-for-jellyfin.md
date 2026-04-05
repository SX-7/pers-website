---
title: ffmpeg commands for jellyfin
description: Collection of commands that I use to store more with less
type: page
---

In general the workflow is like this:

1. Get movies
2. Reencode the best ones
3. Combine them in a container.

## Video reencoding

### The Command:

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

### Line by line explanation:
0. In general we use the default ffmpeg but I haven't researched the alternatives.
1. Some HQ content has a lot of metadata that will often show up a LOT in logs, this avoids it.
2. Needed, otherwise no status info (sad).
3. In this part of the whole process we want the highest quality source. Since target is FHD, going for 4K as source generally nulls most artifacts.
4. We want only video, and only first (usually best) stream.
5. This effectively forces FHD, and if the source is not 16:9, adds black bars.
6. Use AV1.
7. Preset 4, tho 3 is usually 10% better, worth it if you have time.
