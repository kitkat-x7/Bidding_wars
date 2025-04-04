import { getbalance,updatebalance } from "./database_layer";
import { Service_Layer_Error } from "../../../Validation & Error Handling/error";
import { set_purse_cache } from "../../../Cache/cache_module";

export const getwalletbalance=async (id:number)=>{
    try{
        const balance=await getbalance(id);
        set_purse_cache({
            bidder_id:id,
            budget:balance,
        });
        return balance
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

