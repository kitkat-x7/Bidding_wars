import { Create_Room,Bidding_Chat, Update_Room, Update_Auction, Get_Auction,Create_Business_History, Get_Item, Update_Item } from "./database_layer";
import WebSocket = require("ws");
import { Post_Notification } from "../Notifications/database_layer";

import { PrismaClient} from "@prisma/client";
const client=new PrismaClient();

interface Create_Auction_Room_Data{
    item_id:number,
    initial_bid:number,
    creater_id:number,
    client:WebSocket,
    start_time:string,
}
interface Member_details{
    bidder_id:number,
    client:WebSocket,
    creater_id:number,
}
interface Join_Auction_Room{
    room_id:number,
    bidder_id:number,
    client:WebSocket,
    creater_id:number,
}
interface bid_Data{
    auction_room_id:number,
    user_id:number,
    bid:number
}


type RoomStatusType = "Live" | "Completed" | "Halt" | "Not_Started";
interface Final_data{
    room_id:number,
    initial_bid:number,
    final_bid:number,
    findal_bidder_id:number,
    status:RoomStatusType
}

interface Disconnect_Data{
    bidder_id:number,
    room_id:number,
    client:WebSocket,
    creater_id:number
}

let Rooms = new Map<number,Member_details[]>();
let Bid_Data = new Map<number,number>();

export const Create_Auction_Room=async (data:Create_Auction_Room_Data)=>{
    try{
        return client.$transaction(async (tx) => {
            const Auction_Room={
                item_id:data.item_id,
                initial_bid:data.initial_bid,
                creater_id:data.creater_id,
                start_time:data.start_time,
            }
            const Item_Status=await Get_Item(Auction_Room.item_id,tx);
            if(typeof(Item_Status)!='string'){
                if(Item_Status.status==='Bidding' || Item_Status.status==='Onhold'){
                    return `Cannot create an Auction Room, as Item with Itemid:${Item_Status.id} is already in the room.`
                }
                if(Item_Status.owner_id!=Auction_Room.creater_id){
                    return `Item with Itemid:${Item_Status.id} belongs to other person.`
                }
            }if(typeof(Item_Status)=='string'){
                return Item_Status;
            }if(Item_Status==null){
                return `Sever Error`;
            }
            const Room_Details=await Create_Room(Auction_Room,tx);
            if(Room_Details!=null && typeof(Room_Details)!='string'){
                if(!Rooms.get(Room_Details.id)){
                    Rooms.set(Room_Details.id,[{
                        bidder_id:Room_Details.creater_id,
                        client:data.client,
                        creater_id:Room_Details.creater_id
                    }]);
                    if(!Bid_Data.get(Room_Details.id)){
                        Bid_Data.set(Room_Details.id,100);
                    }
                }
                const Room_Data=Rooms.get(Room_Details.id);
                if(Room_Data){
                    for(let item of Room_Data){
                        console.log(item)
                    }
                }
                const Update_Status=await Update_Item({
                    id:Item_Status.id,
                    description:Item_Status.description,
                    status:'Onhold',
                },tx);
                if(typeof(Update_Status)==='string'){
                    return Update_Status;
                }
                if(Update_Status===null){
                    return `Server Error`;
                }
                //Will see notifications
                await Post_Notification({
                    userid:data.creater_id,
                    message:`Room: ${Room_Details.id} has been created and auction will start from ${Room_Details.start_time}`,
                });
                return Room_Details;
            }else if(typeof(Room_Details)=='string'){
                return Room_Details
            }
            else{
                return "Server Error";
            }
        });
    }catch(err){
        console.error("Service layer Error:", err);
    }
}

export const Join_Auction_Room=async (data:Join_Auction_Room)=>{
    try{
        if(Rooms.get(data.room_id)){
            const Room_Details=Rooms.get(data.room_id);
            if(Room_Details?.includes({
                bidder_id:data.bidder_id,
                client:data.client,
                creater_id:data.bidder_id
            })){
                return `Client_id: ${data.creater_id} already exists in the room`;
            }else{
                Rooms.get(data.room_id)?.push({
                    bidder_id:data.bidder_id,
                    client:data.client,
                    creater_id:data.bidder_id
                });
            }
            const Room_Data=Rooms.get(data.room_id);
            if(Room_Data){
                let Client_Data:WebSocket[]=[];
                for(let item of Room_Data){
                    Client_Data.push(item.client);
                }
                await Post_Notification({
                    userid:data.creater_id,
                    message:`A new member: ${data.bidder_id} joined the auction room: ${data.room_id}`,
                });
                return Client_Data;
            }else{
                return `Room with roomid ${data.room_id} doesn't exist`;
            }
        }else{
            return `Room with roomid ${data.room_id} doesn't exist`;
        }
    }catch(err){
        console.error("Service layer Error:", err);
    }
}

