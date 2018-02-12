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
import { Game, GameModel } from './models/Game'; 
import { Team, TeamModel } from './models/Team'; 
import { Player, PlayerModel } from './models/Player'; 

// AppServer class
export default class AppServer {
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
    // NOTE: eventTarget is a the instance listening for the event.

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

    private onTeamSocketConnect(eventTarget:SocketIO.Namespace, game:Game, socket:SocketIO.Socket):void {
        //console.log("teamSocket connected...");
        if (eventTarget.name.indexOf("1") == -1) return;
        //socket.join(eventTarget.name);
        this.io.to(eventTarget.name).emit(SocketEvents.MESSAGE, "CONNECTION SUCCESS ON SOCKET FOR GAME " + game._id);
        //console.log(socket.client);
        GameModel.find().populate("Teams").then((g:Game[]) => {
            //console.log("say hello");
            eventTarget.emit(SocketEvents.HELLO, g);
        })
        // Add socket listeners
        socket
            .on(SocketEvents.DISCONNECT, this.onSocketDisconnect.bind(this, socket))
            .on(SocketEvents.SELECT_TEAM, this.onSocketSelectTeam.bind(this, socket))
            .on(SocketEvents.SUBMIT_TO_SHEET, this.onSocketSubmitToSheet.bind(this, socket));
    }

    private onSocketDisconnect(eventTarget:SocketIO.Socket):void {
        console.log('Client disconnected:', eventTarget.id);
    }

    private onSocketSelectTeam(eventTarget:SocketIO.Socket, Slug:string):void {
        console.log("SELECTING TEAM", Slug);
        TeamModel.findOne( { Slug } ).populate("Players").then((t:ITeam) => {
            eventTarget.nsp.emit(SocketEvents.SELECT_TEAM, t);
        })
        this.sheets.GetSheetValues().then((v:any) => {
            console.log("going to send values", v);
            eventTarget.nsp.emit(SocketEvents.DASHBOARD_UPDATED, v);                            
        })
    }

    private onSocketSubmitToSheet(eventTarget:SocketIO.Socket, values:formValues):void {
        PlayerModel.findById(values.PlayerId).then((player:Player) => {
            var sheets = new GoogleSheets();
            sheets.commitAnswers(player, values).then(() => {
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
            var allowedOrigins = ['http://localhost:443', 'https://planetsapientestsite.com', 'https://planetsapientestsite.com:443'];
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
        this.app
            .use('/', router)
            .use('/sapien/api/games', GameRouter)
            .use('/sapien/api/sheets', SheetsRouter)
            .use('/sapien/api/teams', TeamRouter)
            .use('/sapien/api/player', PlayerRouter);

        //google drive verification
        this.app.get('/google8b116b0e2c1fc48f.html ', function(req, res) {
            res.sendFile('/google8b116b0e2c1fc48f.html');
        });

        //login route
        this.app.post('/sapien/api/login', (req, res) => {
           // const crypto = require("crypto");
           console.log(req.body.SelectedTeam.Slug);
           //req.body.SelectedTeam._id
            TeamModel.findOne({Slug: req.body.SelectedTeam.Slug}).then((team:Team) => {
                console.log("FOUND TEAM", team._id)
                
                var token = jwt.sign({
                    team,
                    chosenRole: req.body.SelectedRole 
                 }, 'shhhhh');
                 
                console.log(token);
                res.json({token, team, CurrentRole: req.body.SelectedRole});
            })
            

        })

        this.app.get('/login', (req, res) => {
                        // const crypto = require("crypto");
 
             PlayerModel.findOne().then((player:Player) => {
                 var token = jwt.sign({ player }, 'shhhhh');
                 res.json({test: token, player});
             })
 
         })
    }

    /**
     * Listen for socket communication
     */
    private listenForSocket(): void {
        //commence to listening
        var port = AppServer.SOCKET_PORT;
        if (this.socketServer instanceof https.Server) {
            port = AppServer.SECURE_SOCKET_PORT;
            this.io.origins('https://planetsapientestsite.com:443');
        }
        this.socketServer.listen(port, () => {
            console.log('Running server on port %s', port);
        });
        
        //TODO: solve for how we will determine desired game
        let gameId = "5a3328d0a9021e2390a77bb3";
        GameModel.findById(gameId).populate("Teams").then((game:Game) => {
            let teams:ITeam[] = game.Teams as ITeam[];
            teams.forEach((t:ITeam) => {
                //this.sheets.subscribeToDriveResource("test")
                var teamSocket = this.io.of(t.Slug);
                
                this.gameSockets.set(t.Slug, teamSocket);
                this.io.use((socket, next) => {
                    //console.log("HELLO?")
                    var handshake = socket.handshake;
                    next();
                })
                //teamSocket.use
                teamSocket.on(SocketEvents.CONNECT, this.onTeamSocketConnect.bind(this, teamSocket, game));

                // TODO: Listen for sheets watch IF we're using secure socketServer
                if (this.socketServer instanceof https.Server) {
                    this.sheets.testPost();
                }
            })           
        })
        
        if (this.socketServer instanceof https.Server) {
            this.app.post('/sapien/api/driveupdate', (req, resp) => {
                console.log("Post Request >", req.headers);
                var sheets = new GoogleSheets();
                sheets.GetSheetValues().then((v:any) => {     
                    console.log("returning:", req.body.Slug);
                    //this.io.of(req.body.Slug).emit("DRIVE_UPDATE", v);
                    this.io.of("Team1").emit(SocketEvents.DASHBOARD_UPDATED, v); // TODO: "Team1" is hard-coded because "req.body" is empty in testing. Investigate.
                    resp.json({test: "hello folks"});
                })
            })
        }
     
    }

    /**
     * Get team based on slug
     * @param Slug 
     */
    private getTeam(Slug: string): void {
        TeamModel.findOne( { Slug } ).populate("Players").then((t:ITeam) => {
            this.io.emit(SocketEvents.SELECT_TEAM, t);
        })
    }
    
}

    //export default new AppServer().app;