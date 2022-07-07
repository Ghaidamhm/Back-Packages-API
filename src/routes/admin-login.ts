import { FastifyInstance } from 'fastify';
// import * as bcrypt from 'bcrypt';
import { Static,Type } from "@sinclair/typebox";
import {AdminwithoutId } from './admin';
import { prismaClient } from '../prisma';
import bcrypt from "bcrypt";
const loginSchema=Type.Object({
    email:    Type.String() ,    
    password:  Type.String() ,	 
});
type loginSchema=Static<typeof loginSchema>

const loginResponseSchema = Type.Object({
 accessToken: Type.String(),
  });
 //signup
    export default async function (server: FastifyInstance) {
        server.route({
      method: 'POST',
      url: '/signup/admin',
      schema: {
       summary: 'Creates new Admin',
       tags: ['Admin'],
       body:AdminwithoutId,
      },
      handler: async (request, reply) => {
       const admin = request.body as AdminwithoutId;
       if(!admin){
        reply.badRequest("Please enter all required fields");
       }
       const userExist=await prismaClient.admin.findUnique({
        where:{email:admin.email}
       });
       if(userExist){
        reply.badRequest("Admin already exists")
       }
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(admin.password, salt)
       const myNewAdmin= await prismaClient.admin.create({
        data:{
         email:admin.email,
         name:admin.name,
         password:hashedPassword,
    
        }
       });
       return myNewAdmin;
      },
     }),
//login
server.route({
	method:'POST',
	url:'/login/admin',
	schema:{
	 summary:'Ask Admin to login',
	 tags:['Admin'],
	 body:loginSchema
	},

    handler:async (request,reply)=>{
        const loginAdmin=request.body as loginSchema
        const checkAdmin=await prismaClient.admin.findUnique({
         where:{email:loginAdmin.email}
        });
        if(checkAdmin && (await bcrypt.compare(loginAdmin.password,checkAdmin.password))){
           const token=server.jwt.sign({
         email:loginAdmin.email
        })
        reply.send({message:"You are logged in",data:checkAdmin,token});
        }else{
         reply.unauthorized('WRONG Email or Password !!')
        } 
	// handler:async (request,reply)=>{
	//  const loginAdmin=request.body as loginSchema
	//  const checkAdmin=await prismaClient.admin.findUnique({
	//   where:{email:loginAdmin.email}
	//  });
	//  if(checkAdmin && (await bcrypt.compare(loginAdmin.password,checkAdmin.password))){
	//   return checkAdmin;
	//  }else{
	//   reply.badRequest('WRONG Email or Password !!')
	//  } 
	}
   });

}
    