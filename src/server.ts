import dotenv from 'dotenv'
import Fastify from 'fastify'
import { config } from './config'
import { registerPlugins } from './plugins'
import { registerRoutes } from './routes'

dotenv.config()

const fastify = Fastify({ logger: true })

registerPlugins(fastify)
registerRoutes(fastify)

const start = async () => {
	try {
		await fastify.listen({ port: config.port, host: config.host })
		console.log(`Server is running at http://${config.host}:${config.port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
