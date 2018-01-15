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
        
        this.socketServer.listen(Server.SOCKET_PORT, () => {
            console.log('Running server on port %s', Server.SOCKET_PORT);
        });

        this.io.on(SocketEvents.CONNECT, (socket: any) => {


            /**
             * google sheets event loop watching scoreboard tab
             */
            var sheets = new GoogleSheets();
            sheets.GetSheetValues().then((v:any)=>{
                socket.emit(SocketEvents.DASHBOARD_UPDATED,v);                            
            })

            console.log('Connected client on port %s.', Server.SOCKET_PORT);
            GameModel.find().populate("Teams").then((g:Game[])=>{
                this.io.emit(SocketEvents.HELLO, g);
                //setTimeout(() => this.io.emit("HELLO",g), 1000)
            })
            

            socket.on(SocketEvents.DISCONNECT, () => {
                console.log('Client disconnected');
            });

            socket.on(SocketEvents.SELECT_TEAM, (Slug:string) => {
                TeamModel.findOne( { Slug } ).populate("Players").then((t:ITeam) => {
                    this.io.emit(SocketEvents.SELECT_TEAM, t);
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
                                socket.emit(SocketEvents.DASHBOARD_UPDATED,v);                            
                            })
                        },1000)
                    })
                    /*
                     */
                    
                    
                })                
            })

            
        });
        
    }
}
    
    // export
    //export default new Server().app;