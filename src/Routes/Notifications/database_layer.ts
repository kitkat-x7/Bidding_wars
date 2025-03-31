import { PrismaClient, Type } from "@prisma/client";
import { Database_Layer_Error } from "../../Validation & Error Handling/error";
import { number } from "zod";
const client=new PrismaClient();

interface Notification{
    userid:number,
    message:string
}
export const Get_Notification=async (data:number)=>{
    try{
        const notifications=await client.notification.findMany({
            where:{
                id:data
            }
        });
        return notifications;
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const Post_Notification=async (data:Notification)=>{
    try{
        await client.notification.create({
            data:{
                user_Id:data.userid,
                message:data.message
            }
        });
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}
