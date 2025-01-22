import { FastifyReply, FastifyRequest } from 'fastify';
import { MESSAGES } from '../constants/messages';

export async function checkUserMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    return reply.code(401).send({ error: MESSAGES.AUTH.UNAUTHORIZED });
  }
}
