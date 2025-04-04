import NodeCache from "node-cache";
import WebSocket from "ws";
const myCache=new NodeCache();

interface User_Cache{
    user_id:number,
    email:string,
    name:string,
    phone_number:string,
}



interface Purse_Details{
    bidder_id:number,
    budget:number,
}

interface Room_bids{
    room_id:number,
    bidder_id:number,
    bid:number,
    item_id:number,
    creater_id:number,
    start_time:string
}


interface Item_Cache{
    item_id:number,
    name:string,
    owner_id:number,
    description:string,
    status:string
}

export const get_user_cache=async (user_id:number)=>{
    const id=`user${user_id}`;
    const value=await myCache.get(id) as User_Cache|undefined;
    if(value==undefined){
        return null;
    }else{
        return value;
    }
}


export const get_item_cache=async (item_id:number)=>{
    const id=`item${item_id}`;
    const value=await myCache.get(id) as Item_Cache|undefined;
    if(value==undefined){
        return null;
    }else{
        return value;
    }
}




export const get_purse_cache=async (bidder_id:number)=>{
    const id=`purse${bidder_id}`;
    const value=await myCache.get(id) as Purse_Details;
    if(value==undefined){
        return null;
    }else{
        return value;
    }
}

export const get_bid_cache=async (room_id:number)=>{
    const id=`bid${room_id}`;
    const value=await myCache.get(id) as Room_bids;
    if(value==undefined){
        return null;
    }else{
        return value;
    }
}



export const set_purse_cache=(data:Purse_Details)=>{
    const id=`purse${data.bidder_id}`;
    myCache.set(id,data.budget,100000);
}

export const set_bid_cache=(data:Room_bids)=>{
    const id=`bid${data.room_id}`;
    myCache.set(id,{"bidder_id":data.bidder_id,"bid":data.bid});
}

export const set_user_cache=(data:User_Cache)=>{
    const id=`user${data.user_id}`;
    myCache.set(id,{
        user_id:data.user_id,
        email:data.email,
        name:data.name,
        phone_number:data.phone_number,
    },100000);
}
export const set_item_cache=(data:Item_Cache)=>{
    const id=`item${data.item_id}`;
    myCache.set(id,{
        item_id:data.item_id,
        name:data.name,
        owner_id:data.owner_id,
        description:data.description,
        status:data.status
    });
}


export const del_purse_cache=async (bidder_id:number)=>{
    const id=`purse${bidder_id}`;
    myCache.del(id);
}

export const del_bid_cache=(room_id:number)=>{
    const id=`bid${room_id}`;
    myCache.del(id);
}

export const del_user_cache=(user_id:number)=>{
    const id=`user${user_id}`;
    myCache.del(id);
}

export const del_item_cache=(item_id:number)=>{
    const id=`item${item_id}`;
    myCache.del(id);
}