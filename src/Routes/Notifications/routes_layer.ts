import express,{Request,Response} from 'express';
import { Service_Layer_Error } from '../../Validation & Error Handling/error';
import { Database_Layer_Error } from '../../Validation & Error Handling/error';
import { verifyuser } from '../../Middleware/verifyuser';
import { Notifications } from './service_layer';
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/",async (req:Request,res:Response)=>{
    try{
        const notification=await Notifications(req.id)
        res.status(200).json(notification);
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