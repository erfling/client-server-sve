import { DealModel, Deal } from './models/Deal';
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
        this.config();

        //TODO: have this depend on server environment var injected from start scripts
        if (fs.existsSync('/sapien/certificates/planetsapien.com/fullchain.pem')) {
            // Set up secure socket server
            console.log("found SSL key FOR SOCKET SERVER");
            var privateKey  = fs.readFileSync('/sapien/certificates/planetsapien.com/privkey.pem', 'utf8').toString();
            var certificate = fs.readFileSync('/sapien/certificates/planetsapien.com/fullchain.pem', 'utf8').toString();
            this.socketServer = https.createServer({key: privateKey, cert: certificate}, this.app);
            this.socketServer.on('error', this.onSocketServerError.bind(this, this.socketServer))
                .on('listening', this.onSocketServerListening.bind(this, this.socketServer));
        }
        
        this.routes();
        if (!this.socketServer) {
            console.log("SOCKET SERVER IS INSECURE")
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
            .removeAllListeners()         
            .on(SocketEvents.DISCONNECT, this.onSocketDisconnect.bind(this, socket))
            .on(SocketEvents.SELECT_TEAM, this.onSocketSelectTeam.bind(this, socket))
            .on(SocketEvents.SUBMIT_TO_SHEET, this.onSocketSubmitToSheet.bind(this, socket))
            .on(SocketEvents.UPDATE_TEAM, this.onSocketSaveTeam.bind(this, socket))
            .on(SocketEvents.JOIN_ROOM, this.onSocketJoinRoom.bind(this, socket))
            .on(SocketEvents.TO_ROOM_MESSAGE, this.onSocketRoomToRoomMessage.bind(this, socket))
            .on(SocketEvents.PROPOSE_DEAL, this.dealExchange.bind(this, socket, SocketEvents.PROPOSE_DEAL))
            .on(SocketEvents.RESPOND_TO_DEAL, this.dealExchange.bind(this, socket, SocketEvents.RESPOND_TO_DEAL))
            .on(SocketEvents.FORWARD_DEAL, this.forwardDeal.bind(this, socket, SocketEvents.FORWARD_DEAL))
            
    }

    /**
     * Handles requests from team to country to propose or respond to a trade deal
     * @param eventTarget The socket instance listening for the event
     * @param socketEvent The event type
     * @param deal The deal Object
     */
    private async dealExchange(eventTarget:SocketIO.Socket, socketEvent:string, deal:IDeal):Promise<any> {
        var dealPromise;

        const teamPopulateRules =  [
            {
                path: "Nation"
            },
            {
                path:"DealsProposedTo",
                populate: {
                    path:"TradeOption"
                }                            
            },
            {
                path:"DealsProposedBy",
                populate: {
                    path:"TradeOption"
                }                            
            }
        ];

        var promises:Promise<any>[] = [];
        let newDeal = Object.assign({}, deal, {TradeOption: (deal.TradeOption as ITradeOption)._id})

        if (deal._id) {
            dealPromise = DealModel.findByIdAndUpdate(deal._id, deal, {new: true}).populate("TradeOption").then(d => d)
        } else{
            dealPromise = DealModel.create(newDeal).then(newDeal => DealModel.findById(newDeal._id).populate("TradeOption").then(d => d))               
        }
        
        var gamePromise = GameModel.findById(eventTarget.nsp.name.slice(1)).populate(
                {path:'Teams',
                    populate:[
                        {path:'Nation',
                            populate: {
                                path:"TradeOptions"
                            }
                        },
                        {path:"DealsProposedBy"},
                        {path:"DealsProposedTo"}
                    ]
                }
        )

        return Promise.all([gamePromise, dealPromise])
        .then(async (gameAndDeal) => {
            let g = gameAndDeal[0];
            let deal = gameAndDeal[1];
            let teams:ITeam[] = (<IGame>g).Teams as ITeam[];

            console.log("...Trying to match to team with nation " + (deal.TradeOption as TradeOption).ToNationId);
            var toTeam:ITeam = teams.filter(t => {
                return (<INation>t.Nation).Name == (deal.TradeOption as TradeOption).ToNationId}
            )[0];
            var fromTeam:ITeam = teams.filter(t => {
                return (<INation>t.Nation).Name == (deal.TradeOption as TradeOption).FromNationId}
            )[0];

            if (toTeam && fromTeam) {
                deal.ToTeamSlug = toTeam.Slug;
                
                function saveTeamDeal(isAccepted:boolean, isTo:boolean = true) {
                    let dealsProposedToOrBy = isTo ? toTeam.DealsProposedTo : fromTeam.DealsProposedBy;
                    let dealsProposed = (dealsProposedToOrBy as IDeal[] || [])
                        .filter(d => !deal._id.equals(d._id)); // document._id.equals is a mongoose method to compare a document's _id against a string, since doc's _id isn't technically a string and == won't cut it.
                    if (isAccepted) dealsProposed = dealsProposed.concat(deal);
                    dealsProposed = dealsProposed.map(d => Object.assign(d, {TradeOption: (d.TradeOption as ITradeOption)._id || d.TradeOption }));
                    console.log(isTo ? "TO DEALS:" : "FROM DEALS:", dealsProposed);

                    let dealsProposedUpdate = isTo ? {DealsProposedTo: dealsProposed} : {DealsProposedBy: dealsProposed};
                    TeamModel.findByIdAndUpdate(isTo ? toTeam._id : fromTeam._id, dealsProposedUpdate, {new: true}).populate(
                        [
                            {path:"DealsProposedTo", populate: {path:"TradeOption"}},
                            {path:"DealsProposedBy", populate: {path:"TradeOption"}}
                        ]
                    ).then((newTeam) => {
                        eventTarget.nsp.to(isTo ? deal.ToTeamSlug : deal.FromTeamSlug).emit(socketEvent, newTeam); // Send proposal or response to team it's asking
                    }).catch(e => {throw(e)})

                    if (isTo) saveTeamDeal(isAccepted, false); // Run again to save fromTeam

                    
                }

                if (deal.Accept == true || deal.Accept == false) {
                    saveTeamDeal(deal.Accept); // save both toTeam and fromTeam
                    // potentially remove deal, if it was previously accepted
                } else {
                    console.log("PROPOSED DEAL:", deal);
                    // notify teams about proposal (which has yet to be accepted or rejected)
                    eventTarget.nsp.to(deal.ToTeamSlug).emit(socketEvent, deal); // Send proposal or response to team it's asking
                    eventTarget.nsp.to(deal.FromTeamSlug).emit(socketEvent, deal); // Send message back to sender's room to varify dealExchange was sent
                }


                //update the SpreadSheet
                const game = await GameModel.findById(g._id).populate(
                    [
                        {
                            path: "Teams",
                            populate: teamPopulateRules
                        }
                    ]
                )
                if(game){
                    const sheets = new GoogleSheets();
                    const sheetsResponse = await sheets.submitTradeDealValues(game.Teams as ITeam[])
                    console.log(sheetsResponse);

                    //emit the values to all the teams
                    setTimeout(() => {
                        sheets.GetSheetValues("1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg", "Country Impact!Y3:Y103").then((r:any) => {
                            eventTarget.nsp.emit(SocketEvents.DASHBOARD_UPDATED, r);
                        })
                    },10)
                    
                }

            } else {
                console.log("OOPS: No team found with nation " + (<TradeOption>deal.TradeOption).ToNationId);
            }



        });
    }

    private async forwardDeal(eventTarget: SocketIO.Socket, socketEvent:string, deal:IDeal){

        const teamPopulateRules =  [
            {
                path: "Nation"
            },
            {
                path:"DealsProposedTo",
                populate: {
                    path:"TradeOption"
                }                            
            },
            {
                path:"DealsProposedBy",
                populate: {
                    path:"TradeOption"
                }                            
            }];

        
        const transferringTeam = await TeamModel.findOne({Slug: deal.TransferFromTeamSlug})
                                                    .populate(teamPopulateRules)
                                                    .then(t => t)
        
        console.log("TEAM INITIATING TRANSER", transferringTeam);
        //first get the team we're transferring to, so we can set the deal's prop
        const destinationTeam = await NationModel.findOne({Name: deal.TransferToNationName})
                                                    .then(n => {
                                                        return TeamModel.findOne({
                                                            Nation: n,
                                                            GameId: transferringTeam.GameId
                                                        })
                                                        .populate(teamPopulateRules)
                                                        .then(t => t)
                                                    })
        

        if(destinationTeam && transferringTeam){     
                    
            deal.TransferToNationName = (<INation>destinationTeam.Nation).Name;
            deal.TransferToTeamSlug = destinationTeam.Slug;
            const nudeEel = await DealModel.findByIdAndUpdate(deal._id, deal, {new: true})

            //Deal has been accepted 
            if(deal.TransferAccepted === true){
                console.log("DEAL WAS ACCEPTED")

                destinationTeam.DealsProposedTo = (destinationTeam.DealsProposedTo as IDeal[])            
                                                    .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))
                                                    .map(d => d._id)
                                                    .concat([nudeEel._id])


                //remove the transferred deal from the transferring team's DealsProposedBy
                transferringTeam.DealsProposedTo = (transferringTeam.DealsProposedTo as IDeal[])            
                                                        .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))

                

                //if(transferringTeam.DealsProposedTo.length)transferringTeam.DealsProposedTo = transferringTeam.DealsProposedTo.map(d => d._id)

                //add the transferred deal to the transferring team's DealsProposedBy
                transferringTeam.DealsProposedBy = (destinationTeam.DealsProposedBy as IDeal[])            
                                                        .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))
                                                        .map(d => d._id)
                                                        .concat([nudeEel._id])


                //when a deal is accepted, the original team that first proposed it can no longer cancel it, so we update it for them, too
                const originatingTeam = await TeamModel.findOne({Slug: deal.FromTeamSlug}).populate(teamPopulateRules).then(t => t);
                originatingTeam.DealsProposedBy = (originatingTeam.DealsProposedBy as IDeal[])
                                                                                        .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))
                                                                                        .map(d => d._id)
                                                                                        .concat([nudeEel._id])
                                

                const updatedDestinationTeam  = await TeamModel.findOneAndUpdate({Slug: destinationTeam.Slug},  destinationTeam,  {new: true}).populate(teamPopulateRules).then(t => t);
                const updatedTransferringTeam = await TeamModel.findOneAndUpdate({Slug: transferringTeam.Slug}, transferringTeam, {new: true}).populate(teamPopulateRules).then(t => t);
                const updatedOriginatingTeam  = await TeamModel.findOneAndUpdate({Slug: originatingTeam.Slug},  originatingTeam,  {new: true}).populate(teamPopulateRules).then(t => t);

                if(updatedDestinationTeam && updatedTransferringTeam && updatedOriginatingTeam){
                    eventTarget.nsp.to(deal.TransferToTeamSlug).emit(SocketEvents.RESPOND_TO_DEAL, updatedDestinationTeam); // Send proposal or response to team it's asking
                    eventTarget.nsp.to(deal.TransferFromTeamSlug).emit(SocketEvents.RESPOND_TO_DEAL, updatedTransferringTeam); // Send proposal or response to team it's asking
                    eventTarget.nsp.to(deal.FromTeamSlug).emit(SocketEvents.RESPOND_TO_DEAL, updatedOriginatingTeam); // Send proposal or response to team it's asking


                    //update the SpreadSheet
                    const game = await GameModel.findById(updatedDestinationTeam.GameId).populate(
                        [
                            {
                                path: "Teams",
                                populate: teamPopulateRules
                            }
                        ]
                    )
                    if(game){
                        const sheets = new GoogleSheets();
                        const sheetsResponse = await sheets.submitTradeDealValues(game.Teams as ITeam[])
                        console.log(sheetsResponse);
                        //emit the values to all the teams
                        setTimeout(() => {
                            sheets.GetSheetValues("1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg", "Country Impact!Y3:Y103").then((r:any) => {
                                eventTarget.nsp.emit(SocketEvents.DASHBOARD_UPDATED, r);
                            })
                        },10)
                        
                    }

                }
            }
            //Deal has been rejected
            else if(deal.TransferAccepted === false){


                deal.TransferToNationName = deal.TransferFromNationName = deal.TransferToTeamSlug = deal.TransferFromTeamSlug = null;
                const nudeEel = await DealModel.findByIdAndUpdate(deal._id, deal, {new: true});

                destinationTeam.DealsProposedTo = (destinationTeam.DealsProposedTo as IDeal[])            
                                                    .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))
                                                    .map(d => d._id)


                //add the transferred deal to the transferring team's DealsProposedBy
                transferringTeam.DealsProposedTo = (destinationTeam.DealsProposedTo as IDeal[])            
                                                    .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))
                                                    .concat([nudeEel])
                                                    .map(d => d._id)

                //remove the transferred deal from the transferring team's DealsProposedBy
                transferringTeam.DealsProposedBy = (destinationTeam.DealsProposedBy as IDeal[])            
                                                    .filter(d => JSON.stringify(d._id) != JSON.stringify(nudeEel._id))
                                                    .map(d => d._id)


                const updatedDestinationTeam  = await TeamModel.findOneAndUpdate({Slug: destinationTeam.Slug}, destinationTeam, {new: true}).populate(teamPopulateRules).then(t => t);
                const updatedTransferringTeam = await TeamModel.findOneAndUpdate({Slug: transferringTeam.Slug}, transferringTeam, {new: true}).populate(teamPopulateRules).then(t => t);

                eventTarget.nsp.to(destinationTeam.Slug).emit(SocketEvents.RESPOND_TO_DEAL, updatedDestinationTeam); // Send proposal or response to team it's asking
                eventTarget.nsp.to(transferringTeam.Slug).emit(SocketEvents.RESPOND_TO_DEAL, updatedTransferringTeam); // Send proposal or response to team it's asking

            }
            //Deal has been proposed, but hasn't been accepted or rejected yet
            else{
                console.log("DEAL HAD NO ACCEPTED PROP SET")

                //notify the two teams that a transfer has been proposed
                eventTarget.nsp.to(deal.TransferToTeamSlug).emit(SocketEvents.PROPOSE_DEAL, deal); // Send proposal or response to team it's asking
                eventTarget.nsp.to(deal.TransferFromTeamSlug).emit(SocketEvents.PROPOSE_DEAL, deal); // Send proposal or response to team it's asking
            }
        }


    }
    

    private onSocketJoinRoom(eventTarget:SocketIO.Socket, roomName:string):void {
        eventTarget.leave(roomName);
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
        console.log("CONFIG CALLED")
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
            var allowedOrigins = [
                                    'http://localhost:443', 
                                    'https://planetsapientestsite.com', 
                                    'https://planetsapientestsite.com:443', 
                                    'https://planetsapien.com', 
                                    'https://planetsapien.com:443', 
                                    'https://www.planetsapien.com:443', 
                                    'https://www.planetsapien.com',
                                ];
            var origin = req.headers.origin;
            console.log("ORIGIN OF REQUEST IS:", req.headers.origin, req.url);
            if (allowedOrigins.indexOf(origin as string) > -1) {
                console.log("header " + origin + " approved");
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

        this.app.get('/sapien/api/getWaterResuls', (req, res) => {
            const sheets = new GoogleSheets();
            sheets.GetSheetValues(null, "Round 1 Results!A:ZZ").then((r:any) => res.json(r))
        })

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
                nations.forEach(n => promises.push(NationModel.findByIdAndUpdate(n._id, {TradeOptions: n.TradeOptions}, {new: true} ).populate("TradeOptions")))
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
                var promises:any[] = [];

                //Set our countries
                if (game.State == "2") {
                    console.log("STATE IS 2")
                    var teams:ITeam[] = game.Teams as ITeam[];
                    var promise = NationModel.find().then((nations) => {
                        for(var i = 0; i < nations.length; i++) {
                            var update = {
                                Nation: nations[i],
                                GameState: 2
                            }
                            TeamModel.findByIdAndUpdate(teams[i]._id, update, {new: true}).populate(
                                {
                                    path:"Nation",
                                    populate: {
                                        path:"TradeOptions"
                                    }
                                }
                            ).then((t) => {
                                this.io.of(t.GameId).to(t.Slug).emit(SocketEvents.TEAM_UPDATED, t);
                            });        
                            promises.push(promise);
                        }


                        const sheets = new GoogleSheets();
    
                        //emit the values to all the teams
                        sheets.GetSheetValues("1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg", "Country Impact!Y2:Y103").then((r:any) => {
                            this.io.of(game._id).emit(SocketEvents.DASHBOARD_UPDATED, r);
                        })
   

                        return nations;
                    })
                } else {
                    console.log("GAME STATE IS NOW", game.State);
                    (<ITeam[]>game.Teams).forEach((t:ITeam) => {
                        var promise = TeamModel.findByIdAndUpdate(t._id, {GameState: game.State}, {new: true}).then(t => t)
                        promises.push(promise)
                    })

                    Promise.all(promises).then((teams: ITeam[]) => {
                        teams.forEach(t => {
                            this.io.of(t.GameId).to(t.Slug).emit(SocketEvents.TEAM_UPDATED, t);
                        })
                    })
                }

                res.json(game);
            })
        });

        this.app.post('/sapien/api/login', async (req, res) => {
            try {
                var game:Game & mongoose.Document = null;
                const team = await TeamModel.findOne({Slug: req.body.Slug}).populate(
                    [
                        {
                            path:"Nation",
                            populate:{
                                path:"TradeOptions"
                            }
                        },
                        {
                            path:"DealsProposedBy",
                            populate: {
                                path:"TradeOption"     
                            }
                        },
                        {
                            path:"DealsProposedTo",
                            populate: {
                                path:"TradeOption"     
                            }
                        }
                    ]
                ).then(t => t);

                if (team) {
                    const sheets = new GoogleSheets();
                    const content = await sheets.GetNationContent((team.Nation as INation).Name);
                    if(content) (team.Nation as INation).Content = content;
                   // console.log("NATION IS",(content));
                    game = await GameModel.findById(team.GameId);
                    if (game) {
                        let gameSocketNameSpace = this.io.of(game._id);
                        gameSocketNameSpace.removeAllListeners()
                            .on(SocketEvents.CONNECT, this.onGameSocketConnect.bind(this, gameSocketNameSpace, game));
                        
                        let t:Team = team.toObject() as Team;
                        t.GameState = game.State;
                        if (this.socketServer instanceof https.Server) {
                            this.sheets.setTeamListener(t.Slug);
                        }
                        let token = jwt.sign({team: t}, 'shhhhh');
                        console.log("TEAM TO SEND", team);

                        //emit the values to all the teams
                        new GoogleSheets().GetSheetValues("1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg", "Country Impact!Y3:Y103").then((r:any) => {
                            this.io.of(game._id).to(t.Slug).emit(SocketEvents.DASHBOARD_UPDATED, r);
                        })

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
            
            console.log("ORIGINS HAVE BEEN SET");
        }
        this.socketServer.listen(port);
        console.log("THE SOCKET SERVER HAS BEEN SET UP IN THE listenForSocket METHOD ON PORT " + port);
        if (this.socketServer instanceof https.Server) {
            this.sheetsRouter.post('/:id', (req, resp) => {
                console.log("Post Request >", req.params, req.headers);
                var sheets = new GoogleSheets();
                sheets.GetSheetValues().then((v:any) => {     
                    console.log("returning:", req.body.Slug);
                    this.io.of(req.params.id).emit(SocketEvents.DASHBOARD_UPDATED, v);
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
        TeamModel.findOne( { Slug } ).populate("Players").then((t:Team) => {
            this.io.emit(SocketEvents.SELECT_TEAM, t);
        })
    }
    
}
