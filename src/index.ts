import { profile } from "console";
import { connectDb, prismaClient } from "./prisma";
import { listen } from './server';


async function start () {
    await connectDb();
    listen();
}
start();



