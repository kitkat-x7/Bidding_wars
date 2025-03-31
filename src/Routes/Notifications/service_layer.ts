import { Database_Layer_Error, Service_Layer_Error } from "../../Validation & Error Handling/error";
import { Get_Notification } from "./database_layer";

export const Notifications=async (data:number)=>{
    try{
        const notification=await Get_Notification(data);
        return notification;
    }catch(err){
        console.error("Service layer Error:", err);
        if(err instanceof Database_Layer_Error){
            throw new Database_Layer_Error(err.message,err.status);
        }else{
            throw new Service_Layer_Error("Service layer Error",500);
        }
    }
}