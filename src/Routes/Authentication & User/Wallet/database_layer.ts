import { PrismaClient } from "@prisma/client";
import { Database_Layer_Error } from "../../../Validation & Error Handling/error";
const client=new PrismaClient();

export const getbalance=async (id:number)=>{
    try{
        const Data=await client.wallet.findUnique({
            where:{
                userId:id,
            },
            select:{
                balance:true
            }
        });
        if(Data){
            return Data.balance;
        }else{
            throw new Database_Layer_Error("Wallet not found",404);
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const updatebalance=async (id:number,balance:number)=>{
    try{
        await client.wallet.update({
            where:{
                userId:id
            },
            data:{
                balance
            }
        });
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const create_new_wallet=async (user_id:number)=>{
    try{
        await client.wallet.create({
            data:{
                balance:0,
                userId:user_id
            }
        });
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}