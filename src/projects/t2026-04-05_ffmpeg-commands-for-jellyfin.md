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

### The Video

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

### Line by line explanation

0. In general we use the default ffmpeg but I haven't researched the alternatives.
1. Some HQ content has a lot of metadata that will often show up a LOT in logs, this avoids it.
2. Needed, otherwise no status info (sad).
3. In this part of the whole process we want the highest quality source. Since target is FHD, going for 4K as source generally nulls most artifacts.
4. We want only video, and only first (usually best) stream.
5. This effectively forces FHD, and if the source is not 16:9, adds black bars.
6. Use AV1.
7. Preset 4, tho 3 is usually 10% better, worth it if you have time.
8. 26 is the best initially but feel free to tweak it.
9. 10 bit colors for better darks and better compression efficiency.
10. AV1 args; some grain synthesis, optimize for visual quality, etc.
11. No audio or subtitles, this is only video for now.

This will leave you with video file, duh. But what about audio?

## The Audio

Quite simpler, Opus is just the best.

```sh
ffmpeg -i audio_donor.mkv -map 0:a:0   -c:a libopus -af "aformat=channel_layouts=5.1" -b:a 192k -vbr on -vn -sn audio.mka
```

The only thing I'll explain is that `-af` is there mostly cuz `5.1(side)` layout is common, but unrecognizable by `ffmpeg` automatically. This helps that. Shippable otherwise tho since jellyfin reencodes it on the fly anyways.

Oh yeah and do it for Polish audio too. Also change the mapping if needed.

## The Subtitles

Optional since jellyfin gets them from OpenSubtitles automatically.

```sh
ffmpeg -i sub_donor.mkv -map 0:s:0 -vn -an sub.srt
```

Similarly, change mapping if needed.

## The Mux

```sh
ffpmeg -i output.mkv -i out-en.mka -i out-pl.mka -i sub_en.srt -map 0:v -map 1:a -map 2:a -map 3:s -c copy -metadata:s:a:0 language=eng -metadata:s:a:0 title="English Opus" -metadata:s:a:1 language=pol -metadata:s:a:1 title="Polish Opus" -metadata:s:s:0 language=eng -metadata:s:s:0 title="English (SRT)" -movflags +faststart final.mp4
```

Just combines them all. Always use copy and movflags, but metadata is optional since the source should have it by default 99% of time. MP4 is most compatible and with the movflags it can be streamed - even tho jellyfin will transcode it almost always since AV1 has random support.

*Alternatively*, there's this justfile that does the thing - and is much more convenient to use.

```
[no-cd]
video INPUT OUTPUT="output.mkv" STREAM="0:v:0":
  ffmpeg \
    -loglevel repeat+level+error -stats \
    -i {{INPUT}} \
    -map {{STREAM}} \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \
    -c:v libsvtav1 -preset 4 -crf 26 -pix_fmt yuv420p10le \
    -svtav1-params film-grain=10:tune=0:keyint=10s:enable-overlays=1 \
    -an -sn {{OUTPUT}}

[no-cd]
audio INPUT OUTPUT="output.mka" STREAM="0:a:0":
  ffmpeg \
    -i {{INPUT}} -map {{STREAM}} -c:a libopus \
    -af -b:a 192k -vbr on \
    -vn -sn {{OUTPUT}}

[no-cd]
audio_51 INPUT OUTPUT="output.mka" STREAM="0:a:0":
  ffmpeg \
    -i {{INPUT}} -map {{STREAM}} -c:a libopus \
    -af "aformat=channel_layouts=5.1" -b:a 192k -vbr on \
    -vn -sn {{OUTPUT}}

[no-cd]
mux VIDEO="output.mkv" AUDIO="output.mka" OUTPUT="final.mp4" *ADDITIONAL_ARGS="":
  ffpmeg \
    -i {{VIDEO}} -i {{AUDIO}} {{ADDITIONAL_ARGS}} \
    -map 0:v -map 1:a -c copy -movflags +faststart {{OUTPUT}}
```
