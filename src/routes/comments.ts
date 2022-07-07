import { Comment } from '@prisma/client';
import {Static,Type} from '@sinclair/typebox'
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import { type } from 'os';
import { prismaClient } from '../prisma';
const comment=Type.Object({
    comment_id :Type.String(),
     content:Type.String()
    
    });

    type comment=Static<typeof comment>
    const GetCommentQuery= Type.Object({
    content:Type.Optional(Type.String()),
       
    });
    type GetCommentQuery=Static<typeof GetCommentQuery>
    export const commentWithoutId= Type.Object({
        content:Type.String(),
        package_id:Type.String(),
        
        });
        type commentWithoutId =Static<typeof commentWithoutId>

        const  DeleteCommentParams=Type.Object({
            commentId:Type.String(),
        }) 
        type DeleteCommentParams=Static<typeof DeleteCommentParams>

        const GetcommentQuery= Type.Object({
            content:Type.Optional(Type.String()),
            
        });
        type GetcommentQuery=Static<typeof GetcommentQuery>

        const GetCommentById=Type.Object({
            commentId:Type.String(),
           })
           type GetCommentById=Static<typeof GetCommentById>
           const generateToken=Type.Object({
            token:Type.String()

           })
           type generateToken=Static<typeof generateToken>

    export default async function (server:FastifyInstance) {
       
       
        server.route({
            method: 'POST',
            url: '/createComment',
            schema: {
             summary: 'Creates new comment',
             tags: ['comment'],
             body:commentWithoutId,
             headers:generateToken,

            },
            handler: async (request, reply) => {
             const the_comment = request.body as commentWithoutId;
             const {token} =request.headers as generateToken;
             server.jwt.verify(token,async function name(err,decoded) {
                let id=decoded.id;
                if(id){
                    return await prismaClient.comment.create({
                         data:{...the_comment,
                        user_id:id}
             });
                }else{
                    reply.unauthorized();
                }
             })
             
            },
           });


           server.route({
            method: 'DELETE',
            url: '/comment/:commentId',
            schema: {
                summary: 'Deletes a comment by id',
                tags: ['comment'],
                params:Type.Object({
                commentId: Type.String(),
                })
            },
            handler: async (request, reply) => {
                const {commentId} = request.params as DeleteCommentParams ;
                if(!ObjectId.isValid(commentId)){
                    reply.badRequest('comment_id should be an ObjectId')
                    return;
                }
                return prismaClient.comment.delete({
                    where:{comment_id:commentId},
                });
            },
        });


        server.route({
            method: 'GET',
            url: '/comments',
            schema: {
                summary: 'Gets all comment',
                tags: ['comment'],
                querystring: GetcommentQuery,
                // response: {
                //     '2xx': Type.Array(pack),
                // },
            },
            handler: async (request, reply) => {
                const query = (request.query as typeof GetcommentQuery);
    
    
                return prismaClient.comment.findMany({
                    where:{
                        content:query.content,
                    }
                })
            },
        });



server.route({
		method: 'GET',
		url: '/comment/:commentId',
		schema: {
			summary: 'Get user own comment',
			tags: ['comment'],
			params: Type.Object({
				commentId:Type.String()
			}),
		},
		handler: async (request, reply) => {
			const {commentId} =request.params as GetCommentById;
			if(!ObjectId.isValid(commentId)){
				reply.badRequest('comment_id should be an Object');
				return;
			}
			return prismaClient.comment.findFirst({
				where:{comment_id:commentId}
			})

		},
	});
}

    