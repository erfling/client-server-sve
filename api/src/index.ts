import * as http from 'http';
import * as https from 'https';
import * as debug from 'debug';
import * as fs from 'fs';
import Server from './server';

//debug('ts-express:server');
const server = new Server();
const port = normalizePort(4000);
const sport = normalizePort(8443);
//Server.set('port', port);

console.log(`Server listening on port ${port}`);
const processEnv = process.env.NODE_ENV || "dev";
console.log("SERVER IS IN",process.env.NODE_ENV);
/*
--cert /sapien/certificates/fullchain.pem --key /sapien/certificates/privkey.pem
*/
if(fs.existsSync('/sapien/certificates/privkey.pem')){
  var privateKey  = fs.readFileSync('/sapien/certificates/privkey.pem', 'utf8').toString();
  var certificate = fs.readFileSync('/sapien/certificates/fullchain.pem', 'utf8').toString();
  var credentials = {key: privateKey, cert: certificate};
  const httpsServer = https.createServer(credentials, server.app);
  httpsServer.listen(sport);
  httpsServer.on('error', onError);
  httpsServer.on('listening', onListening);
}

const httpServer = http.createServer(server.app);
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);



function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = httpServer.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}