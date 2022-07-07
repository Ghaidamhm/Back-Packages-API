import { prisma } from '@prisma/client';
import {Static,Type} from '@sinclair/typebox'
import{Profile}from '@prisma/client'
import { FastifyInstance } from 'fastify';
const profile = Type.Object({
    profile_id:Type.String(),
    first_name:Type.String(),
    last_name:Type.String(),
});

type profile=Static<typeof profile>
const GetProfileQuery=Type.Object({
    first_name:Type.Optional(Type.String()),
    last_name:Type.Optional(Type.String()),
})

type GetProfileQuery=Static<typeof GetProfileQuery>

export default async function (server:FastifyInstance) {}
/*const user = await prisma.Profile.create({
    data: {
      bio: 'my profile',
      user: {
        connectOrCreate: {
          where:  { email: 'nn@gmail.com' },
          create: { email: 'alice@gmail.com'}
      },
    },
  })*/