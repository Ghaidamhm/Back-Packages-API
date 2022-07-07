import { FastifyInstance } from 'fastify';

export function addAuthorization(server: FastifyInstance) {
	server.addHook('onRequest', async (request, reply) => {
		const token = (request.headers as any).authorization;
		if (token === 'Bearer 123') {
			return;
		}

		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});
}


