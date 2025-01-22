import 'fastify';
import { User } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    basicAuth: () => Promise<void>;
  }

  interface FastifyInstance {
    authenticate: any;
  }
}
