import { FastifyInstance } from 'fastify';

export default async function (server: FastifyInstance) {
	server.get('/login', async (request, reply) => {
		return 'Welcome to our community =)';
	});

	server.get('/verify', async (request, reply) => {
		return `hi ${''}`;
	});
}