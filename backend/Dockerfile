FROM node:16-bullseye-slim
RUN mkdir -p /app/storage && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "server.js"]