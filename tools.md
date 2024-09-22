# Tools

- **TaskNote:** https://tasknote.local
- **GitHub Container Registry:** https://ghcr.io/
- **Time tracking:** https://track.toggl.com/timer

# Building locally

Build with Docker:

```sh
docker build --build-arg BUILD=nightly -t tasknote:nightly .
```

Run with Docker:
```sh
docker run -it --rm \
  --name tasknote \
  tasknote:nightly
```
Build and run with Docker Compose:
```sh
docker compose --profile caddy up --build
```

# Interact with GitHub Package

Login in:

```
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u RMCampos --password-stdin
```

Pull image:

```sh
docker pull ghcr.io/ricardo-campos-org/react-typescript-todolist/client:50
```

Run it:

```sh
docker run -d --rm \
  -p 80:5000 \
  -e VITE_BUILD="client:50" \
  -e VITE_BACKEND_SERVER="http://localhost:8585" \
  --name tasknote \
  ghcr.io/ricardo-campos-org/react-typescript-todolist/client:50
```
