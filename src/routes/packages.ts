import {Static,Type} from '@sinclair/typebox'
import { FastifyInstance } from 'fastify';
import { upsertPackagesController } from '../controllers/upsert-packages';

const pack =Type.Object({
id:Type.String(),
name:Type.String(),
packageSyntax:Type.String(),
});
type pack=Static<typeof pack>
const GetPackageQuery= Type.Object({
	name:Type.Optional(Type.String()),
	
});

type GetPackageQuery=Static<typeof GetPackageQuery>


export let packages: any[] = [
	{ id: '1', name: 'swagger', packageSyntax:'npm install swagger-jsdoc swagger-ui-express --save ' },
	{ id: '2', name: 'yarn', packageSyntax: 'npm install --global yarn' },
	{ id: '3', name: 'socket', packageSyntax: 'yarn add socket.io' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/packages',
		schema: {
			summary: 'create a new package + all properties required',
			tags: ['Packages'],
			body :pack,
		},
		/////////////
		handler: async (request, reply) => {
			const newPackages: any = request.body;
			return upsertPackagesController(packages, newPackages);
		},
	});
	server.route({
		method: 'PATCH',
		url: '/packages/:id',
		schema: {
			summary: 'Update a package by id',
			tags: ['Packages'],
			body:Type.Partial(pack),
            params:Type.Object({
            id:Type.String(),
		
			}),
		},
		
		handler: async (request, reply) => {
			const newPackages: any = request.body;
			return upsertPackagesController(packages, newPackages);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/packages/:id',
		schema: {
			summary: 'Deletes a package',
			tags: ['Packages'],
			params:Type.Object({
				id: Type.String(),
			})
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			packages = packages.filter((p) => p.id !== id);

			return packages;
		},
	});

	server.route({
		method: 'GET',
		url: '/packages/:id',
		schema: {
			summary: 'Gets one package or null',
			tags: ['Packages'],
			params: Type.Object({
				id : Type.String(),
			}),
			response:{
					'2xx':Type.Union([pack , Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id =(request.params as any).id as string;
			return packages.find((p)=>p.id===id)?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/packages',
		schema: {
			summary: 'Gets all packages',
			tags: ['packages'],
			querystring: GetPackageQuery,
			response: {
				'2xx': Type.Array(pack),
			},
		},
		handler: async (request, reply) => {
			const query = (request.query as typeof GetPackageQuery);

			if (query.name) {
				return packages.filter((p) => p.name.includes(query.name ?? ''));
			} else {
				return packages;
			}
		},
	});
}