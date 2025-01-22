import bcrypt from 'bcrypt'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { MESSAGES } from '../constants/messages'
import { prisma } from './prisma'

const authPlugin: FastifyPluginAsync = async fastify => {
	fastify.register(import('@fastify/basic-auth'), {
		validate: async (username, password, request, reply) => {
			const user = await prisma.user.findUnique({ where: { username } })

			if (!user || !(await bcrypt.compare(password, user.password))) {
				reply.code(401).send({ error: MESSAGES.AUTH.INVALID_CREDENTIALS })
			}
		},
		authenticate: { realm: 'Fastify-chat' },
	})

	fastify.decorateRequest('user')

	fastify.addHook('onRequest', (request, reply, done) => {
		if (request.url === '/account/register' && request.method === 'POST') {
			return done();
		}
		
		fastify.basicAuth(request, reply, async err => {
			if (err) return done(err)

			try {
				const authHeader = request.headers.authorization
				if (!authHeader) return done(new Error(MESSAGES.AUTH.UNAUTHORIZED))

				const credentials = Buffer.from(
					authHeader.split(' ')[1],
					'base64'
				).toString()
				const [username] = credentials.split(':')

				const user = await prisma.user.findUnique({
					where: { username },
				})

				if (!user) return done(new Error(MESSAGES.AUTH.UNAUTHORIZED))

				request.user = user
				done()
			} catch (error) {
				reply.code(401).send({ error: MESSAGES.AUTH.UNAUTHORIZED })
			}
		})
	})
}

export default fp(authPlugin)
