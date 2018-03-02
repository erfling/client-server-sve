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
                    .populate("Nation")
                    .then(t => t);

            var numRatings = gameTeams.filter(t => t.Ratings && (<any>t.Ratings)[(<INation>savedTeam.Nation).Name]).length;
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

                            console.log("WORD:", averagedRating);
                        }
                    });

                    TeamModel.findOneAndUpdate({Slug: t.Slug}, {MyAverageNationRating: averagedRating});

                    sheetSubmitVals[i] = [averagedRating["COMPELLING_EMOTIONAL_CONTENT"], averagedRating["DEMONSTRATED_SYSTEMIC_IMPACT"], averagedRating["STRONG_EXECUTIVE_PRESENCE"]];
                    console.log("SOME", sheetSubmitVals[i]);
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