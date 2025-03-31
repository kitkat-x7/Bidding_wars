import {Request,Response,NextFunction} from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import dotenv from 'dotenv'; 
dotenv.config(); 

export {}
declare global {
    namespace Express {
      export interface Request {
        id:any
      }
    }
}

let token_data;
export const verifyuser=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.header('token');
        if(!token){
            //redirect to signin
            res.status(401).json({
                message:"Unauthorised Access"
            })
            return;
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            res.status(500).json({
                message:"JWT Secret not configured yet."
            })
            return;
        }    
        const id=jwt.verify(token,JWT_SECRET);
        if(!id){
            res.status(401).json({
                message:"Unauthorised Access"
            })
            return;
        }
        token_data=id;
        req.id=id;
        return next();
    }catch(err){
        console.log("error received",err);
        if (err instanceof JsonWebTokenError) {
            // Redirect to "/signin"
            res.status(401).send("Invalid Token! Please log in." ).redirect("ABC.com");
        }else {
            res.status(500).json({ message: "Server Error",error:err });
        }
    }
}
export {token_data};