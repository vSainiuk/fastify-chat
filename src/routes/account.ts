import { FastifyPluginAsync } from 'fastify'
import { register } from '../handlers/account/register'

const accountRoutes: FastifyPluginAsync = async fastify => {
	fastify.post('/register', register)
}

export default accountRoutes
