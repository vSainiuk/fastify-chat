import { MessageType } from '@prisma/client'
import { FastifyReply } from 'fastify'
import { MESSAGES } from '../../constants/messages'
import { MessageDto } from '../../dto/message.dto'
import { checkUserMiddleware } from '../../middleware/checkUserMiddleware'
import { prisma } from '../../plugins/prisma'
import { AuthenticatedRequest } from '../../routes/message'

export async function createTextMessage(
	request: AuthenticatedRequest,
	reply: FastifyReply
) {
	await checkUserMiddleware(request, reply)
	const user = request.user!

	if (!request.body) {
		return reply.code(400).send({ error: MESSAGES.MESSAGE.CONTENT_REQUIRED })
	}

	const { content } = request.body as MessageDto

	if (!content) {
		return reply.code(400).send({ error: MESSAGES.MESSAGE.CONTENT_REQUIRED })
	}

	try {
		const message = await prisma.message.create({
			data: {
				userId: user.id,
				type: MessageType.text,
				content,
			},
		})

		return reply.code(201).send(message)
	} catch (error) {
		return reply.code(500).send({ error: MESSAGES.MESSAGE.CREATE_ERROR })
	}
}
