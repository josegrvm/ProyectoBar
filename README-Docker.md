# BarSplit — Docker

## Requisitos
- Docker Desktop (o Docker Engine + docker-compose plugin)

## Levantar todo
```bash
docker compose up --build
```

Servicios:
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:4000/api
- MongoDB: mongodb://localhost:27017

**Nota:** el frontend usa `VITE_API_URL=http://backend:4000/api` dentro de la red de Docker; hacia el navegador se expone en `http://localhost:5173`.

## Variables
- `backend`:
  - `MONGO_URI=mongodb://mongo:27017/barsplit`
  - `CORS_ORIGIN=http://localhost:5173`
  - `PORT=4000`
- `frontend`:
  - `VITE_API_URL=http://backend:4000/api`

## Detener
```bash
docker compose down
```

## Persistencia
- Volumen `mongo_data` guarda la base de datos entre reinicios.
