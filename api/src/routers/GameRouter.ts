import { Router, Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { Game, GameModel } from '../models/Game'; 
import IGame from '../../../shared/models/IGame'; 
import { Error } from 'mongoose';
import * as mongoose from 'mongoose';
import TeamRouter  from './TeamRouter';
import { Team,TeamModel } from './../models/Team';
import ITeam from '../../../shared/models/ITeam';
import Item from 'antd/lib/list/Item';
import GoogleSheets from '../models/GoogleSheets'
import INation from '../../../shared/models/INation';
import { Ratings } from '../models/Ratings';


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

    public async AddTeamRatings(req: Request, res: Response):Promise<any> {
        console.log(req.body);
        try {
            var newTeamRatings:Ratings = req.body.Ratings; // passed team rating
            const game:IGame = await GameModel.findById(req.body.GameId);
            console.log(game);
            var existingTeamRatings:Ratings = (<Ratings>(<IGame>game).TeamRatings);
            if(!existingTeamRatings)existingTeamRatings = new Ratings();

        

            Object.keys(newTeamRatings).forEach(nationKey => {
                var newTeamRatingNation:any = (<any>newTeamRatings)[nationKey];
                Object.keys((<any>newTeamRatings)[nationKey]).forEach(criteria => {
                    if (newTeamRatingNation[criteria]) {
                        console.log(criteria);
                        // set if doesn't exist
                        if (!(<any>existingTeamRatings)[nationKey]) (<any>existingTeamRatings)[nationKey] = {};
                        if (!(<any>existingTeamRatings)[nationKey][criteria]) (<any>existingTeamRatings)[nationKey][criteria] = 0;

                        (<any>existingTeamRatings)[nationKey][criteria] = (<any>existingTeamRatings)[nationKey][criteria] || 0;
                        (<any>existingTeamRatings)[nationKey][criteria] += parseInt(newTeamRatingNation[criteria]);
                    }
                })
                if (!(<any>existingTeamRatings)[nationKey]['numVotes']) (<any>existingTeamRatings)[nationKey]['numVotes'] = 0;
                (<any>existingTeamRatings)[nationKey]['numVotes']++;
            })
            
            console.log("!!!Rating for saving:", existingTeamRatings);
            const savedTeamRatings = await GameModel.findByIdAndUpdate(req.body.GameId, {TeamRatings: existingTeamRatings}, {new:true});

            /*
            const savedTeam = await TeamModel.findByIdAndUpdate(req.body._id, {Ratings: req.body.Ratings}, {new: true})
                    .populate("Nation")
                    .then(t => t);
            
            const gameTeams = await TeamModel.find({GameId: {$in: savedTeam.GameId}})
                    .populate("Nation")
                    .then(t => t);

            var innerTeamRatingForOuterTeam:any = {};
            const sheets = new GoogleSheets();
            var sheetSubmitVals:string[][] = [];
            gameTeams.forEach((t:Team, i) => {
                var averagedRating:any = {};
                gameTeams
                    .filter(team => team.Slug != t.Slug && team.Ratings != undefined)
                    .forEach(team => {
                        innerTeamRatingForOuterTeam = (<any>team.Ratings)[(<INation>t.Nation).Name];
                        if (innerTeamRatingForOuterTeam) {
                            if (innerTeamRatingForOuterTeam["COMPELLING_EMOTIONAL_CONTENT"]) {
                                innerTeamRatingForOuterTeam["COMPELLING_EMOTIONAL_CONTENT"] = parseInt(innerTeamRatingForOuterTeam["COMPELLING_EMOTIONAL_CONTENT"] || 0);
                                averagedRating["COMPELLING_EMOTIONAL_CONTENT"] = parseInt(averagedRating["COMPELLING_EMOTIONAL_CONTENT"] || 0);
                                averagedRating["COMPELLING_EMOTIONAL_CONTENT"] += innerTeamRatingForOuterTeam["COMPELLING_EMOTIONAL_CONTENT"] / 5;
                            }
                            if (innerTeamRatingForOuterTeam["DEMONSTRATED_SYSTEMIC_IMPACT"]) {
                                innerTeamRatingForOuterTeam["DEMONSTRATED_SYSTEMIC_IMPACT"] = parseInt(innerTeamRatingForOuterTeam["DEMONSTRATED_SYSTEMIC_IMPACT"] || 0);
                                averagedRating["DEMONSTRATED_SYSTEMIC_IMPACT"] = parseInt(averagedRating["DEMONSTRATED_SYSTEMIC_IMPACT"] || 0);
                                averagedRating["DEMONSTRATED_SYSTEMIC_IMPACT"] += innerTeamRatingForOuterTeam["DEMONSTRATED_SYSTEMIC_IMPACT"] / 5;
                            }
                            if (innerTeamRatingForOuterTeam["STRONG_EXECUTIVE_PRESENCE"]) {
                                innerTeamRatingForOuterTeam["STRONG_EXECUTIVE_PRESENCE"] = parseInt(innerTeamRatingForOuterTeam["STRONG_EXECUTIVE_PRESENCE"] || 0);
                                averagedRating["STRONG_EXECUTIVE_PRESENCE"] = parseInt(averagedRating["STRONG_EXECUTIVE_PRESENCE"] || 0);
                                averagedRating["STRONG_EXECUTIVE_PRESENCE"] += innerTeamRatingForOuterTeam["STRONG_EXECUTIVE_PRESENCE"] / 5;
                            }
                        }
                    });

                    TeamModel.findOneAndUpdate({Slug: t.Slug}, {MyAverageNationRating: averagedRating});

                    sheetSubmitVals[i] = [averagedRating["COMPELLING_EMOTIONAL_CONTENT"], averagedRating["DEMONSTRATED_SYSTEMIC_IMPACT"], averagedRating["STRONG_EXECUTIVE_PRESENCE"], [(<INation>t.Nation).Name]];
            })
            console.log( "ALL",sheetSubmitVals)
            //TODO: we need to wait to do this until all teams have submitted
            sheets.commitAnswers(sheetSubmitVals.sort((a,b) =>  a[4] > b[4] ? 1: 0).map(v => [ v[0], v[1], v[2] ] ),"Round 3 Criteria!B2:D7")
            res.json(savedTeam);*/
        } catch(error) {
            console.log("Blew up:", error);
            res.status(400);
            res.json(error);
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
                                .then((sheetId:any) => {console.log("RETURNED SHEETID:", sheetId); return Promise.resolve(new Team({GameId: game._id, SheetId: sheetId, Slug: "Team" + (i + 1) + "-" + game._id}))})
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

    private async setCurrentGame(req: Request, res: Response):Promise<any> {
        const game = new Game(req.body);         
        const g = new GameModel(game);
        try{
            const allGames = await GameModel.find()
            //build update all query ids
            const ids = allGames.map(g => g.toObject()._id);
            console.log(ids)
            const updatedGames = await GameModel.updateMany({_id: {$in: ids}}, {IsCurrentGame: false}, {new: true})
            console.log(updatedGames);

            const updatedGame  = await GameModel.findByIdAndUpdate(g._id, {IsCurrentGame: true})
            const newAllGames = await GameModel.find()

            if(newAllGames){
                console.log(newAllGames)
                res.json(newAllGames)
            } else {
                res.status(400);
                res.json("couldn't save games")
            }
        } 
        catch{
            throw("UH OH")
        }
    }

    private async getCurrentGame(req: Request, res: Response){
        console.log("we calling this")
        try{
            const currentGame = await GameModel.findOne({IsCurrentGame: true}).populate("Teams")
            if(currentGame){
                res.json(currentGame)
            }else{
                res.status(400);
                res.json("Couldn't find the current game")
            }
        }catch{
            throw("OH NO")
        }
    }

    public routes(){
        //this.router.all("*", cors());
        this.getSheets();
        this.router.get("/", this.GetGames.bind(this));
        this.router.get("/:game", this.GetGame.bind(this));
        this.router.get("/req/getcurrentgame", this.getCurrentGame.bind(this));
        this.router.post("/", this.CreateGame.bind(this));
        this.router.post("/setcurrent", this.setCurrentGame.bind(this));
        this.router.put("/:game", this.UpdateGame.bind(this));
        this.router.use("/:game/teams", this.GetTeams.bind(this));
        this.router.post("/teamratings", this.AddTeamRatings);
    }
}

export default new GameRouter().router;