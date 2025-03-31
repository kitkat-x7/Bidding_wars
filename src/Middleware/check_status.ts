import {Request,Response,NextFunction} from 'express';
import { PrismaClient,Prisma } from "@prisma/client";
import { Database_Layer_Error, Service_Layer_Error } from '../Validation & Error Handling/error';
const client=new PrismaClient();

export const check_Status=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const Data=await check(req.id.id);
        if(!Data){
            throw new Database_Layer_Error("Data doesn't exist",404);
        }else{
            next();
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Service_Layer_Error("Data Not Found",404);
    }
}

export const check=async (data:number)=>{
    try{
        const Data=await client.user.findUnique({
            where:{
                id:data
            },select:{
                status:true
            }
        });
        return Data;
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Data Not Found",404);
    }
}