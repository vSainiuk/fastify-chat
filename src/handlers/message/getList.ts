import { FastifyReply } from 'fastify'
import { MESSAGES } from '../../constants/messages'
import { prisma } from '../../plugins/prisma'
import { AuthenticatedRequest } from '../../routes/message'
import { checkUserMiddleware } from '../../middleware/checkUserMiddleware'

export async function getList(
	request: AuthenticatedRequest,
	reply: FastifyReply
) {
	await checkUserMiddleware(request, reply)

	try {
		const { page = 1, limit = 10 } = request.query as {
			page?: number
			limit?: number
		}

		const skip = (page - 1) * limit

		const messages = await prisma.message.findMany({
			orderBy: { createdAt: 'desc' },
			skip,
			take: limit,
		})

		const totalMessages = await prisma.message.count()

		const totalPages = Math.ceil(totalMessages / limit)

		if (!messages.length) {
			return reply.code(404).send({ error: MESSAGES.MESSAGE.EMPTY_MESSAGES })
		}

		return reply.send({
			meta: {
				totalMessages,
				totalPages,
				page,
				limit,
			},
			data: messages,
		})
	} catch (error) {
		return reply.code(500).send({ error: MESSAGES.MESSAGE.FETCH_ERROR })
	}
}
