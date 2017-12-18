import { Router, Request, Response, NextFunction } from 'express';
import  GoogleSheets  from '../models/GoogleSheets'; 
import { resolve } from 'dns';

class GoogleSheetsRouter{
    router: Router;
    
    constructor(){
        this.router = Router();
        this.routes();
    }

    public  GetSheetValues(req: Request, res: Response):Promise<any> {
        console.log("GET SHEETS CALLED")
        let sheet = new GoogleSheets();
        
        return sheet.entryPoint(sheet.GetSheetValues, sheet)
        .then( (values) => {
            if(values){
                res.json(values);
            }else{
                res.status(400).json({ error: 'No sheets' });                
            }
        })
        .catch( (err) => {
            res.status(500).json({ error: err })
        });
        /*
        
        try {
            console.log("trying")
            const promise = new Promise((resolve, reject)=>{});
            promise.then((r)=>{
                console.log("top promise", r);
            })
            if (!values) {
                res.status(400).json({ error: 'No sheets' });
            } else {
                const status = res.status;
                res.json( values );
            }
        } catch(err) {
            console.log("ERROR", err);
            ( err: any ) => res.status(500).json({ error: err })
        }
        */
      
    }


    public routes(){
        this.router.get("/", this.GetSheetValues)
    }
}

export default new GoogleSheetsRouter().router;