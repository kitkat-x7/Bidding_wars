import { Create_Transaction, Get_Transaction } from "./database_layer";
import { Database_Layer_Error, Service_Layer_Error } from "../../Validation & Error Handling/error";
import { getbalance, updatebalance } from "../Authentication & User/Wallet/database_layer";
import { set_purse_cache } from "../../Cache/cache_module";

type transaction_type = "Credit" | "Debit";
interface Transaction{
    user_Id:number,
    type:transaction_type,
    amount:number,
}


export const Transaction_Process=async (data:Transaction)=>{
    try{
        if(data.type=='Credit'){
            const balance=await getbalance(data.user_Id);
            await updatebalance(data.user_Id,balance+data.amount);
            set_purse_cache({
                bidder_id:data.user_Id,
                budget:data.amount+balance
            });
            Create_Transaction({
                user_Id:data.user_Id,
                type:"Credit",
                amount:data.amount,
            });
            return `Transaction completed`;
        }
        else{
            const balance=await getbalance(data.user_Id);
            if(balance<data.amount){
                throw new Service_Layer_Error("Insufficient Balance",403);
            }else{
                await updatebalance(data.user_Id,balance-data.amount);
                set_purse_cache({
                    bidder_id:data.user_Id,
                    budget:balance-data.amount,
                });
                Create_Transaction({
                    user_Id:data.user_Id,
                    type:'Debit',
                    amount:data.amount,
                });
                return `Transaction completed`;
            }
        }
    }catch(err){
        console.error("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}

export const Get_Transaction_History=async (data:number)=>{
    try{
        const History=await Get_Transaction(data);
        return History;
    }catch(err){
        console.error("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}