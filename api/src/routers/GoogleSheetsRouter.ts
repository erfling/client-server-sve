import { Team } from './../models/Team';
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

    private  async getGenericState4Content (req: Request, res: Response){
        console.log("CALLED ID")
        const sheets = new GoogleSheets();

        try{
            const sheetsResponse = await sheets.GetSheetValues(req.params.sheetId, "Round 4!B1:M3")
            if(sheetsResponse){

                var resp = sheetsResponse.filter((row:string[], i:number) => {
                    return i == 0 || i == 2; 
                })

                if(resp.length == 2){
                    var finalResp = resp[0].concat(
                        resp[1].filter((cellContent: string) => cellContent.indexOf(req.params.country) != -1)
                    )
                    res.json(finalResp)
                } else{ 
                    res.status(400);
                    res.json("Couldn't get content")
                }
            } else {
                res.status(400);
                res.json("Couldn't get content")
            }
        }
        catch{
            console.log("ERROR REQUESTING")
        }

    }


    private async getRoleContent(req: Request, res: Response){
        if(req.params.role){
            const sheets = new GoogleSheets();
            console.log("ROLE:", req.params.role)
            try{
                const sheetsResponse = await sheets.GetSheetValues(null, "Round 4!B5:C5")
                var finalResponse = req.params.role.toUpperCase().indexOf("BANK") != -1 ? sheetsResponse[0][0] : sheetsResponse[0][1];
                if(finalResponse){
                    res.json(finalResponse)
                } else {
                        res.status(400);
                        res.json("Couldn't get content")
                }
            }
            catch{
                console.log("ERROR REQUESTING")
            }

        } else {
            res.status(400);
            res.json("Params not provided")
        }
    }

    private async GetRatingsByTeam(req: Request, res: Response){
        try{
            const sheets = new GoogleSheets();
            const t = new Team(req.body);
            const values:any = await sheets.getRatingsByNation(t);
            console.log("SHEETS", values)

            if(values){

                res.json(values[0]);
            }else{
                res.status(400);
                res.json("Params not provided")
            }
        }
        catch{
            res.status(400);
            res.json("Params not provided")
        }
        
    }

    public routes(){
        console.log("SETTING UP ROUTES")
        this.router.get("/", this.GetSheetValues);
        this.router.post("/content", this.GetTeamContent);
        this.router.post("/ratings", this.GetRatingsByTeam);
        this.router.get("/content/:country/:sheetId", this.getGenericState4Content);
        this.router.get("/content/rolecontent/role/:role", this.getRoleContent)
    }
}

export default new GoogleSheetsRouter().router;