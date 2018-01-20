import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import * as http from 'http';
import * as socketIo from 'socket.io';

//import routers
import GameRouter from './routers/GameRouter';
import SheetsRouter from './routers/GoogleSheetsRouter';
import TeamRouter from './routers/TeamRouter';
import PlayerRouter from './routers/PlayerRouter';
import IGame from '../../shared/models/IGame';
import ITeam from '../../shared/models/ITeam';
import formValues from '../../shared/models/FormValues';

//sheets api
import  GoogleSheets  from './models/GoogleSheets'; 
import { resolve } from 'dns';


//socket setup
import { SocketEvents } from './../../shared/models/SocketEvents';

import { Game, GameModel } from './models/Game'; 
import { Team, TeamModel } from './models/Team'; 
import { Player, PlayerModel } from './models/Player'; 

//Server class
export default class Server {
    public static readonly PORT:number = 4000;
    public static readonly SOCKET_PORT:number = 5000;

    // set app to be of type express.Application
    public app: express.Application;
    private io: SocketIO.Server;
    private socketServer: http.Server;
    private port: string | number;
    private socketNameSpaces: string[];
    private gameSockets: Map<string, SocketIO.Namespace> = new Map();
    private sheets:GoogleSheets;

    constructor() {
    this.app = express();
    this.port = process.env.PORT || Server.PORT;

    //socket setup
    //const io = socketIo(app); // < Interesting!
    
    this.config();
    this.routes();
    this.socketServer = http.createServer(this.app);
    this.io = socketIo(this.socketServer);
    this.listenForSocket();
    }
    
    // application config
    public config(): void {

        const MONGO_URI: string = 'mongodb://localhost/express-boilerplate'; 
        mongoose.connect(MONGO_URI || process.env.MONGODB_URI);

        // express middleware
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(cors());

        //global connection object for Google Sheets API
        this.sheets = new GoogleSheets();

        // cors
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    
    }
    
    // application routes
    public routes(): void {
        const router: express.Router = express.Router();    
        this.app.use('/', router);
        this.app.use('/sapien/api/games', GameRouter);
        this.app.use('/sapien/api/sheets', SheetsRouter);
        this.app.use('/sapien/api/teams', TeamRouter);
        this.app.use('/sapien/api/player', PlayerRouter);
    }

    private listenForSocket(): void {
        
        //commence to listening
        this.socketServer.listen(Server.SOCKET_PORT, () => {
            console.log('Running server on port %s', Server.SOCKET_PORT);
        });

        //TODO: solve for how we will determine desired game
        let gameId = "5a3328d0a9021e2390a77bb3";
        GameModel.findById(gameId).populate("Teams").then((game:Game) => {
            //this.io.of(SocketEvents.)
            let teams:ITeam[] = game.Teams as ITeam[];
            teams.forEach((t:ITeam) => {

                //if(!this.gameSockets.has(t.Slug)){
                    var teamSocket = this.io.of(t.Slug);
                    
                    this.gameSockets.set(t.Slug, teamSocket);
                    this.io.of(t.Slug).on(SocketEvents.CONNECT, (socket) => {
                        socket.join(t.Slug);
                        console.log("CONNECTION SUCCESS ON SOCKET FOR GAME " + gameId);
                        this.io.to(t.Slug).emit(SocketEvents.MESSAGE, "CONNECTION SUCCESS ON SOCKET FOR GAME " + gameId);
                        //console.log(socket.client)
                        GameModel.find().populate("Teams").then((g:Game[])=>{
                            console.log("say hello")
                            this.io.of(t.Slug).emit(SocketEvents.HELLO, g);
                        })                       
        
                        socket.on(SocketEvents.DISCONNECT, () => {
                            console.log('Client disconnected');
                        });                        
    
                        socket.on(SocketEvents.SELECT_TEAM, (Slug:string) => {
                            console.log("SELECTING TEAM", Slug);
                            TeamModel.findOne( { Slug } ).populate("Players").then((t:ITeam) => {
                                this.io.of(t.Slug).emit(SocketEvents.SELECT_TEAM, t);
                            })
                            this.sheets.GetSheetValues().then((v:any)=>{
                                console.log("going to send values", v);
                                this.io.of(t.Slug).emit(SocketEvents.DASHBOARD_UPDATED,v);                            
                            })
                        })
        
                        
                        socket.on(SocketEvents.SUBMIT_TO_SHEET, (values:formValues) => { 
                            console.log("submitted");
                            PlayerModel.findById(values.PlayerId).then((player:Player)=>{
                                console.log(values);
                                var sheets = new GoogleSheets();
                                sheets.commitAnswers(player, values)
                                .then(() => {
                                    console.log("THENNED");
                                    setTimeout(() => {
                                        sheets.GetSheetValues().then((v:any)=>{                                            
                                            this.io.of(t.Slug).emit(SocketEvents.DASHBOARD_UPDATED,v);                            
                                        })
                                    },500)
                                })                    
                            })                
                        })
                       

                    })

                    
                    
                


                



            })


            
        })
    
    }

    private getTeam(Slug: string): void{
        TeamModel.findOne( { Slug } ).populate("Players").then((t:ITeam) => {
            this.io.emit(SocketEvents.SELECT_TEAM, t);
        })
    }
}
    
    // export
    //export default new Server().app;