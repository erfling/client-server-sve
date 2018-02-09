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

class GameRouter{
    router: Router;
    GameModel: any;
    
    constructor(){
        this.router = Router({mergeParams:true});
        this.routes();
    }

    public async GetGames(req: Request, res: Response):Promise<Game[] | any> {
        console.log("GET GAMES CALLED");
        
        try {
            console.log("trying");
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

    public async CreateGame(req: Request, res: Response):Promise<any> {
        const game = new Game(req.body);         
        const g = new GameModel(game);
        
        try {
            await g.save();
            const savedGame = await GameModel.findOne({Slug: game.Slug});

            await this.SaveChildGames(game)

            if (!savedGame) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(savedGame);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err });
        }
    }

    public async UpdateGame(req: Request, res: Response):Promise<IGame | any> {
        const Slug = req.body.Slug;
        const game = new Game(req.body); 

        try {
            let savedGame = await GameModel.findOneAndUpdate({ _id:req.body._id }, game, {new: true }).populate('Teams');
            console.log("after save",savedGame);
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
              res.json(game.Teams);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err });
        }
    } 

    private async SaveChildGames(game: IGame):Promise<any> {
        console.log("trying to get teams from game");
        var teamsToSave: ITeam[] = game.Teams as ITeam[];
        const sheets = new GoogleSheets();
        if(game.NumberOfTeams && game.NumberOfTeams > teamsToSave.length){
            var newTeamsToSave:ITeam[] = [];
            var neededTeams = game.NumberOfTeams - teamsToSave.length;
            for(var i = 0; i < neededTeams; i++){
                //const sheetId = await sheets.createTeamSheet(null, " ");
                newTeamsToSave.push()
            }
        }

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
        this.router.get("/", this.GetGames);
        this.router.get("/:game", this.GetGame);
        this.router.post("/", this.CreateGame);
        this.router.put("/:game", this.UpdateGame);
        this.router.use("/:game/teams", this.GetTeams);
    }
}

export default new GameRouter().router;