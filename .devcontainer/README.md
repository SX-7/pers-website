Dev Container (Compose)

This repository includes a Dev Container configuration that uses Docker Compose.

- The compose file is `docker-compose.yml` and defines three services:
  - `dev` — the workspace container VS Code will open into.
  - `web` — Flask development server (hot reload) exposed on port 5000.
  - `tailwind` — Tailwind CLI in watch mode that rebuilds `tailwind.css`.

How to use:

1. Open the repository in VS Code.
2. Command Palette -> Remote-Containers: Reopen in Container (or open the Codespace).
3. The devcontainer will use `docker-compose` and start the `web` and `tailwind` services.

Where logs appear:

- Compose service logs appear in the Docker extension (Containers view) or via `docker-compose logs -f`.
- VS Code tasks and terminals show real-time output in the Terminal panel. The Output panel is reserved for extensions — if you specifically need output in the Output panel we can add a small helper or extension to forward logs there.

Running combined logs in a Terminal

- The devcontainer is configured to start the `web` and `tailwind` services via Docker Compose.
- A workspace task is provided that runs on folder open and attaches a single dedicated terminal to the combined logs for both services:

  - Task: `Compose: Combined Logs (web + tailwind)`
  - Command: `docker-compose -f /workspace/docker-compose.yml logs -f web tailwind`

- This yields a single terminal tab that streams logs from both services, closely matching the previous in-container terminal experience.

Caveat

- The `docker-compose` command must be available where the task runs. In some setups (e.g., Codespaces or local Dev Containers using the Remote - Containers extension) the Docker daemon and compose CLI run on the host; VS Code's Dev Container support will still start the services. The `logs` task runs inside the workspace context — if you see permission or command-not-found errors, run the logs command on the host or enable Docker-in-Docker/remote Docker for the container.

If you want, I can add a small helper script that retries the logs command until services are up, or a lightweight extension to pipe compose logs into a VS Code Output channel.
