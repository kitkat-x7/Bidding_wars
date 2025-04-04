import express from 'express'
import { WebSocketServer,WebSocket } from 'ws';
import { verifyuser } from "../../Middleware/verifyuser";
import { Auction_Bids, Close_Auction, Create_Auction_Room, Disconnecting, Join_Auction_Room, Update_Status } from './service_layer';
import dotenv from 'dotenv'; 
import jwt from 'jsonwebtoken';
dotenv.config(); 

const app=express();
app.use(express.json());
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

const httpserver=app.listen(3000);
const wss=new WebSocketServer({
    server:httpserver
});

let timer=10000;
let id:any;
wss.on('connection',(socket,req)=>{
        socket.send('Hello! Message From Server!!');
        socket.on('message',async (data)=>{  
        try{
            const Data=data.toString();
            if(typeof(Data)==='string'){
                const message=JSON.parse(Data);
                if(message.type==='create'){
                    const URL=req.url || "";
                    if(URL){
                        const [url_data,params] = URL.split("?");
                        const [key,value] = params.split("=");
                        const JWT_SECRET = process.env.JWT_SECRET;
                        if(JWT_SECRET){
                            id=jwt.verify(value,JWT_SECRET);
                        }else{
                            socket.send("Server Error");
                        }
                    }else{
                        socket.send("No Token Found");
                    }
                    const Room_Details=await Create_Auction_Room({
                        item_id:message.payload.item_id,
                        initial_bid:message.payload.initial_bid,
                        creater_id:id.id,
                        client:socket,
                        start_time:message.payload.start_time,
                    });
                    if(typeof(Room_Details)!='string' && Room_Details!=null){
                        socket.send(JSON.stringify(Room_Details));
                        const Time_Elapsed = new Date(Room_Details.start_time).getTime();
                        const milli_secs_elapsed = Time_Elapsed - Date.now();
                        if(milli_secs_elapsed>0){
                            setTimeout(()=>{
                                Update_Status(message.payload.item_id);
                            },milli_secs_elapsed)
                        }
                    }else if(typeof(Room_Details)=='string'){
                        socket.send(Room_Details)
                    }else{
                        socket.send("Server Error");
                    }
                }if(message.type==='join'){
                    const clients=await Join_Auction_Room({
                        room_id:message.payload.room_id,
                        bidder_id:message.payload.bidder_id,
                        client:socket,
                        creater_id:id.id,
                    });
                    if(typeof(clients)!='string' && clients!=null){
                        for(let client of clients){
                            if(client.readyState=== WebSocket.OPEN){
                                client.send(`User ${message.payload.bidder_id} has joined the auction`);
                            }
                        }
                    }else if(typeof(clients)=='string'){
                        socket.send(clients);
                    }else{
                        socket.send("Server Error");
                    }
                }
                if(message.type==='bid'){
                    const clients=await Auction_Bids({
                        auction_room_id:message.payload.auction_room_id,
                        user_id:message.payload.user_id,
                        bid:message.payload.bid
                    }); 
                    if(!clients){
                        socket.send(`Auction not started.`);
                    }else{
                        clearTimeout(Auction_Close);
                        Auction_Close=setTimeout(async () => {
                            const Data=await Close_Auction(message.payload.auction_room_id);
                            if(typeof(Data)!='string' && Data!=null){
                                for(let client of Data){
                                    if(client.readyState=== WebSocket.OPEN){
                                        client.close(1001, 'Auction Over');
                                    }
                                }
                            }else if(typeof(Data)=='string'){
                                socket.send(Data);
                            }else{
                                socket.send("Server Error");
                            }
                        }, timer); 
                        if(typeof(clients)!='string' && clients!=null){
                            for(let client of clients){
                                if(client.readyState===WebSocket.OPEN){
                                    client.send(`Bidder_id: ${message.payload.user_id}, Bid:${message.payload.bid}.`);
                                }
                            }
                        }else if(typeof(clients)=='string'){
                            socket.send(clients)
                        }else{
                            socket.send("Server Error");
                        }
                    } 
                }if(message.type=='close'){
                    const client=await Disconnecting({
                        bidder_id:message.payload.bidder_id,
                        client:socket,
                        creater_id:id.id,
                        room_id:message.payload.room_Id
                    });
                    if(typeof(client)=='string'){
                        socket.send(client);
                    }else if(client==null){
                        socket.send('Error Ocuured.');
                    }else{
                        socket.send(`${message.payload.bidder_id} went out of the room`);
                    }
                }
            }
        }catch(err){
            console.log(err);
            socket.send("Error Occured");
        }
    }
);
});
let Auction_Close=setTimeout(()=>{
    console.log("ABC")
},1000000000);