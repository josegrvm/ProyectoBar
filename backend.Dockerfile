# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package.json ./
RUN npm install --production=false
COPY backend ./
ENV PORT=4000
EXPOSE 4000
CMD ["npm", "run", "start"]
