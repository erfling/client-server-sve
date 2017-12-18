import { Router, Request, Response, NextFunction } from 'express';
import { Game, GameModel } from '../models/Game'; 
import { Error } from 'mongoose';
import TeamRouter  from './TeamRouter';

class GameRouter{
    router: Router;
    GameModel: any;
    
    constructor(){
        this.router = Router({mergeParams:true});
        this.routes();
    }

    public async GetGames(req: Request, res: Response):Promise<Game[] | any> {
        console.log("GET GAMES CALLED")    
        
        try {
            console.log("trying")
            let games = await GameModel.find();
            console.log("GAMES", games, Game)
            if (!games) {
                res.status(400).json({ error: 'No games' });
            } else {
                const status = res.status;
                res.json( games );
            }
        } catch(err) {
            console.log("ERROR", err);
            ( err: any ) => res.status(500).json({ error: err })
        }
        
      
    }

    public async GetGame(req: Request, res: Response):Promise<any> {
        const Slug = req.params.game;
        console.log(Slug);
        try {
            let game = await GameModel.findOne({Slug}).populate('Teams');
        
            if (!game) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(game);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err })
        }
    }

    public async CreateGame(req: Request, res: Response):Promise<any> {
        const game = new Game(req.body);         
        const g = new GameModel(game);
        
        try {
            await g.save();
            const savedGame = await GameModel.findOne({Slug: game.Slug});
            if (!savedGame) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(savedGame);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err })
        }
    }

    public async UpdateGame(req: Request, res: Response):Promise<Game | any> {
        const Slug = req.params.game;
        const game = new Game(req.body); 
        console.log(game);        
        try {
            let savedGame = await GameModel.findOneAndUpdate({ Slug }, game).populate('Teams');
        
            if (!savedGame) {
              res.status(400).json({ error: 'No games' });
            } else {
              res.json(savedGame);
            }
        } catch(err) {
            ( err: any ) => res.status(500).json({ error: err })
        }
    
    }

    public routes(){
        this.router.get("/", this.GetGames)
        this.router.get("/:game", this.GetGame)
        this.router.post("/", this.CreateGame);
        this.router.put("/:game", this.UpdateGame);
        this.router.use("/:game/teams", TeamRouter)
    }
}

const gameRoutes = new GameRouter();

export default gameRoutes.router;