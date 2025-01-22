import fastifyCors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import { config } from '../config';
import authPlugin from './auth';
import { prismaPlugin } from './prisma';

export const registerPlugins = (fastify: FastifyInstance) => {
  fastify.register(prismaPlugin);
  fastify.register(authPlugin);
  fastify.register(fastifyCors, config.cors);
};
