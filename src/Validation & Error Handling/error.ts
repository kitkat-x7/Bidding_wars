import { string } from "zod"

interface Error_Data{
    message:string,
    status:number,
    name:string
}
class Error_handling implements Error_Data{
    message: any;
    status: number;
    name: string;
    constructor(message:string,status:number){
        this.message=message;
        this.name="Error";
        this.status=status
    }
}

export class Service_Layer_Error extends Error_handling {
    constructor(message:string,status:number) {
      super(message,status); 
      this.name="Service Layer Error";
    }
}

export class Database_Layer_Error extends Error_handling {
    constructor(message:string,status:number) {
      super(message,status); 
      this.name="Database Layer Error";
    }
}