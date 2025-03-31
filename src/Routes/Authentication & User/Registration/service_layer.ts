import { getdata } from "./database_layer";
import { postdata } from "./database_layer";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'; 
import jwt from "jsonwebtoken";
import { Service_Layer_Error } from "../../../Validation & Error Handling/error";
import { create_new_wallet } from "../Wallet/database_layer";
dotenv.config(); 

interface Register_data{
    email:string,
    password:string,
    name:string,
    phone_number:string
}

interface Login_data{
    email:string,
    password:string,
}


export const register_service= async (data:Register_data)=>{
    try{
        const existing_user=await getdata(data.email);
        if(existing_user && existing_user.status){
            throw new Service_Layer_Error("Registered User",409);
        }
        const hashed_email=await bcrypt.hash(data.email,10);
        const hashed_password=await bcrypt.hash(data.password,10);
        data.password=hashed_password;
        const Data={
            email:data.email,
            password:data.password,
            hashed_email:hashed_email,
            name:data.name,
            phone_number:data.phone_number
        }
        const user=await postdata(Data);
        return user;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const login_service= async (data:Login_data)=>{
    try{
        const existing_user=await getdata(data.email);
        if(!existing_user || !existing_user.status){
            throw new Service_Layer_Error("Unregistered User",403);
        }
        const verify=await bcrypt.compare(data.password,existing_user.password);
        if(verify){
            const JWT_SECRET = process.env.JWT_SECRET;
            if(JWT_SECRET){
                const token =jwt.sign({id:existing_user.id},JWT_SECRET,{ expiresIn: "1h" });
                return token;
            }
        }
    }
    catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const create_wallet=async (user_id:number)=>{
    try{
        await create_new_wallet(user_id);
    }
    catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}