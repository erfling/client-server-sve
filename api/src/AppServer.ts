import { selectRole } from './../../app/src/actions/Actions';
import { Role } from './../../shared/models/IPlayer';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import * as net from 'net';
import * as http from 'http';
import * as https from 'https';
import * as socketIo from 'socket.io';
import * as crypto from 'crypto';

//import routers
import GameRouter from './routers/GameRouter';
import SheetsRouter from './routers/GoogleSheetsRouter';
import TeamRouter from './routers/TeamRouter';
import PlayerRouter from './routers/PlayerRouter';

import IGame from '../../shared/models/IGame';
import ITeam from '../../shared/models/ITeam';
import formValues from '../../shared/models/FormValues';
import * as fs from 'fs';

//socket auth
import * as jwt from 'jsonwebtoken';
//sheets api
import  GoogleSheets  from './models/GoogleSheets';
import { resolve } from 'dns';
//helmet.contentSecurityPolicy

//socket setup
import { SocketEvents } from './../../shared/models/SocketEvents';
//models
import { GameModel, Game } from './models/Game'; 
import { Team, TeamModel } from './models/Team'; 
import { Player, PlayerModel } from './models/Player';


// AppServer class
export default class AppServer
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    public static readonly PORT:number = 4000;
    public static readonly SECURE_PORT:number = 8443;
    public static readonly SOCKET_PORT:number = 5000;
    public static readonly SECURE_SOCKET_PORT:number = 9443;

    // set app to be of type express.Application
    public app: express.Application;
    private io: SocketIO.Server;
    //private socketServer: http.Server;
    //private secureSocketServer: https.Server;
    private socketServer: http.Server | https.Server;
    private port: string | number;
    private socketNameSpaces: string[];
    private gameSockets: Map<string, SocketIO.Namespace> = new Map();
    private sheets:GoogleSheets;

    private sheetsRouter: express.Router;

    //----------------------------------------------------------------------
    //
    //  Constructor
    //
    //----------------------------------------------------------------------

    constructor() {
        this.app = express();
        this.port = process.env.PORT || AppServer.PORT;

        //TODO: have this depend on server environment var injected from start scripts
        if (fs.existsSync('/sapien/certificates/planetsapien.com/fullchain.pem')) {
            // Set up secure socket server
            console.log("found SSL key");
            var privateKey  = fs.readFileSync('/sapien/certificates/planetsapien.com/privkey.pem', 'utf8').toString();
            var certificate = fs.readFileSync('/sapien/certificates/planetsapien.com/fullchain.pem', 'utf8').toString();
            this.socketServer = https.createServer({key: privateKey, cert: certificate}, this.app);
            this.socketServer.on('error', this.onSocketServerError.bind(this, this.socketServer))
                .on('listening', this.onSocketServerListening.bind(this, this.socketServer));
        }
        
        //socket setup
        //const io = socketIo(app); // < Interesting!
        
        this.config();
        this.routes();
        if (!this.socketServer) {
            // Set up non-secure socket server
            this.socketServer = http.createServer(this.app);
            this.socketServer.on('error', this.onSocketServerError.bind(this, this.socketServer))
                .on('listening', this.onSocketServerListening.bind(this, this.socketServer)); 
            this.io = socketIo(this.socketServer);
        }
        this.io = socketIo(this.socketServer);
        this.listenForSocket();
        //this.sheets.subscribeToDriveResource("1e9g8X4XIABJtPDPFlMdsTQhk9jOHwQSGunjXaWvz4uU");
    }

    //----------------------------------------------------------------------
    //
    //  Event Handlers
    //
    //----------------------------------------------------------------------
    // NOTE: eventTarget param is a the instance listening for the event.

    private onSocketServerError(eventTarget:net.Server):void {
        console.log("SerVER error", this.socketServer);
        let addr = eventTarget.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    }

    private onSocketServerListening(eventTarget:net.Server):void {
        console.log("socketServer listening...");
        let addr = eventTarget.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    }

    private onTeamSocketConnect(eventTarget:SocketIO.Namespace, game:any, socket:SocketIO.Socket):void {
        console.log("teamSocket connected...");
        if (eventTarget.name.indexOf("1") == -1) return;
        socket.join(eventTarget.name);
        this.io.to(eventTarget.name).emit(SocketEvents.MESSAGE, "CONNECTION SUCCESS ON SOCKET FOR GAME " + game._id);
        //console.log(socket.client);
        GameModel.find().populate("Teams").then((g) => {
            //console.log("say hello");
            eventTarget.emit(SocketEvents.HELLO, g);
        })
        // Add socket listeners
        socket
            .on(SocketEvents.DISCONNECT, this.onSocketDisconnect.bind(this, socket))
            .on(SocketEvents.SELECT_TEAM, this.onSocketSelectTeam.bind(this, socket))
            .on(SocketEvents.SUBMIT_TO_SHEET, this.onSocketSubmitToSheet.bind(this, socket))
            .on(SocketEvents.UPDATE_TEAM, this.onSocketSaveTeam.bind(this, socket));
    }

    private onSocketDisconnect(eventTarget:SocketIO.Socket):void {
        console.log('Client disconnected:', eventTarget.id);
    }

    private onSocketSelectTeam(eventTarget:SocketIO.Socket, Slug:string):void {
        console.log("SELECTING TEAM", Slug);
        TeamModel.findOne( { Slug } ).populate("Players").then((t:Team) => {
            eventTarget.nsp.emit(SocketEvents.SELECT_TEAM, t);
        })
        this.sheets.GetSheetValues().then((v:any) => {
            console.log("going to send values", v);
            eventTarget.nsp.emit(SocketEvents.DASHBOARD_UPDATED, v);                            
        })
    }

    private onSocketSubmitToSheet(eventTarget:SocketIO.Socket, values:formValues):void {
        TeamModel.findById(values.PlayerId).then((team:Team) => {
            var sheets = new GoogleSheets();
            sheets.commitAnswers(team, values).then(() => {
                if (this.socketServer instanceof http.Server) {
                    setTimeout(() => {
                        sheets.GetSheetValues().then((v:any) => {     
                            eventTarget.nsp.emit(SocketEvents.DASHBOARD_UPDATED, v);                            
                        })
                    }, 500);
                }
            })                    
        })
    }

    private onSocketSaveTeam(eventTarget:SocketIO.Socket, values:any):void{
        console.log("MESSAGE FROM CLIENT", eventTarget.nsp.name, values);
        TeamModel.findOneAndUpdate({Slug: eventTarget.nsp.name.replace('/', '')}, { values }, { new: true }).then((team) => {
            console.log(team);
            eventTarget.nsp.emit(SocketEvents.TEAM_UPDATED, team);
        })
    }

    //----------------------------------------------------------------------
    //
    //  Methods
    //
    //----------------------------------------------------------------------
    
    /**
     * Application config
     */
    public config(): void {
        const MONGO_URI: string = 'mongodb://localhost/express-boilerplate';
        mongoose.connect(MONGO_URI || process.env.MONGODB_URI);

        // express middleware
        this.app.use(bodyParser.urlencoded({ extended: true }))
            .use(bodyParser.json())
            .use(logger('dev'))
            .use(compression())
            .use(helmet());

        //global connection object for Google Sheets API
        this.sheets = new GoogleSheets();

        // cors
        this.app.use((req, res, next) => {
            var allowedOrigins = ['http://localhost:443', 'https://planetsapientestsite.com', 'https://planetsapientestsite.com:443', 'https://planetsapien.com', 'https://planetsapien.com:443'];
            var origin = req.headers.origin;

            if (allowedOrigins.indexOf(origin as string) > -1) {
                console.log("header approved");
                res.setHeader('Access-Control-Allow-Origin', origin);
            } else {
                console.log("rejecting header");
            }

            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                .header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
                .header('Access-Control-Allow-Credentials', 'false');
            next();
        });
        this.app.use(cors());
    }
    
    /**
     * Build application routes
     */
    public routes(): void {
        const router: express.Router = express.Router();
        this.sheetsRouter = express.Router();

        this.app
            .use('/', router)
            .use('/sapien/api/driveupdate', this.sheetsRouter)
            .use('/sapien/api/games', GameRouter)
            .use('/sapien/api/sheets', SheetsRouter)
            .use('/sapien/api/teams', TeamRouter)
            .use('/sapien/api/player', PlayerRouter)
            .post('sapien/api/changestate', 
                (req, res) => {
                    GameModel.findOneAndUpdate({_id: req.body._id}, {State: req.body.state}, {new: true}, (game) => {
                        this.io.emit(SocketEvents.GAME_STATE_CHANGED, game.State);
                    })
                });

        //google drive verification
        this.app.get('/google8b116b0e2c1fc48f.html ', function(req, res) {
            res.sendFile('/google8b116b0e2c1fc48f.html');
        });

        //login route
        mongoose.set('debug', true);

        this.app.post('/sapien/api/login', (req, res) => {
           // const crypto = require("crypto");
           console.log("searching for team with ID:",TeamModel);
           //req.body.SelectedTeam._id\
            TeamModel.findOne({Slug: req.body.Slug}).then((team) => {

                var token = jwt.sign({
                    team: team
                 }, 'shhhhh');
                console.log("TEAM TO SEND", team);
                res.json({token, team:team});
            })
            

        });

        this.app.get('/login', (req, res) => {
             // const crypto = require("crypto");
             PlayerModel.findOne().then((player:Player) => {
                 var token = jwt.sign({ player }, 'shhhhh');
                 res.json({test: token, player});
             })
         });
    }


    /**
     * Listen for socket communication
     */
    private listenForSocket(): void {
        //commence to listening
        var port = AppServer.SOCKET_PORT;
        if (this.socketServer instanceof https.Server) {
            port = AppServer.SECURE_SOCKET_PORT;
            this.io.origins('https://planetsapien.com:443');
        }
        this.socketServer.listen(port, () => {
            console.log('Running server on port %s', port);
        });
        
        //TODO: solve for how we will determine desired game
        let gameId = "5a3328d0a9021e2390a77bb3";
        GameModel.findOne({Slug: "Game2"}).populate("Teams").then((game) => {
            let gameDoc: IGame = game as IGame;
            let teams:ITeam[] = gameDoc.Teams as ITeam[];
            teams.forEach((t:ITeam) => {
                //this.sheets.subscribeToDriveResource("test")
                var teamSocket = this.io.of(t.Slug);
                
                this.gameSockets.set(t.Slug, teamSocket);
          
                teamSocket.on(SocketEvents.CONNECT, this.onTeamSocketConnect.bind(this, teamSocket, game));

                // TODO: Listen for sheets watch IF we're using secure socketServer
                if (this.socketServer instanceof https.Server) {
                    this.sheets.setTeamListener(t.Slug);
                }
            })           
        })
        
        //if (this.socketServer instanceof https.Server) {
            this.sheetsRouter.post('/:id', (req, resp) => {
                console.log("Post Request >", req.params, req.headers);
                var sheets = new GoogleSheets();
                sheets.GetSheetValues().then((v:any) => {     
                    console.log("returning:", req.body.Slug);
                    //this.io.of(req.body.Slug).emit("DRIVE_UPDATE", v);
                    this.io.of(req.params.id).emit(SocketEvents.DASHBOARD_UPDATED, v); // TODO: "Team1" is hard-coded because "req.body" is empty in testing. Investigate.
                    resp.json({test: "hello folks"});
                })
            })
        //}
    }

    /**
     * Get team based on slug
     * @param Slug 
     */
    private getTeam(Slug: string): void {
        TeamModel.findOne( { Slug } ).populate("Players").then((t:Team) => {
            this.io.emit(SocketEvents.SELECT_TEAM, t);
        })
    }
    
}

    //export default new AppServer().app;