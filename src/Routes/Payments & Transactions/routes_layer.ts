import express,{Request,Response} from 'express';
import {z} from 'zod';
import { TransactionSchema } from '../../Validation & Error Handling/zod';
import { Get_Transaction_History, Transaction_Process } from './service_layer';
import { Service_Layer_Error } from '../../Validation & Error Handling/error';
import { Database_Layer_Error } from '../../Validation & Error Handling/error';
import { verifyuser } from '../../Middleware/verifyuser';
const router=express.Router();
router.use(express.json());
router.use(verifyuser);
type transaction_type = "Credit" | "Debit";
interface Transaction{
    user_Id:number,
    type:transaction_type,
    amount:number,
}

router.post("/credit",async (req:Request,res:Response)=>{
    try{
        const {amount}=req.body;
        const data:Transaction={
            user_Id:req.id.id,
            type:'Credit',
            amount,
        }
        const Business_History=await Transaction_Process(data);
        res.status(200).json(Business_History);
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
        else if(err instanceof z.ZodError){
            console.error("Error Occured",err);
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});


router.post("/debit",async (req:Request,res:Response)=>{
    try{
        const {amount}=req.body;
        const data:Transaction={
            user_Id:req.id.id,
            type:'Debit',
            amount,
        }
        const Business_History=await Transaction_Process(data);
        res.status(200).json(Business_History);
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
        else if(err instanceof z.ZodError){
            console.error("Error Occured",err);
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }else{
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
        const Business_History=await Get_Transaction_History(req.id.id);
        res.status(200).json(Business_History);
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
        else if(err instanceof z.ZodError){
            console.error("Error Occured",err);
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

export default router;