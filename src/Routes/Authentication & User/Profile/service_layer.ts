import { deletedata, getdata } from "./database_layer";
import { Service_Layer_Error } from "../../../Validation & Error Handling/error";
import { patchdata } from "./database_layer";
interface Updated_Data{
    id:number,
    name:string,
    phone_number:string
}
export const Get_Profile=async (id:number)=>{
    try{
        const data=await getdata(id);
        return data;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
};

export const Update_Profile=async (data:Updated_Data)=>{
    try{
        await patchdata(data);
        return;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const Delete_Profile=async (id:number)=>{
    try{
        console.log(id);
        await deletedata(id);
        return;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}