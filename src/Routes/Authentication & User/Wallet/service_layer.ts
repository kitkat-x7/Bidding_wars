import { getbalance,updatebalance } from "./database_layer";
import { Service_Layer_Error } from "../../../Validation & Error Handling/error";

export const getwalletbalance=async (id:number)=>{
    try{
        const balance=await getbalance(id);
        return balance
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const updatewalletbalance=async (id:number,sum:number,type:string)=>{
    try{
        const balance=await getbalance(id);
        if(type=="Credit"){
            await updatebalance(id,balance+sum);
        }else{
            if(sum>balance){
                throw new Service_Layer_Error("Insufficient Funds",403);
            }else{
                await updatebalance(id,balance-sum);
            }
        }
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}