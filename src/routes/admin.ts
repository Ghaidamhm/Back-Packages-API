import { Admin, User } from '@prisma/client';
import {Static,Type} from '@sinclair/typebox'
import { ObjectId } from 'bson';
import exp from 'constants';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import { prismaClient } from '../prisma';

//valedation
export const Admins  =Type.Object({
  admin_id:Type.Optional(Type.String()),
   name:Type.String(),
   email:Type.String(),
   password:Type.String(),
   //user_id:Type.String()
    });
    type Admins=Static<typeof Admins>

   export const AdminwithoutId= Type.Object({
        name:Type.String(),
        email:Type.String(),
        password:Type.String(),
        });
  export  type AdminwithoutId =Static<typeof AdminwithoutId>

    const PartialAdminUpdate = Type.Partial(AdminwithoutId);
    type PartialAdminUpdate = Static<typeof PartialAdminUpdate>;


const AdminParams = Type.Object({
	adminId: Type.String(),
});
type AdminParams = Static<typeof AdminParams>;


const  DeleteAdminParams=Type.Object({
	AdminId:Type.String(),
}) 
type DeleteAdminParams=Static<typeof DeleteAdminParams>


const GetAdminQuery= Type.Object({
	name:Type.Optional(Type.String()),
	
});
type GetAdminQuery=Static<typeof GetAdminQuery>
    export default async function (server: FastifyInstance) {
        server.route({
            method: 'PUT',
            url: '/create',
            schema: {
                summary: 'new admin created ',
                tags: ['Admin'],
                body :Admins,
            },
        
            handler: async (request, reply) => {
                const the_admin= request.body as Admin;
                if(!ObjectId.isValid(the_admin.admin_id)){
                    reply.badRequest('admin_id should be an objectId!');
                    
                }
                else{
                    return await prismaClient.admin.upsert({
                            where:{admin_id:the_admin.admin_id},
                            create:the_admin,
                            update:_.omit(the_admin , ['admin_id']),
                        });
                    }
            },
        });
        server.route({
            method: 'POST',
            url: '/create',
            schema: {
             summary: 'Creates new admin',
             tags: ['Admin'],
             body:AdminwithoutId,
            },
            handler: async (request, reply) => {
             const myAdmin = request.body as AdminwithoutId;
             return await prismaClient.admin.create({
                         data: myAdmin
             });
            },
           });
        server.route({
            method: 'PATCH',
            url: '/admin/:AdminId',
            schema: {
                summary: 'Update admin information by id no need to pass all properties',
                tags: ['Admin'],
                body:PartialAdminUpdate,
                params:Type.Object({
                AdminId:Type.String(),
            
                }),
            },
            handler: async (request, reply) => {
                const{AdminId}=request.params as any
                if(!ObjectId.isValid(AdminId)){
                reply.badRequest('admin_id should be an objectId!');
                return;	
                }
                const newAdmin= request.body as PartialAdminUpdate;
                return prismaClient.admin.update({
                    where:{admin_id: AdminId},
                    data:newAdmin
                });
                
        },
    });
    
        server.route({
            method: 'DELETE',
            url: '/admin/:AdminId',
            schema: {
                summary: 'Deletes a Admin by id',
                tags: ['Admin'],
                params:Type.Object({
                AdminId: Type.String(),
                })
            },
            handler: async (request, reply) => {
                const {AdminId} = request.params as DeleteAdminParams ;
                if(!ObjectId.isValid(AdminId)){
                    reply.badRequest('admin_id should be an ObjectId')
                    return;
                }
                return prismaClient.admin.delete({
                    where:{admin_id:AdminId},
                });
            },
        });
      //get all packages or search by name

        server.route({
            method: 'GET',
            url: '/admin',
            schema: {
                summary: 'Gets all admins',
                tags: ['Admin'],
                querystring:GetAdminQuery,

            
            },
    
            handler: async (request, reply) => {
                const query = (request.query as typeof GetAdminQuery);
    
    
                return prismaClient.admin.findMany({
                    where:{
                        name:query.name,
                    }
                })
            },
        });
    }



























    // export default async function (server:FastifyInstance) {
    //     server.route({
    //         method:'GET',
    //         url:'/users',
    //         schema:{
    //             summary:'Get all users information',
    //             tags:['Admin'],
    //             querystring: GetAdminQuery,
    //            response:{
    //           '2xx':Type.Array(user),
    //            }
    //         },
    //         handler:async(request,reply)=>{
    //             const query =(request.params as typeof GetAdminQuery);
    //             prismaClient.user.findMany()
             
    //         }
            
    //     })

    // }
