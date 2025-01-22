import { MessageType } from '@prisma/client'
import { FastifyReply } from 'fastify'
import fs from 'fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { MESSAGES } from '../../constants/messages'
import { checkUserMiddleware } from '../../middleware/checkUserMiddleware'
import { prisma } from '../../plugins/prisma'
import { AuthenticatedRequest } from '../../routes/message'

export async function createFileMessage(
	request: AuthenticatedRequest,
	reply: FastifyReply
) {
	await checkUserMiddleware(request, reply)
	const user = request.user!

	try {
		const file = await request.file()

		if (!file) {
			return reply.code(400).send({ error: MESSAGES.MESSAGE.FILE_REQUIRED })
		}

		const uploadDir = path.join(__dirname, '../../uploads')

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true })
		}

		const fileExt = path.extname(file.filename)
		const uniqueFilename = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(2)}${fileExt}`
		const filePath = path.join(uploadDir, uniqueFilename)

		await pipeline(file.file, fs.createWriteStream(filePath))

		const message = await prisma.message.create({
			data: {
				userId: user.id,
				type: MessageType.file,
				content: uniqueFilename,
			},
		})

		return reply.code(201).send({
			message,
			fileUrl: `/uploads/${uniqueFilename}`,
		})
	} catch (error) {
		return reply.code(500).send({ error: MESSAGES.MESSAGE.CREATE_ERROR })
	}
}
