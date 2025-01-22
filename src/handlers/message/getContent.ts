import { MessageType } from '@prisma/client'
import { FastifyReply } from 'fastify'
import mime from 'mime-types'
import fs from 'node:fs'
import path from 'path'
import { MESSAGES } from '../../constants/messages'
import { prisma } from '../../plugins/prisma'
import { AuthenticatedRequest } from '../../routes/message'
import { checkUserMiddleware } from '../../middleware/checkUserMiddleware'

export async function getContent(
	request: AuthenticatedRequest,
	reply: FastifyReply
) {
	await checkUserMiddleware(request, reply)

	const { id: messageId } = request.query as { id: string }

	if (!messageId) {
		return reply.code(400).send({ error: MESSAGES.MESSAGE.MESSAGE_ID_REQUIRED })
	}

	try {
		const message = await prisma.message.findUnique({
			where: { id: messageId },
		})

		if (!message) {
			return reply.code(404).send({ error: MESSAGES.MESSAGE.MESSAGE_NOT_FOUND })
		}

		if (message.type === MessageType.text) {
			reply.header('Content-Type', 'text/plain')
			return reply.send(message.content)
		} else if (message.type === MessageType.file) {
			const filePath = path.join(__dirname, '../../uploads', message.content)
			if (!fs.existsSync(filePath)) {
				return reply.code(404).send({ error: MESSAGES.MESSAGE.FILE_NOT_FOUND })
			}

			const fileStream = fs.createReadStream(filePath)
			const fileExt = path.extname(message.content)
			const mimeType = fileExt
				? mime.lookup(fileExt) || 'application/octet-stream'
				: 'application/octet-stream'

			reply.header('Content-Type', mimeType)
			return reply.send(fileStream)
		} else {
			return reply.code(400).send({ error: MESSAGES.MESSAGE.INVALID_TYPE })
		}
	} catch (error) {
		return reply.code(500).send({ error: MESSAGES.MESSAGE.FETCH_ERROR })
	}
}
