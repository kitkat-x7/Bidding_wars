import { PrismaClient,Prisma } from "@prisma/client";
// const client=new PrismaClient();

interface RoomData{
    item_id:number,
    initial_bid:number,
    creater_id:number,
    start_time:string
}

interface ChatData{
    auction_room_id:number,
    user_id:number,
    bid:number
}

interface Update_RoomData{
    room_id:number,
    final_bidder:number
    bid:number,
}

type RoomStatusType = "Live" | "Completed" | "Halt" | "Not_Started";
interface Auction{
    room_id:number,
    initial_bid:number,
    final_bid:number,
    findal_bidder_id:number,
    status:RoomStatusType
}
type ItemStatusType = "Sold" | "Unsold" | "Bidding" | "Onhold";
interface Item{
    id:number
    description:string
    status:ItemStatusType
}

interface Business_History{
    Amount:number,
    buyer_Id:number,
    seller_Id:number,
    itemid:number,
    room_Id:number,
}
export const Create_Room=async (data:RoomData,tx:Prisma.TransactionClient)=>{
    try{
        const Room=await tx.auction.create({
            data:{
                room_status:"Not_Started",
                item_id:data.item_id,
                initial_bid:data.initial_bid,
                creater_id:data.creater_id,
                start_time:data.start_time,
            }
        });
        return Room;
    }catch(err: any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}

export const Bidding_Chat=async (data:ChatData,tx:Prisma.TransactionClient)=>{
    try{
        const exist=await tx.auction.findUnique({
            where:{
                id:data.auction_room_id
            }
        });
        if(exist){
            await tx.room.create({
                data:{
                    auction_room_id:data.auction_room_id,
                    user_id:data.user_id,
                    bid:data.bid
                }
            });
        }else{
            return `Room with this room id ${data.auction_room_id} doesn't exists`;
        }
    }catch(err:any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}

export const Update_Room=async (data:Update_RoomData,tx:Prisma.TransactionClient)=>{
    try{
        const Data=await tx.auction.update({
            where:{
                id:data.room_id,
            },
            data:{
                findal_bidder_id:data.final_bidder,
                final_bid:data.bid
            }
        });
        return Data;
    }catch(err:any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}


export const Get_Auction=async (data:number,tx:Prisma.TransactionClient)=>{
    try{
        const Auction_Data=await tx.auction.findUnique({
            where:{
                id:data,
            }
        });
        if(Auction_Data){
            return Auction_Data;
        }else{
            return "Invalid Auction Id";
        }
    }catch(err:any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}

export const Update_Auction=async (data:Auction,tx:Prisma.TransactionClient)=>{
    try{
        const Data=await tx.auction.update({
            where:{
                id:data.room_id,
            },
            data:{
                findal_bidder_id:data.findal_bidder_id,
                final_bid:data.final_bid,
                room_status:data.status,
                initial_bid:data.initial_bid
            }
        });
        return Data;
    }catch(err: any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}

export const Get_Item=async (data:number,tx:Prisma.TransactionClient)=>{
    try{
        const Data=await tx.item.findUnique({
            where:{
                id:data
            }
        });
        if(Data){
            return Data;
        }else{
            return `Room with this room id ${data} doesn't exists`;
        }
    }catch(err:any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}


export const Update_Item=async (data:Item,tx:Prisma.TransactionClient)=>{
    try{
        const Data=await tx.item.update({
            where:{
                id:data.id,
            },
            data:{
                description:data.description,
                status:data.status,
            }
        });
        return Data;
    }catch(err: any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}

export const Create_Business_History=async (data:Business_History,tx:Prisma.TransactionClient)=>{
    try{
        const Data=await tx.order_History.create({
            data:{
                Amount:data.Amount,
                buyer_Id:data.buyer_Id,
                seller_Id:data.seller_Id,
                itemid:data.itemid,
                room_Id:data.room_Id,
            }
        });
        return Data;
    }catch(err: any) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            console.error("Prisma Known Error:", err.message, "Code:", err.code);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientValidationError){
            console.error("Prisma Validation Error:", err.message);
            return err.message;
        } 
        else if(err instanceof Prisma.PrismaClientUnknownRequestError){
            console.error("Prisma Unknown Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientRustPanicError){
            console.error("Prisma Panic Error:", err.message);
            return err.message;
        }else if(err instanceof Prisma.PrismaClientInitializationError){
            console.error("Prisma initialization Error:", err.message);
            return err.message;
        }
        else{
            console.error("Unknown Database Error:", err);
            return "Unknown Database Error";
        }
    }
}
