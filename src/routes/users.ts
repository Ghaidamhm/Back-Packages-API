import {Static,Type} from '@sinclair/typebox'
import { FastifyInstance } from 'fastify';
import { upsertUsersControllers } from '../controllers/upsert-users';

const user=Type.Object({
id :Type.String(),
user_name:Type.String(),
Email:Type.String(),

});
type user=Static<typeof user>
const GetUserQuery= Type.Object({
    user_name:Type.Optional(Type.String()),
   
});
type GetUserQuery=Static<typeof GetUserQuery>

export let users:any[]=[
    {id:'9' , user_name:'nora' , Email:'nn@gmail.com'},
    {id:'11' , user_name:'mona' , Email:'mm@gmail.com'},
    {id:'99', user_name:'sami' , Email:'ss@gmail.com' },
];
//ليه حطينهاه ديفولت
export default async function(server: FastifyInstance){
 server.route({
    method: 'PUT',
    url: '/users',
    schema:{
        summary: 'create a new user rquired all propirties',
        tags:['users'],
        body:user,
    },
    handler: async (request, replay)=>{
        const newUsers: any= request.body;
        return upsertUsersControllers(users,newUsers);
    },
 });
 server.route({
    method:'PATCH',
    url:'/user/:id',
    schema:{
    summary:'update user by id',
    tags:['users'],
    body:Type.Partial(user),
    params:Type.Object({
        id:Type.String(),
    })
    },
    handler:async(request,reply)=>{
        const newUsers:any=request.body;
        return upsertUsersControllers(users ,newUsers);
    },
 });
 server.route({
    method:'DELETE',
    url:'/user/:id',
    schema:{
        summary:'Delete user by id',
        tags:['user'],
        params:Type.Object({
            id:Type.String()
        })
    },
 handler: async(request, reply )=>{
    const id=(request.params as any).id as string;
    users=users.filter((p)=> p.id !== id);
    return users;
 },
 });

 /*server.route({
    method:'GET',
    url:'/users',
    schema:{
        summary:'Get all users',
        tags:['users'],
        querystring: GetUserQuery,
        response:{
            '2xx':Type.Array(user),
        },

    },
handler: async(request,reply)=>{
    const query =(request.query as typeof GetUserQuery);
    if(query.user_name){
        return users.filter((u)=> u.user_name.includes(query.user_name ?? ''));
    }else{
        return users;
    }
}
 })*/
 server.route({
    method:'GET',
    url:'/user/:id',
    schema:{
        summary:'Get one user by id or null ',
        tags:['user'],
        //ERROR
        params:Type.Object({
            id:Type.String(),
        }),
        //problem here
        response:{
            '2xx':Type.Union([user ,Type.Null()]),
        },
    },
    handler:async(request,reply)=>{
        const id=(request.params as any).id as string;
        return users.find((elm)=>elm.id===id)?? null;
    },
 });

}




