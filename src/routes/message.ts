import { User } from '@prisma/client'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { createFileMessage } from '../handlers/message/createFileMessage'
import { createTextMessage } from '../handlers/message/createTextMessage'
import { getContent } from '../handlers/message/getContent'
import { getList } from '../handlers/message/getList'

export interface AuthenticatedRequest extends FastifyRequest {
	user?: User
}

const messageRoutes: FastifyPluginAsync = async fastify => {
	fastify.register(import('@fastify/multipart'))

	fastify.post('/text', { preHandler: fastify.basicAuth }, createTextMessage)
	fastify.post('/file', { preHandler: fastify.basicAuth }, createFileMessage)
	fastify.get('/list', { preHandler: fastify.basicAuth }, getList)
	fastify.get('/content', { preHandler: fastify.basicAuth }, getContent)
}

export default messageRoutes
