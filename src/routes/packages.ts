import { user } from './users';
import {} from 'bson'
import { Package } from '@prisma/client';
import {Static,Type,TSchema} from '@sinclair/typebox'
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import { prismaClient } from '../prisma';
import { format } from 'path';


//valedation
export const pack =Type.Object({
package_id:Type.String(),
name:Type.String(),
package_description:Type.String(),
user_id:Type.String(),
// admin_id:Type.String(),

});
type pack=Static<typeof pack>

const GetPackageQuery= Type.Object({
	name:Type.Optional(Type.String()),
	
});
type GetPackageQuery=Static<typeof GetPackageQuery>


const PackWithoutId= Type.Object({
	name:Type.String(),
	package_description:Type.String(),
	user_id:Type.String(),
    });
type PackWithoutId =Static<typeof PackWithoutId>

const packageParams = Type.Object({
	package_id: Type.String(),
});
type packageParams = Static<typeof packageParams>;

const PartialPackages=Type.Partial(PackWithoutId);
type PartialPackages=Static<typeof pack>

const GetPackageById=Type.Object({
	packageId:Type.String(),
   })
   type GetPackageById=Static<typeof GetPackageById>


const  DeletePackageParams=Type.Object({
	package_id:Type.String(),

}) 
type DeletePackageParams=Static<typeof DeletePackageParams>
const  DeletePackageByUser=Type.Object({
	user_id:Type.String(),
	
}) 
type DeletePackageByUser=Static<typeof DeletePackageByUser>

const GetPackageByUserId=Type.Object({
	name:Type.String(),
	package_description:Type.String(),
	user_id:Type.String(),
	package_id:Type.String(),
   })
   type GetPackageByUserId=Static<typeof GetPackageByUserId>

   
export let packages: Package[] = [
]


//CRUD
//______________________________________________________________________

export default async function (server: FastifyInstance) {

	server.route({
        method: 'POST',
        url: '/createpackByUser',
        schema: {
         summary: 'Creates new package',
         tags: ['Packages'],
         body:PackWithoutId,
        },
        handler: async (request, reply) => {
         const The_Pack = request.body as PackWithoutId;
         return await prismaClient.package.create({
                     data: The_Pack
         });
        },
       });

	   


	server.route({
		method: 'PUT',
		url: '/package',
		schema: {
			summary: 'create a new package + all properties required',
			tags: ['Packages'],
			body :pack,
		},
	
		handler: async (request, reply) => {
			const Pack= request.body as Package;
			if(!ObjectId.isValid(Pack.package_id)){
				reply.badRequest('package_id should be an objectId!');
				
			}
			else{
				return await prismaClient.package.upsert({
						where:{package_id:Pack.package_id},
						create:Pack,
						update:_.omit(Pack , ['package_id']),
					});
				}
		},
	});
	
	server.route({
		method: 'PATCH',
		url: '/package/:package_id',
		schema: {
			summary: 'Update a package by id no need to pass all properties',
			tags: ['Packages'],
			body:PartialPackages,
            params:packageParams
		},
		handler: async (request, reply) => {
			const{package_id}=request.params as packageParams;
			if(!ObjectId.isValid(package_id)){
			reply.badRequest('package_id should be an objectId!');
			return;	
			}
			const newPackages= request.body as PartialPackages;
			return prismaClient.package.update({
				where:{package_id},
				data:newPackages
			});
			
	},
});

	server.route({
		method: 'DELETE',
		url: '/package/:package_id',
		schema: {
			summary: 'Deletes a package by id',
			tags: ['Packages'],
			params:Type.Object({
			package_id: Type.String(),
			})
		},
		handler: async (request, reply) => {
			const {package_id} = request.params as DeletePackageParams;
			if(!ObjectId.isValid(package_id)){
				reply.badRequest('package_id should be an ObjectId')
				return;
			}
			return prismaClient.package.delete({
				where:{package_id},
			});
		},
	});
//Get one package by id
	server.route({
		method: 'GET',
		url: '/package/:packageId',
		schema: {
			summary: 'Gets one package or null',
			tags: ['Packages'],
			params: Type.Object({
				packageId:Type.String()
			}),
			// response:{
			// 		'2xx':Type.Union([pack , Type.Null()]),
			// },
		},
		handler: async (request, reply) => {
			const {packageId} =request.params as GetPackageById;
			if(!ObjectId.isValid(packageId)){
				reply.badRequest('package_id should be an Object');
				return;
			}
			return prismaClient.package.findFirst({
				where:{package_id:packageId}
			})

		},
	});
//get all packages or search by name
	server.route({
		method: 'GET',
		url: '/Package',
		schema: {
			summary: 'Get all packages',
			tags: ['Packages'],
			querystring: GetPackageQuery,
			response: {
				'2xx': Type.Array(pack),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as  GetPackageQuery;


			return prismaClient.package.findMany({
				where:query
					//{name:query.name,}
				
			})
		},
	});


//user's own packages info_____________//_________//_____________//
	server.route({
		method: 'GET',
		url: '/package/details/:user_id',
		schema: {
			summary: 'Gets users packages or null',
			tags: ['Packages'],
			params: Type.Object({
				user_id:Type.String()
			}),
			// response:{
			// 		'2xx':Type.Union([pack , Type.Null()]),
			// },
		},
		handler: async (request, reply) => {
			const {user_id} =request.params as GetPackageByUserId;
			if(!ObjectId.isValid(user_id)){
				reply.badRequest('user_id should be an ObjectId');
				return;
			}
			return prismaClient.package.findMany({
				where:{user_id}
			})

		},
	});

// server.route({
// 	method: 'DELETE',
// 		url: '/package/delete/:user_id',
// 		schema: {
// 			summary: 'Deletes a package by user',
// 			tags: ['Packages'],
// 			params:Type.Object({
// 			user_id: Type.String(),
// 			})
// 		},
// 		handler: async (request, reply) => {
// 			const {user_id} = request.params as DeletePackageByUser ;
// 			if(!ObjectId.isValid(user_id)){
// 				reply.badRequest('package_id should be an ObjectId')
// 				return;
// 			}
// 			return prismaClient.package.delete({
// 				where:{user.user_id},
// 			});
// 		},
// 	});
}
