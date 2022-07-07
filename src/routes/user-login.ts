import { FastifyInstance } from 'fastify';
// import * as bcrypt from 'bcrypt';
import { Jwt } from 'jsonwebtoken';
import { Static,Type } from "@sinclair/typebox";
// import { prismaClient } from '../../prisma';
import bcrypt from "bcrypt";
import { prismaClient } from '../prisma';
import { UserWithoutId } from './users';


//const jwt = require('jsonwebtoken');
const loginSchema=Type.Object({
    email:    Type.String() ,    
    password:  Type.String() , 
	 
// export default async function(server: FastifyInstance){}

})
type loginSchema=Static<typeof loginSchema>
const loginResponseSchema = Type.Object({
 accessToken: Type.String(),
  });
  //register User
  export default async function (server: FastifyInstance) {
    server.route({
  method: 'POST',
  url: '/signup',
  schema: {
   summary: 'Creates new user',
   tags: ['users'],
   body:UserWithoutId,
  },
  handler: async (request, reply) => {
   const user = request.body as UserWithoutId;
   if(!user){
    reply.badRequest("Please enter all required fields");
   }
   const userExist=await prismaClient.user.findUnique({
    where:{email:user.email}
   });
   if(userExist){
    reply.badRequest("User already exists")
   }
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(user.password, salt)
   const myNewUser= await prismaClient.user.create({
    data:{
     email:user.email,
     name:user.name,
     password:hashedPassword,

    }
   });
   return myNewUser;
   
  },

 
 }),
 server.route({
  method:'POST',
  url:'/login',
  schema:{
   summary:'Ask user to login',
   tags:['users'],
   body:loginSchema
  },
  handler:async (request,reply)=>{
   const loginUser=request.body as loginSchema
   const checkUser=await prismaClient.user.findUnique({
    where:{email:loginUser.email}
   });
   if(checkUser && (await bcrypt.compare(loginUser.password,checkUser.password))){
      const token=server.jwt.sign({
    email:loginUser.email
   })
   reply.send({message:"You are logged in",data:checkUser,token});// return checkUser;
   }else{
	reply.unauthorized('WRONG Email or Password !!')
   } 

  }
 })

  

 }