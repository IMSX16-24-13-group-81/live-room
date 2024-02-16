FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 8080
ENV NODE_ENV=production
CMD [ "node", "/app/dist/index.js" ]