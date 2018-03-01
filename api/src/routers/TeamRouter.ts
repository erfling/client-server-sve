import { Router, Request, Response, NextFunction } from 'express';
import { Team, TeamModel } from '../models/Team'; 
import { Error } from 'mongoose';
import INation from '../../../shared/models/INation';
import { CriteriaName } from '../../../shared/models/CriteriaName';
import GoogleSheets from '../models/GoogleSheets';
import IRatings from '../../../shared/models/IRatings';
class TeamRouter
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    public router: Router;
    public TeamModel: any;
    
    //----------------------------------------------------------------------
    //
    //  Constructor
    //
    //----------------------------------------------------------------------

    constructor() {
        this.router = Router( { mergeParams: true } );
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
    
    public async GetTeams(req: Request, res: Response):Promise<Team[] | any> {
        console.log("GET TEAMS CALLED");
    
        console.log("TEAMS REQ:", req.params);
        try {
            let teams = await TeamModel.find({}).populate("Players").populate("Nation");
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
        console.log("TEAMS REQ:", req.params);
        
        const Slug = req.params.team;
        
        try {
            let game = await TeamModel.findOne(Object.assign({Slug})).populate("Players").populate("Nation");
        
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
            const savedGame = await TeamModel.findOne({Slug: team.Slug}).populate("Nation");;
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

    public async AddRatings(req: Request, res: Response):Promise<any> {
        console.log(req.body);
        try {
            const savedTeam = await TeamModel.findByIdAndUpdate(req.body._id, {Ratings: req.body.Ratings}, {new: true})
                    .populate("Nation")
                    .then(t => t);

            const gameTeams = await TeamModel.find({GameId: {$in: savedTeam.GameId}})
            var numRatings = gameTeams.filter(t => t.Ratings && (<any>t.Ratings)[(<INation>savedTeam.Nation).Name]).length;
            var ratingsHolder:number[] = [];
            var teamRatingForMyNation:any = {};
            var ratings:{ [C in CriteriaName]:number } = null;
            const sheets = new GoogleSheets();
            var sheetSubmitVals:string[][] = [];
            gameTeams.forEach((t:Team, i) => {
                var averagedRating:any = {};
                gameTeams
                    .filter(team => team.Slug != t.Slug && team.Ratings != undefined)
                    .forEach(team => {
                        console.log(team.Ratings);

                        teamRatingForMyNation = (<any>team.Ratings)[(<INation>t.Nation).Name];
                        if(teamRatingForMyNation){
                            if (teamRatingForMyNation["Compelling Emotional Content"]) {
                                teamRatingForMyNation["Compelling Emotional Content"] = parseInt(teamRatingForMyNation["Compelling Emotional Content"] || 0);
                                averagedRating["Compelling Emotional Content"] = parseInt(averagedRating["Compelling Emotional Content"] || 0);
                                averagedRating["Compelling Emotional Content"] += teamRatingForMyNation["Compelling Emotional Content"] / 5;
                            }
                            if (teamRatingForMyNation["Demonstrated Systemic Impact"]) {
                                teamRatingForMyNation["Demonstrated Systemic Impact"] = parseInt(teamRatingForMyNation["Demonstrated Systemic Impact"] || 0);
                                averagedRating["Demonstrated Systemic Impact"] = parseInt(averagedRating["Demonstrated Systemic Impact"] || 0);
                                averagedRating["Demonstrated Systemic Impact"] += teamRatingForMyNation["Demonstrated Systemic Impact"] / 5;
                            }
                            if (teamRatingForMyNation["Strong Executive Presence"]) {
                                teamRatingForMyNation["Strong Executive Presence"] = parseInt(teamRatingForMyNation["Strong Executive Presence"] || 0);
                                averagedRating["Strong Executive Presence"] = parseInt(averagedRating["Strong Executive Presence"] || 0);
                                averagedRating["Strong Executive Presence"] += teamRatingForMyNation["Strong Executive Presence"] / 5;
                            }
                        }
                    });
                

                    TeamModel.findOneAndUpdate({Slug: t.Slug}, {Ratings: averagedRating});

                   sheetSubmitVals[i] = [averagedRating["Compelling Emotional Content"], averagedRating["Demonstrated Systemic Impact"], averagedRating["Strong Executive Presence"]];
                   console.log("SOME", sheetSubmitVals[i])
            })

            console.log( "ALL",sheetSubmitVals)


            //sheets.commitAnswers([["10", "10", "10"]],"Round 3 Criteria!B2:D7")

            res.json(savedTeam);

        } catch(error) {
            console.log("Blew up:", error);
            res.status(400);
            res.json(error);
        }
    }

    public routes(){
        this.router.get("/", this.GetTeams);
        this.router.get("/:team", this.GetTeam);
        this.router.post("/ratings", this.AddRatings)
        this.router.post("/", this.CreateTeam);
    }
}

export default new TeamRouter().router;