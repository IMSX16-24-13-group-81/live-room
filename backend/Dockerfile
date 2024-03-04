FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build
RUN pnpm prune --production

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/drizzle drizzle/
COPY package.json .

EXPOSE 8080
ENV NODE_ENV=production
CMD [ "node", "/app/dist/index.js" ]
