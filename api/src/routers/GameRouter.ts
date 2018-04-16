import { CriteriaName } from './../../../shared/models/CriteriaName';
import { Router, Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { Game, GameModel } from '../models/Game'; 
import { Nation, NationModel } from '../models/Nation'; 
import IGame from '../../../shared/models/IGame'; 
import { Error } from 'mongoose';
import * as mongoose from 'mongoose';
import TeamRouter  from './TeamRouter';
import { Team,TeamModel } from './../models/Team';
import { PlatformExperiment, PlatformExperimentModel } from './../models/Experiment';
import ITeam from '../../../shared/models/ITeam';
import Item from 'antd/lib/list/Item';
import GoogleSheets from '../models/GoogleSheets'
import INation from '../../../shared/models/INation';
import { Ratings } from '../models/Ratings';
import IRatings from '../../../shared/models/IRatings';


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
            let games = await GameModel.find().populate({path: "Teams"});
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
        const ID = req.params.game;
        console.log(ID);
        try {
            let game = await GameModel.findById(ID).populate({path: "Teams", populate: {path: "Nation"}});
        
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
        
        const savedGame = await g.save();

        const sheetId = await GoogleSheets.createTeamSheet((savedGame.Name ? savedGame.Name + ", " : null) + savedGame.Location + " " + savedGame.DatePlayed.toLocaleDateString(), savedGame.SourceSheetId)
        const newGame = await GameModel.findOneAndUpdate({_id: g._id},{SheetId: sheetId, State: "1A"},{new:true});

        const gameWithTeams = await this.SaveChildGames(newGame);
        console.log("DIG:", gameWithTeams);
        res.json(gameWithTeams);
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
            
            const savedGame = await GameModel.findByIdAndUpdate(req.body.GameId, {TeamRatings: existingTeamRatings}, {new:true});

            var keys = Object.keys((savedGame.TeamRatings as IRatings));

            var sheetValues = keys.sort((a,b) => a > b ? 1 : 0).map((countryName: keyof IRatings) => {
                    return [ (savedGame.TeamRatings[countryName] as any)[CriteriaName.COMPELLING_EMOTIONAL_CONTENT] / (savedGame.TeamRatings[countryName] as any)['numVotes'],
                             (savedGame.TeamRatings[countryName] as any)[CriteriaName.DEMONSTRATED_SYSTEMIC_IMPACT] / (savedGame.TeamRatings[countryName] as any)['numVotes'],
                             (savedGame.TeamRatings[countryName] as any)[CriteriaName.STRONG_EXECUTIVE_PRESENCE] / (savedGame.TeamRatings[countryName] as any)['numVotes']
                           ]
            })

            //find missing country
            if(sheetValues.length < 6){
                var nations =  [
                    "Australia",
                    "Bangladesh",
                    "China",
                    "India",
                    "Japan",
                    "Vietnam"
                ]

                //if there are any missing nations, push in an array of empties of the right length
                nations.forEach((nation:string, i) => {
                    if( keys.indexOf(nation) == -1 ){
                        sheetValues.splice(i, 0, [null, null, null])
                    }
                });
            }
            
            GoogleSheets.commitAnswers(sheetValues,"Round 3 Criteria!B2:D7", game.SheetId)

            console.log(sheetValues);

            
            const savedTeam = await TeamModel.findByIdAndUpdate(req.body._id, {Ratings: req.body.Ratings}, {new: true})
                    .populate("Nation")
                    .then(t => t);
            
            res.json(req.body);
        } catch(error) {
            console.log("Blew up:", error);
            res.status(400);
            res.json(error);
        }
    }

    private getSheets(){
        if(!this.Sheets)this.Sheets = GoogleSheets;
        return this.Sheets;
    }

    private async SaveChildGames(game: IGame):Promise<any> {
        console.log("SAVE CHILD GAMES CALLED");
        let nations = await NationModel.find()
        //ALL GOOGLE SVE GAMES HAVE 6 TEAMS
        nations.sort((a: INation, b: INation) => a.Name > b.Name ? 1 : 0);
        let gamesNeeded = 6 - game.Teams.length;
        console.log(gamesNeeded, game);
        var promises = [];          
        for(let i = 0; i < gamesNeeded; i++){
            console.log(i, game.Location + " " + " Team " + (i + 1));
            //+ game.DatePlayed.toISOString()

            var team = new Team({GameId: game._id, SheetId: game.SheetId, SourceSheetId: game.SourceSheetId, Slug: "Team" + (i + 1) + "-" + game._id, Nation: nations[i]._id, TeamNumber: (i + 1)})

            let promise = TeamModel.create(team);
            
            promises.push(promise);

        }

        return Promise.all(promises).then((promises) => {
            var teams: string[] = promises.map(p => p._id);
            return teams;
        }).then((teams) => {
            return GameModel.findOneAndUpdate({_id: game._id}, { Teams: teams }, {new: true}).then( (game)=>{
                return game;
            })
        })
        
    } 

    private async setCurrentGame(req: Request, res: Response):Promise<any> {
        const game = new Game(req.body);         
        const g = new GameModel(game);
        try{
            
            const allGamesUpdated = await GameModel.updateMany({IsCurrentGame: true}, {IsCurrentGame: false});
            const updatedGame     = await GameModel.findByIdAndUpdate(g._id, {IsCurrentGame: true});
            const allGames        = await GameModel.find();

            if(allGames){
                res.json(allGames)
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
            const currentGame = await GameModel.findOne({IsCurrentGame: true}).populate({path: "Teams", populate:{path: "Nation"}})
            if(currentGame){
                //this.SaveChildGames(currentGame);
                res.json(currentGame)
            }else{
                res.status(400);
                res.json("Couldn't find the current game")
            }
        }catch{
            throw("OH NO")
        }
    }

    private async ResetGame(req: Request, res: Response){
     
        try{
            const updatedGame = await GameModel.findOneAndUpdate( {_id: req.body._id}, { State: "1A", TeamRatings:{}, SubmissionsByRound: null }, {new: true}).populate("Teams")

            if(updatedGame){
                //reset spreadsheet ranges
                const sheetId = updatedGame.SheetId
                //clear team ratings
                const ratingsCleared     = await GoogleSheets.clearRange(sheetId, "Round 3 Criteria!B2:D7");
                //clear role deals
                const roleDealsCleared   = await GoogleSheets.clearRange(sheetId, "Round 4!B14:M17");
                //clear tech investments
                const investmentsCleared = await GoogleSheets.clearRange(sheetId, "Country Impact!C12:C17");
 
                var slugs = (updatedGame.Teams as ITeam[]).map(t => t._id)
                console.log(slugs);
                
                const updatedTeams = await TeamModel.updateMany({_id: {$in: slugs}},{
                    DealsProposedTo: [],
                    DealsProposedBy: [],
                    TeamRatings: new Ratings(),
                    GameState: "1A",
                    Roles:{},
                    Ratings:{},
                    ChosenHorse:null
                },{
                    new: true
                })

                const resetGame = await GameModel.findOne( {_id: req.body._id} ).populate({path: "Teams", populate: {path: "Nation"}} );
                res.json(resetGame);
            } else {
                res.status(400);
                res.json("No Game Was Found")
            }
        }
        catch{
            res.status(400);
            res.json("Couldn't Reset")
        }
    }

    private async saveExperiment(req:Request, res:Response) {
        console.log("SAVING EXPERIMENT")
        if(req.body){
            try{
                var experiment = new PlatformExperiment(req.body);
                const savedExperiment = PlatformExperimentModel.create(experiment);
                if(savedExperiment){
                    res.json(savedExperiment)
                } else {
                    res.status(400);
                    res.json("Couldn't save experiment")
                }
            }
            catch{
                res.status(400);
                res.json("Couldn't save experiment")
            }
        }
    }

    private async getNumberOfValidTeamsByRound(req: Request, res: Response){
        if(req.body){
            const roundNumberIdx = parseInt(req.body.GameState.charAt(0)) - 1;

            const game = await GameModel.findById(req.body.GameId);
            if(game){
                if(game.SubmissionsByRound && game.SubmissionsByRound[roundNumberIdx]){
                    res.json({NumTeams: game.Teams.length, TeamsCompleted: game.SubmissionsByRound[roundNumberIdx]})
                }else{
                    res.json({NumTeams: game.Teams.length, TeamsCompleted: 0})
                }
            } else {
                res.status(400);
                res.json('FAILED')
            }
        } else {
            res.status(400);
            res.json('NO POST BODY')
        }
    }

    public routes(){
        //this.router.all("*", cors());
        this.router.get("/", this.GetGames.bind(this));
        this.router.get("/:game", this.GetGame.bind(this));
        this.router.get("/req/getcurrentgame", this.getCurrentGame.bind(this));
        this.router.post("/req/validteams", this.getNumberOfValidTeamsByRound.bind(this));
        this.router.post("/", this.CreateGame.bind(this));
        this.router.post("/setcurrent", this.setCurrentGame.bind(this));
        this.router.post("/saveexperiment", this.saveExperiment.bind(this));
        this.router.put("/:game", this.UpdateGame.bind(this));
        this.router.use("/:game/teams", this.GetTeams.bind(this));
        this.router.post("/teamratings", this.AddTeamRatings);
        this.router.post("/resetgame", this.ResetGame.bind(this));

    }
}

export default new GameRouter().router;