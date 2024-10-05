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

- Client
```sh
docker run -d --rm \
  -p 80:5000 \
  -e VITE_BUILD="client:50" \
  -e VITE_BACKEND_SERVER="http://localhost:8585" \
  --name tasknote \
  ghcr.io/ricardo-campos-org/react-typescript-todolist/client:50
```

- Java API
```sh
docker run -d --rm \
  -p 8585:8585 \
  -e CORS_ALLOWED_ORIGINS="http://localhost:5000" \
  -e POSTGRES_DB=tasknote \
  -e POSTGRES_HOST=localhost \
  -e POSTGRES_USER=tasknoteuser \
  -e POSTGRES_PASSWORD=default \
  -e POSTGRES_PORT=5435 \
  --name server \
  ghcr.io/ricardo-campos-org/react-typescript-todolist/server:50
```
or
```sh
docker compose --file docker-compose.prod.yml up -d server
```

- DB
```sh
docker run -d --rm \
  -p 5435:5432 \
  -e POSTGRES_DB="tasknote" \
  -e POSTGRES_USER="tasknoteuser" \
  -e POSTGRES_PASSWORD="default" \
  -e POSTGRES_PORT=5435 \
  -e PGDATA=/tmp \
  -v "./data:/tmp" \
  --name db \
  postgres:15.8-bookworm
```
or
```sh
docker compose --file docker-compose.prod.yml up -d db
```

- Get container IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db

# Manual Client build & deploy

```sh
export VERSION=
export IP=

npm ci --ignore-scripts --no-update-notifier --omit=dev
export VITE_BACKEND_SERVER=/server
npm run build
zip -r client_$VERSION.zip dist/
scp client_86.zip root@$IP:/root/
```