
import fastifyAutoload from '@fastify/autoload';
import fastifyJwt from '@fastify/jwt';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import {ajvTypeBoxPlugin ,TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import fastify from 'fastify';
import { join } from 'path';

export const server = fastify({ 
	logger: true ,
	ajv:{
		customOptions:{
			removeAdditional:'all',
			ownProperties: true,
		},
		plugins:[ajvTypeBoxPlugin],
	}
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(fastifyJwt,{secret:'mySecret'})

server.register(fastifySwagger, {
	routePrefix: '/docs',
	exposeRoute: true,
	mode: 'dynamic',
	openapi: {
		info: {
			title: 'BackPackage API',
			version: '0.0.1',
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
});
server.register(fastifySensible);
server.register(fastifyAutoload, {
	dir: join(__dirname, 'routes'),
});


export function listen(){
    const port: any = process.env.PORT || process.env.$PORT || 3001;

server
    .listen({
        port: port,
        host: '0.0.0.0',
    })
    .catch((err) => {
        server.log.error(err);
        process.exit(1);
    })
}