# Tools

- **TaskNote:** https://tasknote.local
- **Docker Hub:** https://hub.docker.com/
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
