import { Router, Request, Response, NextFunction } from 'express';
import  GoogleSheets  from '../models/GoogleSheets'; 
import { resolve } from 'dns';
import ITeam from '../../../shared/models/ITeam';


class GoogleSheetsRouter
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    public router: Router;
    
    //----------------------------------------------------------------------
    //
    //  Constructor
    //
    //----------------------------------------------------------------------

    constructor() {
        this.router = Router();
        this.routes();
    }

    //----------------------------------------------------------------------
    //
    //  Event Handlers
    //
    //----------------------------------------------------------------------


    
    //----------------------------------------------------------------------
    //
    //  Methods
    //
    //----------------------------------------------------------------------
    
    public GetSheetValues(req: Request, res: Response):Promise<any> {
        console.log("GET SHEETS CALLED")
        let sheet = new GoogleSheets();
        
        return sheet.entryPoint(sheet.GetSheetValues, sheet)
        .then( (values) => {
            if (values) {
                res.json(values);
            } else {
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

    private async GetTeamContent(req: Request, res: Response){
        const state = (req.body as ITeam).GameState;

        const sheets = new GoogleSheets();
        
        var range = "";

        switch(state){
            case "3A":
                range = "Round 3 Criteria!B9"
            default:
                break;
        }

        if(!range){
            res.status(400);
            res.json("No Game State provided")
        }

        const content = await sheets.GetSheetValues(null, range);

        console.log(content);

        res.json(content)


    }

    public routes(){
        this.router.get("/", this.GetSheetValues);
        this.router.post("/content", this.GetTeamContent);
    }
}

export default new GoogleSheetsRouter().router;