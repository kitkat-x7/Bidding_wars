import { PrismaClient } from "@prisma/client";
import { Database_Layer_Error } from "../../../Validation & Error Handling/error";
const client=new PrismaClient();


interface Update_data{
    id:number,
    name:string,
    phone_number:string
}
export const getdata=async (id:number)=>{
    try{
        const Data=await client.user.findUnique({
            where:{
                id
            },
            select:{
                email:true,
                name:true,
                phone_number:true,
                status:true
            }
        });
        if(!Data || !Data.status){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return Data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const patchdata=async (data:Update_data)=>{
    try{
        const Data=await client.user.update({
            where:{
                id:data.id,
            },data:{
                name:data.name,
                phone_number:data.phone_number
            }
        });
        if(!Data || !Data.status){
            throw new Database_Layer_Error("Data Not Found",404);
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const deletedata=async (id:number)=>{
    try{
        const Data=await client.user.update({
            where:{
                id
            },data:{
                status:false
            }
        });
        if(!Data || !Data.status){
            throw new Database_Layer_Error("Data Not Found",404);
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}