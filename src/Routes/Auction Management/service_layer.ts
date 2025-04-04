import { Create_Room,Bidding_Chat, Update_Room, Update_Auction, Get_Auction,Create_Business_History, Get_Item, Update_Item } from "./database_layer";
import WebSocket from "ws";
import { Post_Notification } from "../Notifications/database_layer";
import { get_purse_cache,set_purse_cache, get_bid_cache, set_bid_cache, get_item_cache, set_item_cache, del_bid_cache, del_item_cache } from "../../Cache/cache_module";
import { PrismaClient} from "@prisma/client";
import { getbalance } from "../Authentication & User/Wallet/database_layer";
const client=new PrismaClient();

interface Create_Auction_Room_Data{
    item_id:number,
    initial_bid:number,
    creater_id:number,
    client:WebSocket,
    start_time:string,
}

interface Room_Details{
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



type ItemStatusType = "Sold" | "Unsold" | "Bidding" | "Onhold";
interface Disconnect_Data{
    bidder_id:number,
    room_id:number,
    client:WebSocket,
    creater_id:number
}

let M = new Map<number, Room_Details[]>();
export const Create_Auction_Room=async (data:Create_Auction_Room_Data)=>{
    try{
        return client.$transaction(async (tx) => {
            const Auction_Room={
                item_id:data.item_id,
                initial_bid:data.initial_bid,
                creater_id:data.creater_id,
                start_time:data.start_time,
            }
            //Cache to get Item Status
            //Check with GPT when 2 create request of same Item hits with Transaction enabled
            //Create a Cache for Previous Chats
            const Item_Status=await Get_Item(Auction_Room.item_id,tx);
            if(typeof(Item_Status)!='string' && Item_Status!=null){
                if(Item_Status.status==='Bidding' || Item_Status.status==='Onhold'){
                    return `Cannot create an Auction Room, as Item with Itemid:${Item_Status.id} is already in the room.`
                }
                if(Item_Status.owner_id!=Auction_Room.creater_id){
                    return `Item with Itemid:${Item_Status.id} belongs to other person.`
                }
                
                set_item_cache({
                    item_id:Item_Status.id,
                    name:Item_Status.name,
                    owner_id:Item_Status.owner_id,
                    description:Item_Status.description,
                    status:Item_Status.status
                });
            }if(typeof(Item_Status)=='string'){
                return Item_Status;
            }if(Item_Status==null){
                return `Sever Error`;
            }
            const Room_Details=await Create_Room(Auction_Room,tx);
            if(Room_Details!=null && typeof(Room_Details)!='string'){
                const Room_Cache=M.has(Room_Details.id);
                if(Room_Cache==false){
                   M.set(Room_Details.id,[{
                        bidder_id:Room_Details.creater_id,
                        client:data.client,
                        creater_id:Room_Details.creater_id
                    }]);
                }
                const Bid_Cache=await get_bid_cache(Room_Details.id);
                if(Bid_Cache==null){
                    set_bid_cache({
                        room_id:Room_Details.id,
                        bid:0,
                        bidder_id:Room_Details.creater_id,
                        creater_id:Room_Details.creater_id,
                        item_id:Room_Details.item_id,
                        start_time:Room_Details.start_time,
                    });
                }
                // const Room_Data=await get_room_cache(Room_Details.id);
                // if(Room_Data){
                //     for(let item of Room_Data){
                //         console.log(item)
                //     }
                // }
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
                set_item_cache({
                    item_id:Item_Status.id,
                    name:Item_Status.name,
                    owner_id:Item_Status.owner_id,
                    description:Item_Status.description,
                    status:'Onhold',
                });
                //No await needed for notification
                Post_Notification({
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
        const Room=M.get(data.room_id);
        if(Room){
            const Room_Details=Room;
            if(Room_Details?.includes({
                bidder_id:data.bidder_id,
                client:data.client,
                creater_id:data.bidder_id,
            })){
                return `Client_id: ${data.creater_id} already exists in the room`;
            }else{
                Room.push({
                    bidder_id:data.bidder_id,
                    client:data.client,
                    creater_id:data.bidder_id
                });
                M.set(data.room_id,Room);
            }
            let Client_Data:WebSocket[]=[];
            for(let item of Room){
                Client_Data.push(item.client);
            }
            //No await needed for notification
            Post_Notification({
                userid:data.creater_id,
                message:`A new member: ${data.bidder_id} joined the auction room: ${data.room_id}`,
            });
            return Client_Data;
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
            const Room_Data=M.get(data.auction_room_id);    
            if(Room_Data){
                let Data=await get_bid_cache(data.auction_room_id);
                if(Data==null){
                    let Data1=await Get_Auction(data.auction_room_id,tx);
                    if(typeof(Data1)=='string'){
                        return Data1;
                    }
                    else if(Data1==null){
                        return "No Auction Found"
                    }
                    else{
                        Data={
                            room_id:Data1.id,
                            bid:Data1.initial_bid,
                            bidder_id:Data1.findal_bidder_id,
                            creater_id:Data1.creater_id,
                            item_id:Data1.item_id,
                            start_time:Data1.start_time,
                        }
                        set_bid_cache({
                            room_id:Data1.id,
                            bid:Data1.initial_bid,
                            bidder_id:Data1.findal_bidder_id,
                            creater_id:Data1.creater_id,
                            item_id:Data1.item_id,
                            start_time:Data1.start_time,
                        });
                    }
                }
                // Will use EPOACH
                if(Data.start_time){
                    const Time_Elapsed = new Date(Data.start_time).getTime();
                    const milli_secs_elapsed = Time_Elapsed - Date.now();
                    if(milli_secs_elapsed>0){
                        return `Auction on room ${Data.room_id} hasn't started yet.`;
                    }
                }else{
                    return `Invalid Start Time.`;
                }
                if(data.bid<Data.bid){
                    return `Not a valid bid by user:${data.user_id}`;
                }
                if(data.user_id==Data.bidder_id){
                    return `User: ${data.user_id} has already placed a bid.`
                }
                let purse=await get_purse_cache(data.user_id);
                if(!purse){
                    const purse1=await getbalance(data.user_id);
                    if(!purse1){
                        return `Not a valid User:${data.user_id}`;
                    }else{
                        purse={
                            bidder_id:data.user_id,
                            budget:purse1,
                        }
                        set_purse_cache({
                            bidder_id:data.user_id,
                            budget:purse1,
                        })
                    }
                }
                if(purse.budget<data.bid){
                    return `Insufficient Funds`;
                }
                set_bid_cache({
                    room_id:data.auction_room_id,
                    bidder_id:data.user_id,
                    bid:data.bid,
                    creater_id:Data.creater_id,
                    item_id:Data.item_id,
                    start_time:Data.start_time,
                });
                let Client_Data:WebSocket[]=[];
                Bidding_Chat(data,tx);
                Update_Room({
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


//From here we have to change at night
export const Close_Auction=async (data:number)=>{
    try{
        return client.$transaction(async (tx) => {
            let Bid_Data=await get_bid_cache(data);
            if(!Bid_Data){
                let Data1=await Get_Auction(data,tx);
                if(typeof(Data1)=='string'){
                    return Data1;
                }
                else if(Data1==null){
                    return "No Auction Found"
                }
                else{
                    Bid_Data={
                        room_id:Data1.id,
                        bid:Data1.initial_bid,
                        bidder_id:Data1.findal_bidder_id,
                        creater_id:Data1.creater_id,
                        item_id:Data1.item_id,
                        start_time:Data1.start_time,
                    }
                    set_bid_cache({
                        room_id:Data1.id,
                        bid:Data1.initial_bid,
                        bidder_id:Data1.findal_bidder_id,
                        creater_id:Data1.creater_id,
                        item_id:Data1.item_id,
                        start_time:Data1.start_time,
                    });
                }
            }
            Update_Auction({
                room_id:data,
                initial_bid:100,
                final_bid:Bid_Data?.bid,
                findal_bidder_id:Bid_Data?.bidder_id,
                status:'Completed'
            },tx);
            //Change Lot of things as Cache came 
            let Item=await get_item_cache(Bid_Data.item_id);
            if(Item==null){
                let Item_Details=await Get_Item(Bid_Data.item_id,tx);
                if(typeof(Item_Details)=='string'){
                    return Item_Details;
                }else if(Item_Details==null){
                    return `Item of Itemid:${Bid_Data.item_id} is not found`
                }else{
                    Item={
                        item_id:Item_Details.id,
                        name:Item_Details.name,
                        owner_id:Item_Details.owner_id,
                        description:Item_Details.description,
                        status:Item_Details.status
                    }
                    set_item_cache({
                        item_id:Item_Details.id,
                        name:Item_Details.name,
                        owner_id:Item_Details.owner_id,
                        description:Item_Details.description,
                        status:Item_Details.status
                    });
                }
            }
            let Item_Status:ItemStatusType;
            if(Bid_Data.bidder_id==-1){
                Item_Status="Unsold";
            }else{
                Item_Status="Sold";
            }
            Update_Item({
                id:Item.item_id,
                description:Item.description,
                status:Item_Status,
            },tx);
            Create_Business_History({
                Amount:Bid_Data.bid,
                buyer_Id:Bid_Data.bidder_id,
                seller_Id:Bid_Data.creater_id,
                itemid:Bid_Data.item_id,
                room_Id:Bid_Data.room_id,
            },tx);
            const Room_Data=M.get(data);
            if(Room_Data){
                let Client_Data:WebSocket[]=[];
                for(let item of Room_Data){
                    Client_Data.push(item.client);
                }
                Post_Notification({
                    userid:Bid_Data.creater_id,
                    message:`Room: ${Bid_Data.room_id} has been closed and auction has been officially ended with highest bidder: ${Bid_Data.bidder_id} quoting an amount of $${Bid_Data.bid}`,
                });
                del_bid_cache(data);
                del_item_cache(Bid_Data.item_id);
                return Client_Data;
            }else{
                return `Room with roomid ${Bid_Data.room_id} doesn't exist`;
            }
        }); 
    }catch(err){
        console.error("Service layer Error:", err);
    }
}

export const Disconnecting=async (data:Disconnect_Data)=>{
    try{
        const Data=M.get(data.room_id);
        if(Data){
            const index=Data.indexOf({
                bidder_id:data.bidder_id,
                client:data.client,
                creater_id:data.creater_id
            });
            if(index!=-1){
                const Data=M.get(data.room_id);
                return Data?.splice(index,1);
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
            let Item=await get_item_cache(data);
            if(Item==null){
                let Item_Details=await Get_Item(data,tx);
                if(typeof(Item_Details)=='string'){
                    return Item_Details;
                }else if(Item_Details==null){
                    return `Item of Itemid:${data} is not found`
                }else{
                    Item={
                        item_id:Item_Details.id,
                        name:Item_Details.name,
                        owner_id:Item_Details.owner_id,
                        description:Item_Details.description,
                        status:Item_Details.status
                    }
                    set_item_cache({
                        item_id:Item_Details.id,
                        name:Item_Details.name,
                        owner_id:Item_Details.owner_id,
                        description:Item_Details.description,
                        status:Item_Details.status
                    });
                }
            }
            const Update_Status=await Update_Item({
                id:Item.item_id,
                description:Item.description,
                status:'Bidding',
            },tx);
            if(typeof(Update_Status)==='string'){
                return Update_Status;
            }
            if(Update_Status===null){
                return `Server Error`;
            }
        });
    }catch(err){
        console.error("Service layer Error:", err);
    }
}