export const Auction_Bids=async (data:bid_Data)=>{
    try{
        return client.$transaction(async (tx) => {
            const Room_Data=Rooms.get(data.auction_room_id);    
            if(Room_Data){
                const Data=await Get_Auction(data.auction_room_id,tx);
                if(Data!=null && typeof(Data)!='string'){
                    if(Data.start_time){
                        const Time_Elapsed = new Date(Data.start_time).getTime();
                        const milli_secs_elapsed = Time_Elapsed - Date.now();
                        if(milli_secs_elapsed>0){
                            return `Auction on room ${Data.id} hasn't started yet.`;
                        }
                    }else{
                        return `Invalid Start Time.`;
                    }
                }else if(typeof(Data)=='string'){
                    return Data
                }else{
                    return "No Auction Found"
                }
                const current_bid=Bid_Data.get(data.auction_room_id);
                if(current_bid){
                    if(data.bid<current_bid){
                        return `Not a valid bid by user:${data.user_id}`;
                    }
                }else{
                    return `Room with roomid ${data.auction_room_id} doesn't exist`;
                }
                Bid_Data.set(data.auction_room_id,data.bid);
                let Client_Data:WebSocket[]=[];
                await Bidding_Chat(data,tx);
                await Update_Room({
                    room_id:data.auction_room_id,
                    final_bidder:data.user_id,
                    bid:data.bid
                },tx);
                for(let item of Room_Data){
                    Client_Data.push(item.client);
                }
                return Client_Data;
            }else{
                return `Room with roomid ${data.auction_room_id} doesn't exist`;
            }
        });
    }catch(err){
        console.error("Service layer Error:", err);
    }
}


export const Close_Auction=async (data:Final_data)=>{
    try{
        return client.$transaction(async (tx) => {
            const Update=await Update_Auction(data,tx);
            if(typeof(Update)=='string'){
                return Update;
            }if(Update==null){
                return `Unknown Database Error`;
            }
            const Data=await Get_Auction(data.room_id,tx);
            if(Data!=null && typeof(Data)!='string'){
                const Item_Details=await Get_Item(Data.item_id,tx);
                if(typeof(Item_Details)=='string'){
                    return Item_Details;
                }if(Item_Details==null){
                    return `Item of Itemid:${Data.item_id} is not found`
                }
                const Patch=await Update_Item({
                    id:Item_Details.id,
                    description:Item_Details.description,
                    status:"Sold",
                },tx);
                if(typeof(Patch)=='string'){
                    return Patch;
                }if(Patch==null){
                    return `Item of Itemid:${Data.item_id} can't be patched.`
                }
                const Business_History=await Create_Business_History({
                    Amount:Data.final_bid,
                    buyer_Id:data.findal_bidder_id,
                    seller_Id:Data.creater_id,
                    itemid:Data.item_id,
                    room_Id:data.room_id,
                },tx);
                if(typeof(Business_History)=='string'){
                    return Business_History;
                }if(Business_History==null){
                    return `Business_History of Itemid:${Data.item_id} can't be created.`
                }
                const Room_Data=Rooms.get(data.room_id);
                if(Room_Data){
                    let Client_Data:WebSocket[]=[];
                    for(let item of Room_Data){
                        Client_Data.push(item.client);
                    }Rooms.delete(data.room_id);
                    await Post_Notification({
                        userid:Data.creater_id,
                        message:`Room: ${data.room_id} has been closed and auction has been officially ended with highest bidder: ${Data.findal_bidder_id} quoting an amount of $${Data.final_bid}`,
                    });
                    return Client_Data;
                }else{
                    return `Room with roomid ${data.room_id} doesn't exist`;
                }
            }else if(typeof(Data)=='string'){
                return Data;
            }else{
                return "No Auction Found";
            }
        })
        
    }catch(err){
        console.error("Service layer Error:", err);
    }
}

export const Disconnecting=async (data:Disconnect_Data)=>{
    try{
        const Data=Rooms.get(data.room_id);
        if(Data){
            const index=Data.indexOf({
                bidder_id:data.bidder_id,
                client:data.client,
                creater_id:data.creater_id
            });
            if(index!=-1){
                return Rooms.get(data.room_id)?.splice(index,1);
            }else{
                return `No client of ClientId:${data.bidder_id} found in the room of roomid:${data.room_id}`;
            }
        }else{
            return `No room of roomid:${data.room_id} was found`;
        }
    }catch(err){
        console.error("Service layer Error:", err);
    }
}

export const Update_Status=async(data:number)=>{
    try{
        return client.$transaction(async (tx)=>{
            const Item_Status=await Get_Item(data,tx);
            if(typeof(Item_Status)!='string'){
                const Update_Status=await Update_Item({
                    id:Item_Status.id,
                    description:Item_Status.description,
                    status:'Bidding',
                },tx);
                if(typeof(Update_Status)==='string'){
                    return Update_Status;
                }
                if(Update_Status===null){
                    return `Server Error`;
                }
            }else{
                return Item_Status;
            }
        });
    }catch(err){
        console.error("Service layer Error:", err);
    }
}