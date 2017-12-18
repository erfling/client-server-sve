import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';

//import routers
import GameRouter from './routers/GameRouter';
import SheetsRouter from './routers/GoogleSheetsRouter';
import TeamRouter from './routers/TeamRouter';

//Server class
class Server {
    
      // set app to be of type express.Application
      public app: express.Application;
    
      constructor() {
        this.app = express();
        this.config();
        this.routes();
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
    }
    
    // export
    export default new Server().app;