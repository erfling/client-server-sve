import { Router, Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { Game, GameModel } from '../models/Game'; 
import IGame from '../../../shared/models/IGame'; 
import { Error } from 'mongoose';
import TeamRouter  from './TeamRouter';
import { Team,TeamModel } from './../models/Team';
import ITeam from '../../../shared/models/ITeam';
import Item from 'antd/lib/list/Item';
import GoogleSheets from '../models/GoogleSheets'


class GameRouter
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    public router: Router;
    public GameModel: any;
    private Sheets: GoogleSheets;
    
    //----------------------------------------------------------------------
    //
    //  Constructor
    //
    //----------------------------------------------------------------------

    constructor() {
        this.router = Router({mergeParams:true});
        this.Sheets = new GoogleSheets();
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
    
    public async GetGames(req: Request, res: Response):Promise<Game[] | any> {
        console.log("GET GAMES CALLED");
        
        try {
            let games = await GameModel.find().populate('Teams');
            if (!games) {
                return res.status(400).json({ error: 'No games' });
            } else {
                const status = res.status;
                return res.json( games );
            }
        } catch(err) {
            console.log("ERROR", err);
            ( err: any ) => res.status(500).json({ error: err });
        }
        
    }

    public async GetGame(req: Request, res: Response):Promise<any> {
        const Slug = req.params.game;
        console.log(Slug);
        try {
            let game = await GameModel.findOne({Slug}).populate({path : 'Teams', populate : {path : 'Players'}});
        
            if (!game) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(game);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err });
        }
    }

    public CreateGame(req: Request, res: Response):Promise<any> {
        const game = new Game(req.body);         
        const g = new GameModel(game);
        
        const saveChildGames = this.SaveChildGames;
        //
        return g.save()
                .then(this.SaveChildGames.bind(this))
                .then((g) => {res.json(g)})
                .catch(() => res.status(400).json({ error: 'Save Failed' }));
    }

    public async UpdateGame(req: Request, res: Response):Promise<IGame | any> {
        const Slug = req.body.Slug;
        const game = new Game(req.body); 
        console.log(req.body);
        try {
            let savedGame = await GameModel.findOneAndUpdate({ _id:req.body._id }, game, {new: true }).populate('Teams');
            if (!savedGame) {
              res.status(400).json({ error: "couldn't but we tried"});
            } else {
              res.json(savedGame);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err });
        }
    
    }

    public async GetTeams(req: Request, res: Response):Promise<any> {
        console.log("trying to get teams from game");
        const Slug = req.params.game;
        try {
            let game = await GameModel.findOne({Slug}).populate("Teams");
        
            if (!game) {
                res.status(400).json({ error: 'No games' });
            } else {
                let g:IGame = game as IGame;
                res.json(g.Teams);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err });
        }
    } 

    private getSheets(){
        if(!this.Sheets)this.Sheets = new GoogleSheets();
        return this.Sheets;
    }

    private async SaveChildGames(game: IGame):Promise<any> {
        console.log("SAVE CHILD GAMES CALLED");

        //ALL GOOGLE SVE GAMES HAVE 6 TEAMS
        let gamesNeeded = 6 - game.Teams.length;
        console.log(gamesNeeded, game);
        var promises = [];          
        for(let i = 0; i < gamesNeeded; i++){
            console.log(i, game.Location + " " + " Team " + (i + 1));
            //+ game.DatePlayed.toISOString()

            
            let promise = this.Sheets.createTeamSheet(game.Location + " " + game.DatePlayed.toLocaleDateString() + " Team " + (i + 1), game.SourceSheetId)
                                .then((sheetId:any) => {console.log("RETURNED SHEETID:", sheetId); return Promise.resolve(new Team({GameId: game._id, SheetId: sheetId}))})
                                .then((t:ITeam) => TeamModel.create(t))
            
            
            promises.push(promise);



            //Create spreadsheet for team
            /*
            try{
                let sheetId = await sheets.createTeamSheet(game.Location + " " + game.DatePlayed.toISOString() + " Team " + gamesNeeded);
                console.log(sheetId);
                let t = new Team({GameId: game._id, SheetId: sheetId});
                let team = await TeamModel.create(t);
                if(team){
                    let teams:string[] = game.Teams as string[];
                    teams.push(team._id);
                }

            }
            catch{
                console.log("ERROR")
            }
            */
        }
        

        return Promise.all(promises).then((promises) => {
            
            var teams: string[] = promises.map(p => p._id)

            return GameModel.findOneAndUpdate({Slug: game.Slug}, { Teams: promises }, {new: true}, ()=>{

            })
            
        });
        /*
        try{
            return await GameModel.findOneAndUpdate({Slug: game.Slug}, { Teams: game.Teams }, {new: true}, ()=>{

            })
        }
        catch{

        }
        */

/*
        try {
        
            if (!game) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(game.Teams);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err });
        }
        */
    } 

    public routes(){
        //this.router.all("*", cors());
        this.getSheets();
        this.router.get("/", this.GetGames.bind(this));
        this.router.get("/:game", this.GetGame.bind(this));
        this.router.post("/", this.CreateGame.bind(this));
        this.router.put("/:game", this.UpdateGame.bind(this));
        this.router.use("/:game/teams", this.GetTeams.bind(this));
    }
}

export default new GameRouter().router;