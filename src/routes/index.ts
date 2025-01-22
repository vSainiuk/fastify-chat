import { FastifyInstance } from 'fastify';
import accountRoutes from './account';
import messageRoutes from './message';

export const registerRoutes = (fastify: FastifyInstance) => {
  fastify.register(accountRoutes, { prefix: '/account' });
  fastify.register(messageRoutes, { prefix: '/message' });
};
