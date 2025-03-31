import express from 'express'
import { WebSocketServer } from 'ws';
const app=express();
import cookieParser from "cookie-parser";
app.use(express.json());
app.use(cookieParser());
import dotenv from 'dotenv'; 
dotenv.config(); 
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:8000",
    credentials: true
}));

import Auth from "./Routes/Authentication & User/Registration/routes_layer";
import profile from "./Routes/Authentication & User/Profile/routes_layer";
import wallet from "./Routes/Authentication & User/Wallet/routes_layer";
import transaction from "./Routes/Payments & Transactions/routes_layer";
import item from "./Routes/Item/routes_layer";

app.use("/api/v1/user",Auth);
app.use("/api/v1/user/profile",profile);
app.use("/api/v1/user/wallet",wallet);
app.use("/api/v1/user/transaction",transaction);
app.use("/api/v1/user/item",item);
// app.use("/api/v2/user/links",quicklinks); //it's not a need?
// app.use("/api/v2/user/search/",serach);

app.get("/api/v2/user/home",(req,res)=>{
    res.json("Welcome");
});


export const httpServer=app.listen(8080,()=>{
    console.log("Server is running on port 8080")
});


