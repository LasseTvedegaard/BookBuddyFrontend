# frontend/Dockerfile

# 1. Build step: Brug Node.js til at bygge React-appen
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. Production step: Brug NGINX til at servere bygget frontend
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
