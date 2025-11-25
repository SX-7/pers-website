# Dev Container Setup

This is basically *just* for GitHub codespaces, and isn't tested anywhere else.

If you want to develop locally, it's recommended to use `dev_setup.sh` in most cases instead, unless you do not want to have python/node installed.

App will be exposed on port 5000 by default.

## Notes

- `postCreateCommand` may fail with an error like `dial unix [...]/docker-containerd.sock: connect: connection refused`, if that happens then either restart entire codespace, or `killall -9 dockerd; sudo dockerd &` (or anything that'll restart `dockerd` service)

- The above command is being ran by default, if you have some slow system it might fail due to race conditions, in which case run the commands seperately manually, or add `sleep` to command chain.

- Tailwind container spits out a bunch of info text every time it rebuilds, generally don't watch it or log it