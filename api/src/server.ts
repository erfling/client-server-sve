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
import IGame from '../../shared/models/Game';

//socket setup
import { SocketEvents } from './../../shared/models/SocketEvents';

import { Game, GameModel } from './models/Game'; 


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
    }

    private listenForSocket(): void {
        
        this.socketServer.listen(Server.SOCKET_PORT, () => {
            console.log('Running server on port %s', Server.SOCKET_PORT);
        });

        this.io.on(SocketEvents.CONNECT, (socket: any) => {
            this.io.emit('HELLO',"CONNECTION ESTABLISHED");

            console.log('Connected client on port %s.', Server.SOCKET_PORT);

            GameModel.find().then((g:Game[])=>{
                this.io.emit("HELLO", g);
            })

            socket.on(SocketEvents.DISCONNECT, () => {
                console.log('Client disconnected');
            });


            
        });
        
    }
}
    
    // export
    //export default new Server().app;