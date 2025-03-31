import { Database_Layer_Error, Service_Layer_Error } from "../../Validation & Error Handling/error";
import { delete_item, get_item, patch_item, post_item } from "./database_layer";

type Item_Status= 'Sold' | 'Unsold' | 'Bidding' | 'Onhold';
interface Item_Create{
    name:string,
    description:string,
    status:Item_Status,
    owner_id:number,
}
type ItemStatusType = "Sold" | "Unsold" | "Bidding" | "Onhold";
interface Item_Patch{
    id:number
    name:string,
    description:string,
    status:ItemStatusType,
}
export const get_auction_item=async (data:number)=>{
    try{
        const Data=await get_item(data);
        return Data;
    }catch(err){
        console.log("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}


export const create_auction_item=async (data:Item_Create)=>{
    try{
        data.status='Unsold';
        const Data=await post_item(data);
        return Data;
    }catch(err){
        console.log("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}

export const update_auction_item=async (data:Item_Patch)=>{
    try{
        await patch_item(data);
    }catch(err){
        console.log("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}

export const Delete_Profile=async (data:number)=>{
    try{
        await delete_item(data);
    }catch(err){
        console.log("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}