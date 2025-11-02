# Frontend Dockerfile (Vite dev server)
FROM node:18-alpine
WORKDIR /app
COPY frontend/package.json ./
RUN npm install --production=false
COPY frontend ./
# Vite must bind to 0.0.0.0 to be reachable from outside the container
ENV VITE_API_URL=http://backend:4000/api
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
