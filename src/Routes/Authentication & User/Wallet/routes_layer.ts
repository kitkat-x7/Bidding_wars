import express,{Request,Response} from 'express';
import { verifyuser } from '../../../Middleware/verifyuser';
import { getwalletbalance} from './service_layer';
import { Database_Layer_Error, Service_Layer_Error } from '../../../Validation & Error Handling/error';
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.id.id;
        console.log(jwt_data);
        const balance=await getwalletbalance(jwt_data);
        res.status(200).json({
            balance
        });
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
          }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
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