FROM node:16-bullseye-slim AS build-stage
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
USER node

COPY package*.json ./
RUN npm ci --unsafe-perm  # Added unsafe-perm flag
COPY --chown=node:node . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf