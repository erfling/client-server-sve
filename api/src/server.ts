import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
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

import { Game, GameModel } from './models/Game'; 
import { Team, TeamModel } from './models/Team'; 
import { Player, PlayerModel } from './models/Player'; 

//Server class
export default class Server {
    public static readonly PORT:number = 4000;
    public static readonly SECURE_PORT:number = 8443;
    public static readonly SOCKET_PORT:number = 5000;
    public static readonly SECURE_SOCKET_PORT:number = 9443;

    // set app to be of type express.Application
    public app: express.Application;
    private io: SocketIO.Server;
    private socketServer: http.Server;
    private secureSocketServer: https.Server;
    private port: string | number;
    private socketNameSpaces: string[];
    private gameSockets: Map<string, SocketIO.Namespace> = new Map();
    private sheets:GoogleSheets;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || Server.PORT;


        if(fs.existsSync('/sapien/certificates/privkey.pem')){
            const onSecureListening = (): void => {
                let addr =  this.secureSocketServer.address();
                let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
            }
            console.log("found SSL key")
            var privateKey  = fs.readFileSync('/sapien/certificates/privkey.pem', 'utf8').toString();
            var certificate = fs.readFileSync('/sapien/certificates/fullchain.pem', 'utf8').toString();
            var credentials = {key: privateKey, cert: certificate};
            this.secureSocketServer = https.createServer(credentials, this.app);
            this.secureSocketServer.on('error', onError);
            this.secureSocketServer.on('listening', onSecureListening);
            console.log("HTTPS SERVER",  this.secureSocketServer.address());
            

            function onError(): void {
                let addr =  this.secureSocketServer.address();
                let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
              }
        }

        //socket setup
        //const io = socketIo(app); // < Interesting!
        
        this.config();
        this.routes();
        if(!this.secureSocketServer){
            this.socketServer = http.createServer(this.app);        
            this.io = socketIo(this.socketServer);
        }else{
            this.io = socketIo(this.secureSocketServer);
        }
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

        //global connection object for Google Sheets API
        this.sheets = new GoogleSheets();

        // cors
        this.app.use((req, res, next) => {

            var allowedOrigins = ['http://localhost:443', 'https://planetsapientestsite.com'];
            var origin = req.headers.origin;

            console.log("ORIGIN IS: ",req.headers.origin);

            if(allowedOrigins.indexOf(origin as string) > -1){
                console.log("header approved")
                res.setHeader('Access-Control-Allow-Origin', origin);
            }else{
                console.log("rejecting header")
            }

            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Credentials', 'false');
            next();
        });
        this.app.use(cors());

    
    }
    
    // application routes
    public routes(): void {
        const router: express.Router = express.Router();    
        this.app.use('/', router);
        this.app.use('/sapien/api/games', GameRouter);
        this.app.use('/sapien/api/sheets', SheetsRouter);
        this.app.use('/sapien/api/teams', TeamRouter);
        this.app.use('/sapien/api/player', PlayerRouter);


        //google drive verification
        this.app.get('/google8b116b0e2c1fc48f.html ', function(req, res) {
            res.sendFile('/google8b116b0e2c1fc48f.html');
        });

        //login route
        this.app.post('/login', (req, res) =>{
           // const crypto = require("crypto");
           /*
            const secret = 'yallberealqueitnow';
            const hash = crypto.createHmac('sha256', secret)
                            .update('I love cupcakes')
                            .digest('hex');
            console.log(hash);
            */

            PlayerModel.findOne().then((player:Player)=>{
                var token = jwt.sign({ player }, 'shhhhh');
                res.json({test: token, player});
            })


        })
    }

    private listenForSocket(): void {
        
        //commence to listening
        if(this.socketServer){
            this.socketServer.listen(Server.SOCKET_PORT, () => {
                console.log('Running server on port %s', Server.SOCKET_PORT);
            });
        }

        if(this.secureSocketServer){
            this.io.origins('https://planetsapientestsite.com:443');
            this.secureSocketServer.listen(Server.SECURE_SOCKET_PORT, () => {
                console.log('Running server on port %s', Server.SECURE_SOCKET_PORT);
            });
        }

        //TODO: solve for how we will determine desired game
        let gameId = "5a3328d0a9021e2390a77bb3";
        GameModel.findById(gameId).populate("Teams").then((game:Game) => {
            console.log("found game");
            //this.io.of(SocketEvents.)
            let teams:ITeam[] = game.Teams as ITeam[];
            teams.forEach((t:ITeam) => {

                //if(!this.gameSockets.has(t.Slug)){
                var teamSocket = this.io.of(t.Slug);
                
                this.gameSockets.set(t.Slug, teamSocket);
                this.io.of(t.Slug).use((socket, next) => {
                    var handshake = socket.handshake;
                    console.log(handshake);
                    next();
                })
                this.io.of(t.Slug).on(SocketEvents.CONNECT, (socket) => {
                    if(t.Slug.indexOf("1") == -1) return;
                    //socket.join(t.Slug);
                    //console.log("CONNECTION SUCCESS ON SOCKET FOR GAME " + t.Slug, this.io.of(t.Slug).clients((c:any) => console.log(c)));
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
                                        console.log("returning");                      
                                        this.io.of(t.Slug).emit(SocketEvents.DASHBOARD_UPDATED,v);                            
                                    })
                                },500)
                            })                    
                        })                
                    })
                      
                })
                
            })           
        })
    
        this.app.post('/sapien/api/driveupdate', (req, resp) => {
            var sheets = new GoogleSheets();
            sheets.GetSheetValues().then((v:any)=>{     
                console.log("returning");                      
                this.io.of(req.body.Slug).emit("DRIVE_UPDATE",v);      
                resp.json({test: "hello"})                      
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