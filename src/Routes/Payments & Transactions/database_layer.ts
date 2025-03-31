import { PrismaClient } from "@prisma/client";
import { Database_Layer_Error } from "../../Validation & Error Handling/error";
const client=new PrismaClient();

type transaction_type = "Credit" | "Debit";
interface Transaction{
    user_Id:number,
    type:transaction_type,
    amount:number
}
export const Create_Transaction=async (data:Transaction)=>{
    try{
        await client.transaction_History.create({
            data:{
                user_Id:data.user_Id,
                type:data.type,
                amount:data.amount,
            }
        });
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const Get_Transaction=async (data:number)=>{
    try{
        const Transaction=await client.transaction_History.findUnique({
            where:{
                id:data
            }
        });
        if(Transaction){
            return Transaction;
        }else{
            throw new Database_Layer_Error("Transaction History not found",404);
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}