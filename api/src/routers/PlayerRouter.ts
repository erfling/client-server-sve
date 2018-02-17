import { Player, PlayerModel } from './../models/Player';
import { Router, Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';


class PlayerRouter
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    public router: Router;
    public PlayerModel: any;
    
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
    
    public async GetPlayers(req: Request, res: Response):Promise<Player[] | any> {
        console.log("GET players CALLED")
    
        console.log("players REQ:", req.params)
        try {
            console.log("trying")
            let players = await PlayerModel.find();
            console.log("GAMES", players, Player)
            if (!players) {
                res.status(400).json({ error: 'No games' });
            } else {
                const status = res.status;
                res.json( players );
            }
        } catch(err) {
            console.log("ERROR", err);
            ( err: any ) => res.status(500).json({ error: err })
        }       
      
    }

    public async GetPlayer(req: Request, res: Response):Promise<any> {
        console.log("players REQ:", req.params)
        
        const Slug = req.params.team;
        
        try {
            let game = await PlayerModel.findOne(Object.assign({Slug}));
        
            if (!game) {
                res.status(400).json({ error: 'No games' });
            } else {
                res.json(game);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err })
        }
    }

    public async CreatePlayer(req: Request, res: Response):Promise<any> {
        console.log("CREATING TEAM", req.body);
        const team = new Player(req.body);  
        console.log( team);
        const t = new PlayerModel(team);
        
        try {
            await t.save();
            const savedGame = await PlayerModel.findOne({Slug: team.Slug});
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
        this.router.get("/", this.GetPlayers);
        console.log("yes");
        this.router.get("/:team", this.GetPlayer);
        this.router.post("/", this.CreatePlayer);
    }
}

export default new PlayerRouter().router;