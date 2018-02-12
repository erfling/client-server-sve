import { Router, Request, Response, NextFunction } from 'express';
import { Team, TeamModel } from '../models/Team'; 
import { Error } from 'mongoose';

class TeamRouter{
    router: Router;
    TeamModel: any;
    
    constructor(){
        this.router = Router( { mergeParams: true } );
        this.routes();
    }

    public async GetTeams(req: Request, res: Response):Promise<Team[] | any> {
        console.log("GET TEAMS CALLED")
    
        console.log("TEAMS REQ:", req.params)
        try {
            console.log("trying")
            let teams = await TeamModel.find({}).populate("Players");
            console.log("Teams", teams, Team)
            if (!teams) {
                res.status(400).json({ error: 'No games' });
            } else {
                const status = res.status;
                res.json( teams );
            }
        } catch(err) {
            console.log("ERROR", err);
            ( err: any ) => res.status(500).json({ error: err })
        }       
      
    }

    public async GetTeam(req: Request, res: Response):Promise<any> {
        console.log("TEAMS REQ:", req.params)
        
        const Slug = req.params.team;
        
        try {
            let game = await TeamModel.findOne(Object.assign({Slug})).populate("Players");
        
            if (!game) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(game);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err })
        }
    }

    public async CreateTeam(req: Request, res: Response):Promise<any> {
        console.log("CREATING TEAM", req.body);
        const team = new Team(req.body);  
        console.log( team);
        const t = new TeamModel(team);
        
        try {
            await t.save();
            const savedGame = await TeamModel.findOne({Slug: team.Slug});
            if (!savedGame) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(savedGame);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err })
        }
    }

    public UpdateTeam(req: Request, res: Response):void {
        
    }

    public routes(){
        this.router.get("/", this.GetTeams)
        console.log("yes");
        this.router.get("/:team", this.GetTeam)
        this.router.post("/", this.CreateTeam)
    }
}

export default new TeamRouter().router;