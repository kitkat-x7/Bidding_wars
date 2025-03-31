import { PrismaClient } from "@prisma/client";
import { Database_Layer_Error } from "../../../Validation & Error Handling/error";
const client=new PrismaClient();

interface Register_data{
    email:string,
    password:string,
    hashed_email:string,
    name:string,
    phone_number:string
}
export const getdata=async (email:string)=>{
    try{
        const data=await client.user.findUnique({
            where:{
                email
            }
        });
        return data;
    }catch (err) {
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}

export const postdata=async (data:Register_data)=>{
    try{
        const Data=await client.user.create({
            data:{
                email:data.email,
                password:data.password,
                name:data.name,
                phone_number:data.phone_number
            }
        });
        return Data;
    }catch (err) {
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}