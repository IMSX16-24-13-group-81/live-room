FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Copy source files and build
COPY . .
RUN pnpm run build
RUN pnpm prune --production

# Explicitly copy the swagger.json to a known location in the builder stage
COPY swagger.json /app/dist/swagger/

FROM node:20-alpine

WORKDIR /app

# Copy the build artifacts and dependencies from the builder stage
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/drizzle drizzle/

# Copy the swagger.json from the builder stage to the final image
COPY --from=builder /app/dist/swagger/swagger.json /app/dist/swagger/swagger.json

# Copy package.json and expose the port
COPY package.json .
EXPOSE 8080
ENV NODE_ENV=production

# Start the application
CMD [ "node", "/app/dist/index.js" ]
