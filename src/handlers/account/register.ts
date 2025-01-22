import bcrypt from 'bcrypt'
import { FastifyReply } from 'fastify'
import { MESSAGES } from '../../constants/messages'
import { RegisterDto } from '../../dto/account.dto'
import { prisma } from '../../plugins/prisma'
import { AuthenticatedRequest } from '../../routes/message'

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12

export async function register(
	request: AuthenticatedRequest,
	reply: FastifyReply
) {
	const { username, password } = request.body as RegisterDto

	if (!username || !password) {
		return reply
			.code(400)
			.send({ error: MESSAGES.USER.USERNAME_PASSWORD_REQUIRED })
	}

	const existingUser = await prisma.user.findUnique({
		where: { username },
	})
	if (existingUser) {
		return reply.code(400).send({ error: MESSAGES.USER.USERNAME_TAKEN })
	}

	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

	try {
		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
			},
		})

		return reply
			.code(201)
			.send({ message: MESSAGES.USER.REGISTER_SUCCESS, userId: user.id })
	} catch (error) {
		return reply.code(500).send({ error: MESSAGES.USER.REGISTER_ERROR })
	}
}
