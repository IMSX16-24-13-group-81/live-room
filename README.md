# Live Room

A web service for collecting and displaying live occupation information about rooms, written with Fastify and Svelte.

For the embedded software that reports the occupation status of the rooms, see [live-room-sensor](https://github.com/IMSX16-24-13-group-81/live-room-sensor).

# Backend

## Running in development

The backend requires at least Node.js 20.
In order to start in development mode start off by installing dependencies:

```bash
cd backend
pnpm install
```

Then, copy the `.env.example` file to `.env` and modify the environment variables as needed.
After that, generate the database schema and start the server:

```bash
pnpm generate
pnpm dev
```
