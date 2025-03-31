import { PrismaClient } from "@prisma/client";
import { Database_Layer_Error } from "../../Validation & Error Handling/error";
const client=new PrismaClient();

type Item_Status= 'Sold' | 'Unsold' | 'Bidding' | 'Onhold';
interface Item_Create{
    name:string,
    description:string,
    status:Item_Status,
    owner_id:number,
}
type ItemStatusType = "Sold" | "Unsold" | "Bidding" | "Onhold";
interface Item_Patch{
    id:number,
    name:string,
    description:string,
    status:ItemStatusType,
}
export const get_item=async (data:number)=>{
    try{
        const Data=await client.item.findUnique({
            where:{
                id:data,
            },
            select:{
                id:true,
                name:true,
                description:true,
                status:true,
            }
        });
        if(!Data){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return Data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const post_item=async (data:Item_Create)=>{
    try{
        const Data=await client.item.create({
            data:{
                name:data.name,
                description:data.description,
                status:data.status,
                owner_id:data.owner_id,
            }
        });
        if(!Data){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return Data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const patch_item=async (data:Item_Patch)=>{
    try{
        const Data=await client.item.update({
            where:{
                id:data.id
            },data:{
                name:data.name,
                description:data.description,
                status:data.status,
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

export const delete_item=async (data:number)=>{
    try{
        const Data=await client.item.delete({
            where:{
                id:data
            }
        });
        if(!Data){
            throw new Database_Layer_Error("Data Not Found",404);
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}