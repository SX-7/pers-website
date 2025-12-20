# Dev Container Setup

This is basically _just_ for GitHub codespaces, and isn't tested anywhere else.

If you want to develop locally, it's recommended to simply run npm commands in most cases instead, unless you do not want to have node installed.

App will be exposed on port 8080 by default.

Because it and default container both use hooks, it'll fail on container setup, just run `npm ci && npm run build` after start if that happens.

Devcontainer automatically hides most config files, `"amodio.toggle-excluded-files"` extension comes included in case you wish to see them.
