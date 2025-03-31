import express,{Request,Response} from 'express';
import { Service_Layer_Error } from '../../Validation & Error Handling/error';
import { Database_Layer_Error } from '../../Validation & Error Handling/error';
import { verifyuser } from '../../Middleware/verifyuser';
import { create_auction_item, get_auction_item, update_auction_item } from './service_layer';
import { delete_item } from './database_layer';
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.post("/",async (req:Request,res:Response)=>{
    try{
        const {name,description,status}=req.body;
        const Data={
            name,
            description,
            status,
            owner_id:req.id.id
        }
        const Item=await create_auction_item(Data);
        res.status(200).json(Item);
    }
    catch(err){    
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

router.get("/",async (req:Request,res:Response)=>{
    try{
        const Item=await get_auction_item(req.id);
        res.status(200).json(Item);
    }
    catch(err){    
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

router.patch("/",async (req:Request,res:Response)=>{
    try{
        const {id,name,description,status}=req.body;
        const Data={
            id,
            name,
            description,
            status,
        }
        await update_auction_item(Data);
        res.status(201).json({
            message:"Item Updated"
        });
    }
    catch(err){    
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

router.delete("/",async (req:Request,res:Response)=>{
    try{
        const {itemid}=req.body;
        await delete_item(itemid);
        res.status(200).json({
            message:"Item Deleted"
        });
    }
    catch(err){    
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

export default router;