import { TradeOption, TradeOptionModel } from './models/TradeOption';
import { selectRole, proposeDeal } from './../../app/src/actions/Actions';
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
import {Ref} from 'typegoose';
//import routers
import GameRouter from './routers/GameRouter';
import SheetsRouter from './routers/GoogleSheetsRouter';
import TeamRouter from './routers/TeamRouter';
import PlayerRouter from './routers/PlayerRouter';

import IGame from '../../shared/models/IGame';
import ITeam from '../../shared/models/ITeam';
import IDeal from '../../shared/models/IDeal';
import ITradeOption from '../../shared/models/ITradeOption';

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
import { NationModel, Nation } from './models/Nation';
import Item from 'antd/lib/list/Item';
import INation from '../../shared/models/INation';
import { ObjectID } from 'bson';
import { Document } from 'mongoose';


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
    private socketServer: http.Server | https.Server;
    private port: string | number;
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
        
        this.config();
        this.routes();
        if (!this.socketServer) {
            // Set up non-secure socket server
            this.socketServer = http.createServer(this.app);
            this.socketServer.on('error', this.onSocketServerError.bind(this, this.socketServer))
                .on('listening', this.onSocketServerListening.bind(this, this.socketServer));
        }
        this.io = socketIo(this.socketServer);
        this.listenForSocket();
    }

    //----------------------------------------------------------------------
    //
    //  Event Handlers
    //
    //----------------------------------------------------------------------
    // NOTE: eventTarget param is a the instance listening for the event.

    private onSocketServerError(eventTarget:net.Server):void {
        let addr = eventTarget.address();
        console.log("SerVER error", this.socketServer);
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    }

    private onSocketServerListening(eventTarget:net.Server):void {
        let addr = eventTarget.address();
        console.log("socketServer listening on port " + addr.port);
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    }

    private onGameSocketConnect(eventTarget:SocketIO.Namespace, game:any, socket:SocketIO.Socket):void {
        console.log("gameSocket connected...");
        let teams:ITeam[] = (<IGame>game).Teams as ITeam[];
        teams.forEach((t:ITeam) => {
            eventTarget.to(t.Slug).emit(SocketEvents.MESSAGE, "CONNECTION SUCCESS ON SOCKET FOR GAME " + game._id + " IN ROOM " + t.Slug);
        });
        
        // Add socket listeners
        socket
            .on(SocketEvents.DISCONNECT, this.onSocketDisconnect.bind(this, socket))
            .on(SocketEvents.SELECT_TEAM, this.onSocketSelectTeam.bind(this, socket))
            .on(SocketEvents.SUBMIT_TO_SHEET, this.onSocketSubmitToSheet.bind(this, socket))
            .on(SocketEvents.UPDATE_TEAM, this.onSocketSaveTeam.bind(this, socket))
            .on(SocketEvents.JOIN_ROOM, this.onSocketJoinRoom.bind(this, socket))
            .on(SocketEvents.TO_ROOM_MESSAGE, this.onSocketRoomToRoomMessage.bind(this, socket))
            .on(SocketEvents.PROPOSE_DEAL, this.dealExchange.bind(this, socket, SocketEvents.PROPOSE_DEAL))
            .on(SocketEvents.RESPOND_TO_DEAL, this.dealExchange.bind(this, socket, SocketEvents.RESPOND_TO_DEAL));
    }

    /**
     * Handles requests from team to country to propose or respond to a trade deal
     * @param eventTarget The socket instance listening for the event
     * @param socketEvent The event type
     * @param deal The deal Object
     */
    private dealExchange(eventTarget:SocketIO.Socket, socketEvent:string, deal:IDeal):void {
        GameModel.findById(eventTarget.nsp.name.slice(1)).populate(
            {
                path:'Teams', 
                populate:{
                    path:'Nation',
                    populate: {
                        path:"TradeOptions"
                    }
                }
            }
        )
        .then((g) => {
            let teams:ITeam[] = (<IGame>g).Teams as ITeam[];
            console.log("Trying to match to team with nation " + (deal.TradeOption as TradeOption).ToNationId);
            var toTeam:ITeam = teams.filter(t => {
                console.log(t.Name, (<INation>t.Nation).Name);
                return (<INation>t.Nation).Name == (deal.TradeOption as TradeOption).ToNationId}
            )[0];
            if (toTeam) {
                console.log("FOUND TO TEAM:", toTeam.Name, socketEvent);
                deal.to = toTeam.Slug;
                eventTarget.nsp.to(toTeam.Slug).emit(socketEvent, deal); // Send proposal or response to team it's asking
                eventTarget.nsp.to(deal.from).emit(socketEvent, deal); // Send message back to sender's room to varify dealExchange was sent

                //save both teams
                if(deal.accept === true){
                    console.log("DEAL WAS ACCEPTED")
                    /*
                    TeamModel.findByIdAndUpdate(toTeam._id,{DealsProposedTo: (toTeam.DealsProposedTo as IDeal[]).push(deal)},{new: true}).populate("DealsProposedTo").then((newToTeam) => {
                        eventTarget.nsp.to(toTeam.Slug).emit(SocketEvents.PROPOSED_TO, deal); // Send proposal or response to team it's asking
                    })
                    TeamModel.findOneAndUpdate({Slug: deal.from}, {DealsProposedBy: (toTeam.DealsProposedBy as IDeal[]).push(deal)}).populate("DealsProposedBy").then((newFromTeam) => {
                        eventTarget.nsp.to(toTeam.Slug).emit(SocketEvents.PROPOSED_BY, deal); // Send proposal or response to team it's asking
                    })
                    */
                    
                }
            }
        });
    }

    private onSocketJoinRoom(eventTarget:SocketIO.Socket, roomName:string):void {
        eventTarget.join(roomName);
        console.log('Client ' + eventTarget.id + ' joined room ' + roomName);
        eventTarget.nsp.emit(SocketEvents.MESSAGE, "CONNECTION SUCCESS ON ROOM " + roomName);
        eventTarget.nsp.to(roomName).emit(SocketEvents.ROOM_MESSAGE, roomName, "ID " + eventTarget.id + " HAS JOINED ROOM " + roomName);
    }

    private onSocketRoomToRoomMessage(eventTarget:SocketIO.Socket, fromRoom:string, toRoom:string, msg:string):void {
        console.log("Client from " + fromRoom + " sent message to " + toRoom + ":", msg);
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

        //google drive verification
        this.app.get('/google8b116b0e2c1fc48f.html ', function(req, res) {
            res.sendFile('/google8b116b0e2c1fc48f.html');
        });

        this.app.get('/sapien/api/generatetradeoptions', function(req, res) {
            NationModel.find().then((nations) => {
                var options:any[] = [];
                nations.forEach( (n, i:number, nationsArray) => {
                    //every nation has the option of trading with each of the five other nations
                    
                    var nationalOptions = nations
                                            .filter(nation => n._id != nation._id)
                                            .map(nation => {
                                                return  {
                                                    ToNationId: nation.Name,
                                                    FromNationId: n.Name,
                                                    Message : "Trade with " + nation.Name
                                                }
                                            })
                    options = options.concat(nationalOptions);
                    
                } )
                return options;
            }).then((options) => {
                console.log(options);
                TradeOptionModel.insertMany(options).then((resp) => {
                    res.json(resp)
                })
            }).catch((reason) => {console.log(reason)})
            
        });


        this.app.get('/sapien/api/addtradeoptionstonations', function(req, res) {
            NationModel.find().then((nations) => {          
                return nations;
            }).then((nations) => TradeOptionModel.find().then(options => {return {options, nations}}))
            .then((thing: {nations:INation[], options: ITradeOption[]}) => {
                console.log(thing)
                thing.nations.forEach((nation) => {
                    let options = thing.options
                                        .filter(o => o.FromNationId == nation.Name)//
                                        .map(o => o._id)
                    nation.TradeOptions = options as Ref<TradeOption>[];
                })

                return thing.nations;
               
            })
            .then((nations) => {
                //NationModel.updateMany({_id: },nations).then(nations => res.json(nations))
                var promises:any = [];
                nations.forEach(n => promises.push(NationModel.findByIdAndUpdate(n._id, {TradeOptions: n.TradeOptions}, {new: true} )))
                Promise.all(promises).then(nations => res.json(nations))
            })
            .catch((reason) => {console.log(reason)})
            
        });

        //login route
        mongoose.set('debug', true);

        this.app.post('/sapien/api/changestate', (req, res) => {
            console.log(req.body._id);
            GameModel.findByIdAndUpdate(req.body._id, {State: req.body.State}, {new: true}).populate("Teams").then(( game ) => {
                console.log(game.State);
                //this.io.emit(SocketEvents.GAME_STATE_CHANGED, game.State);

                //Set our countries
                if (game.State == "2") {
                    console.log("STATE IS 2")
                    var teams:ITeam[] = game.Teams as ITeam[];
                    var promises:any[] = [];
                    var promise = NationModel.find().then((nations) => {
                        for(var i = 0; i < nations.length; i++) {
                            var update = {
                                Nation: nations[i],
                                GameState: 2
                            }
                            TeamModel.findByIdAndUpdate(teams[i]._id, update, {new: true}).populate("Nation").then((t) => {
                                console.log("Team:", t);
                                this.io.of(t.GameId).to(t.Slug).emit(SocketEvents.TEAM_UPDATED, t);
                            });        
                            promises.push(promise);
                        }

                        return nations;
                    })
                }

                res.json(game);
            })
        });

        this.app.post('/sapien/api/login', async (req, res) => {
            try {
                var game:Game & mongoose.Document = null;
                const team = await TeamModel.findOne({Slug: req.body.Slug}).populate(
                    {
                        path:"Nation",
                        populate: {
                           path:"TradeOptions"     
                        }
                    }
                );

                if (team) {
                    game = await GameModel.findById(team.GameId);

                    if (game) {
                        let gameSocketNameSpace = this.io.of(game._id);
                        gameSocketNameSpace.on(SocketEvents.CONNECT, this.onGameSocketConnect.bind(this, gameSocketNameSpace, game));
                        
                        let t:Team = team.toObject() as Team;
                        t.GameState = game.State;
                        if (this.socketServer instanceof https.Server) {
                            this.sheets.setTeamListener(t.Slug);
                        }
                        let token = jwt.sign({team: t}, 'shhhhh');
                        console.log("TEAM TO SEND", team, (<IGame>game).Teams);
                        res.json({token, team:t});
                    } else {
                        res.json("LOGIN FAILED")
                    }  
                }
            } catch {
                res.json("LOGIN FAILED")
            }

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
        this.socketServer.listen(port);
        
        //if (this.socketServer instanceof https.Server) {
            this.sheetsRouter.post('/:id', (req, resp) => {
                console.log("Post Request >", req.params, req.headers);
                var sheets = new GoogleSheets();
                sheets.GetSheetValues().then((v:any) => {     
                    console.log("returning:", req.body.Slug);
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
