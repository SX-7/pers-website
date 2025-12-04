# Dev Container Setup

This is basically _just_ for GitHub codespaces, and isn't tested anywhere else.

If you want to develop locally, it's recommended to use `dev_setup.sh` in most cases instead, unless you do not want to have python/node installed.

App will be exposed on port 5000 by default.

## Notes

- `postCreateCommand` may fail with an error like `dial unix [...]/docker-containerd.sock: connect: timeout`, if that happens then run `/usr/local/share/docker-init.sh` and rerun the `docker-compose` command. It does so automatically once, but it may fail since codespaces are not reliable.

- Tailwind container spits out a bunch of info text every time it rebuilds, generally don't watch it or log it.
