const readline: any = require('readline');
const google: any = require('googleapis');
const googleAuth: any = require('google-auth-library');
//import * as token from '../creds/client_secret.json'
/*
import * as readline from 'readline';
import * as google from 'googleapis';
import * as googleAuth form 'google-auth-library'
*/

import * as fs from 'fs';
import IPlayer from '../../../shared/models/IPlayer';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import formValues from '../../../shared/models/FormValues';
import INation from '../../../shared/models/INation';
import IGame from '../../../shared/models/IGame';
import { SocketEvents } from '../../../shared/models/SocketEvents';

interface SheetsCache{
    [index:string]: CacheValue;
}

interface CacheValue{
    RequestTime: number;
    SheetsValues: any;
}

export default abstract class GoogleSheets
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------



    static auth: any;
    static SCOPES:string[] = [
                                'https://www.googleapis.com/auth/spreadsheets',
                                'https://www.googleapis.com/auth/drive.readonly',
                                'https://www.googleapis.com/auth/drive.file'
                             ];
    static TOKEN_DIR: string = '/sapien/.credentials/';
    static TOKEN_PATH: string = GoogleSheets.TOKEN_DIR + 'sheets.googleapis.sve.json';
    static LAST_REQUEST_FOR_YEARS_ABOVE_2:number;
    static LAST_REQUEST_FOR_DASHBOARD:number;

    static Cache: SheetsCache = {};
    static setInCache(range: string, SheetsValues: any){
        console.log("SETTING ", range, " INTO CACHE")
        var values:CacheValue = {
            RequestTime: Date.now(),
            SheetsValues
        }
        GoogleSheets.Cache[range] = values;
    }
    static getFromCache(range:string): CacheValue | boolean {

        if(GoogleSheets.Cache[range] 
            && GoogleSheets.Cache[range].SheetsValues
            && GoogleSheets.Cache[range].RequestTime
            && Date.now() - GoogleSheets.Cache[range].RequestTime < 50000
        ){
            console.log("GETTING FROM CACHE. RANGE IS: ", range)
            return GoogleSheets.Cache[range];
        }

        return false;
    }


    //----------------------------------------------------------------------
    //
    //  Constructor
    //
    //----------------------------------------------------------------------



    //----------------------------------------------------------------------
    //
    //  Event Handlers
    //
    //----------------------------------------------------------------------
    // NOTE: eventTarget param is a the instance listening for the event.



    //----------------------------------------------------------------------
    //
    //  Methods
    //
    //----------------------------------------------------------------------
    

    private static apiGetValues( sheetId: string, range: string, ignoreCache: boolean = false ){
        if(ignoreCache)console.log("WE ARE IGNORING THE CACHE FOR RANGE ", range)
        if(!ignoreCache && range && GoogleSheets.getFromCache(range)){
            console.log("OUR CACHE IS");
            return new Promise((resolve) => {
                console.log(range, " WAS FOUND IN CACHE")
                return resolve((GoogleSheets.getFromCache(range) as CacheValue).SheetsValues);
            })
        }

        console.log("SHEET ID: ", sheetId)

        const sheets = google.sheets('v4');
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            if (!sheetId) sheetId = '1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg'
            return new Promise((resolve, reject) => {
                if (!auth) return;
                sheets.spreadsheets.values.get({
                    auth: auth,            
                    spreadsheetId: sheetId,
                    range: range
                }, (err:any, response: any) => {
                    if (err) {
                        console.log(err,"ERROR HERE GetSheetValues " + range);
                        reject(err);
                        return;
                    }

                    GoogleSheets.setInCache(range, response.values);
                    return resolve(response.values);

                })
            })
        })
    }

    /**
     * Reads a file and returns a promise
     * @param path
     */
    private static readAndAuthFile(path:string):Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function processClientSecrets(err: any, content: any) {
                if (err) {
                    console.log('Error loading ' + path + ': ' + err);
                    reject(err);
                }
                resolve(JSON.parse(content));
            });
        })
    }

    /**
     * Authorize a client with the loaded credentials
     * @param credentials 
     */
    private static authorize(credentials:any):Promise<any> {
        console.log("trying to authorize");
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        return new Promise((resolve, reject) => {
            console.log("TOKEN PATH", GoogleSheets.TOKEN_PATH);
            fs.readFile(GoogleSheets.TOKEN_PATH, function(err:any, token:any) {
                if (err) {
                    GoogleSheets.getNewToken(oauth2Client);
                    reject(err)
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    resolve(oauth2Client);
                }
            });
        }).catch(e => {})
    }
    
    public static GetSheetValues(sheetId:string = null, range: string = null, ignoreCache:boolean = false):any {

        if(range && range == "Country Impact!Y3:Y103"){
            console.log("RANGE FOUND")
            if(!this.LAST_REQUEST_FOR_DASHBOARD){
                this.LAST_REQUEST_FOR_DASHBOARD = Date.now();
                if(this.LAST_REQUEST_FOR_DASHBOARD > 1000){
                    ignoreCache = true;
                    this.LAST_REQUEST_FOR_DASHBOARD = Date.now();
                }
            }
        }

        if (!sheetId) sheetId = '1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg';
        return GoogleSheets.apiGetValues(sheetId, range, ignoreCache);
    }

    private  static storeToken(token:any):void {
        try {
            fs.mkdirSync(GoogleSheets.TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') throw err;
        }
        fs.writeFile(GoogleSheets.TOKEN_PATH, JSON.stringify(token), null);
        console.log('Token stored to ' + GoogleSheets.TOKEN_PATH);
    }

    private static getNewToken(oauth2Client:any):void {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: GoogleSheets.SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', (code: any) => {
            rl.close();
            oauth2Client.getToken(code, (err: any, token: any) => {
                if (err) {
                    //console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                this.storeToken(token);
                this.auth = oauth2Client;
            });
        });
    }
    
    public static entryPoint(method:Function, instance:GoogleSheets):Promise<any> {
        if (!method) method = this.GetSheetValues;
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .catch()
    }

    public static subscribeToDriveResource(path: string):Promise<any> {
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth: any) => {
            var service = google.drive('v3');
            return new Promise((resolve, reject) => {
              service.files.list({
                  auth: auth,
                  pageSize: 10,
                  fields: "nextPageToken, files(id, name)"
              }, function(err:any, response:any) {
                  if (err) {
                      console.log('The API returned an error: getRatingsByNation' + err);
                      return;
                  }
                  var files = response.files;
                  if (files.length == 0) {
                      console.log('No files found.');
                  } else {
                      console.log('Files:');
                      for (var i = 0; i < files.length; i++) {
                          var file = files[i];
                          console.log('%s (%s)', file.name, file.id);
                      }
                  }
              })
          })
          .catch(e => {})
          
        })
    }

    public static submitTradeDealValues(teams: ITeam[], deal:IDeal):Promise<any>{
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {

            var values = teams.sort((a, b) => {
                return (a.Nation as INation).Name > (b.Nation as INation).Name ? 1 : 0
            }
            ).map((t) => {
                console.log((t.Nation as INation).Name, t.DealsProposedTo.length)
                return (t.Nation as INation).Name == deal.ToNationName ? [deal.Value] : [0] ;
            })
            console.log("VALUES we want to submit");
            console.log(values);

            var range = "Country Impact!C12:C17"
            const sheets = google.sheets('v4');
            var data = [{
                range: range,
                values: values
            }];
            var body = {
                data: data,
                valueInputOption: 'USER_ENTERED'
            };
            var requestBody = {
                resource: body,
                spreadsheetId: teams[0].SheetId,
                auth:auth,
            }

            return new Promise((resolve, reject) => {
                sheets.spreadsheets.values.batchUpdate(
                    requestBody,
                    (err:any, result: any) => {
                    if (err) {
                        console.log(err,"ERROR HERE submitTradeDealValues")
                        return reject(err);
                    }
                    return resolve(result.values);
                })
            }).then(values => values)
        }).catch(e => {throw(e)})
    }

    public static commitAnswers(values:string[][] | number[][], range:string, sheetId:string ):Promise<any> {
        console.log("ABOUT TO COMMIT ANSWERS TO SHEET ", sheetId);

        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {

            const sheets = google.sheets('v4');


            if(!sheetId)sheetId = '1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg';

            var data = [{
                range: range,
                values: values
            }];


            var body = {
                data: data,
                valueInputOption: 'USER_ENTERED'
            };

            var requestBody = {
                resource: body,
                spreadsheetId: sheetId,
                auth:auth,
            }

          // console.log("TRYING TO SEND:",requestBody)
          return new Promise((resolve, reject) => {
              sheets.spreadsheets.values.batchUpdate(
                  requestBody, 
                  (err:any, result: any) => {
                  if (err) {
                      console.log(err,"ERROR HERE commitAnswers")
                      return reject(err);
                  }
                  return resolve(result.values);
              })
          })
        })
        .catch()
    }

    public static setTeamListener(game: IGame):Promise<any> {
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth: any) => {
            var service = google.drive('v3');
            return new Promise((resolve, reject) => {
                service.changes.watch({
                    resource: {
                      id: game._id + "_TIMESTAMP_" + new Date().getTime(),
                      type: 'web_hook',
                      address: 'https://planetsapien.com:8443/sapien/api/driveupdate/'
                    },
                    pageToken:"126923",

                    fileId: game.SheetId,
                    auth: auth
                }, function(err:any, response:any) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        reject(err);
                        return;
                    }
                    var files = response;
                    resolve(response);
                    console.log(response);
                })
            })
            .catch(e => {})
        })
    }

    public static createTeamSheet(sheetName: string, sourceId: string):Promise<any>{
        console.log("ATTEMPTING CREATE SHEET", sheetName)
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth: any) => {
            return new Promise((resolve, reject)=>{
                const service = google.drive('v2');
                var request = service.files.copy({
                    'fileId': sourceId,
                    auth: auth,
                    'resource': {'title': sheetName}
                }, (error:any, resp: any) => {
                    if (error) {
                        console.log(error, "getRatingsByNation")
                        reject(error);
                    } else {
                        console.log("CREATE SHEET RESPONSE");
                        resolve(resp.id)
                    }
                });
            })
            
        }).catch(e => console.log("CAUGHT ERROR createTeamSheet",e));
    }

    public static GetNationContent(name: string, ignoreCache:boolean = false) {

        return GoogleSheets.apiGetValues('1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg', "Round 2 Offers", ignoreCache)
                    .then( ( response:any ) => {
                        var values = response.filter((r: any) => {
                            console.log(r[0]);
                            return r[0] == name
                        })
                        values[0][7] = values[0][7] + "\n" +  response[9][1];
                        return values;
                    }).catch(e => console.log(e))
    }

    public static handleDaysAbove(team: ITeam){ 
        var shouldForce = false;
        if(!this.LAST_REQUEST_FOR_YEARS_ABOVE_2)this.LAST_REQUEST_FOR_YEARS_ABOVE_2 = Date.now();
        if( Date.now() - this.LAST_REQUEST_FOR_YEARS_ABOVE_2 > 1000){
            shouldForce = true;
            this.LAST_REQUEST_FOR_YEARS_ABOVE_2 = Date.now()
        }

        return this.apiGetValues(team.SheetId, "Country Impact!C21", shouldForce);

    }

    public static getRejectionOrAcceptanceReason(fromNationName: string, toNationName: string): Promise<any>{
        const sheets = google.sheets('v4');

        return GoogleSheets.apiGetValues('1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg', "Round 2 Offers!K2:Q8")
                            .then((values: any) => {
                                var rows = values.filter((r: any) => {
                                    return r[0].toUpperCase().indexOf(fromNationName.toUpperCase()) != -1
                                })
                                
                                console.log(rows);
            
                                if(rows && rows[0]){
                                    var column:string[] = rows[0].filter((row:string[], i: number) => {
                                        return values[0][i] && values[0][i].toUpperCase().indexOf(toNationName.toUpperCase()) != -1
                                    })
                                    console.log(column);
                                    if(column) return column[0];
                                }
                                
                            })
                            .catch(e => console.log(e))

    }

    public static clearRange(sheetId: string, range: string){
        const sheets = google.sheets('v4');
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            return new Promise((resolve, reject) => {
                if (!auth) return;
                var request = {
                    // The ID of the spreadsheet to update.
                    spreadsheetId: sheetId,  // TODO: Update placeholder value.
                
                    // The A1 notation of the values to clear.
                    range: range,  // TODO: Update placeholder value.
                
                    auth: auth,
                  };
                
                  sheets.spreadsheets.values.clear(request, function(err:Error, response:any) {
                    if (err) {
                      console.error(err, "clearRange");
                      return reject(err);
                    }

                    return resolve(response);
                
                  });
            })
        })    
    }

    public static getRatingsByNation(team:ITeam){
        const sheets = google.sheets('v4');

        
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            return new Promise((resolve, reject) => {
                if (!auth) return;
                var request = {
                    // The ID of the spreadsheet to update.
                    spreadsheetId: team.SheetId,  // TODO: Update placeholder value.
                
                    // The A1 notation of the values to clear.
                    range: "Round 3 Criteria!A2:D7",  // TODO: Update placeholder value.
                
                    auth: auth,
                  };
                
                  sheets.spreadsheets.values.get(request, function(err:Error, response:any) {
                    if (err) {
                      console.error(err, "getRatingsByNation");
                      return reject(err);
                    }

                    var row = response.values.filter( (v:string[])=> {
                        console.log(v);
                        return v[0] && v[0] == (team.Nation as INation).Name;
                    })

                    return resolve(row);
                
                  });
            })
        })  
    }

}