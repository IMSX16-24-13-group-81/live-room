import fastify from "fastify"
import { getDB } from "./db/config"
import { buildings } from "./db/schema"

const server = fastify()

const main = async () => {
  const db = await getDB()
  console.log("DB", db)

  await db.insert(buildings).values([
    {
      name: "BYGGNAD 1",
      description: "EN LITEN BESKRIVNING",
    },
  ])

  server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

  console.log("THIS DID RUN")
  server.get("/ping", async (request, reply) => {
    return "pong\n"
  })
}

main()
