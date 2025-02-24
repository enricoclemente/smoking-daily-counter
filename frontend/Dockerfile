FROM node:16-bullseye-slim AS build-stage
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf