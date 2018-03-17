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

export default class GoogleSheets
{
    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    auth: any;
    static SCOPES:string[] = [
                                'https://www.googleapis.com/auth/spreadsheets',
                                'https://www.googleapis.com/auth/drive.readonly',
                                'https://www.googleapis.com/auth/drive.file'
                             ];
    static TOKEN_DIR: string = '/sapien/.credentials/';
    static TOKEN_PATH: string = GoogleSheets.TOKEN_DIR + 'sheets.googleapis.sve.json';

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
    
    /**
     * Reads a file and returns a promise
     * @param path
     */
    private readAndAuthFile(path:string):Promise<any> {
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
    private authorize(credentials:any):Promise<any> {
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
                    new GoogleSheets().getNewToken(oauth2Client);
                    reject(err)
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    resolve(oauth2Client);
                }
            });
        }).catch(e => {})
    }
    
    public GetSheetValues(sheetId:string = null, range: string = null, log:boolean = false):any {
        console.log("SHEET ID: ", sheetId)
        if(log){
            console.log("OUR RANGE IS:");
            console.log(range);
        }
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
                        console.log(err,"ERROR HERE");
                        reject(err);
                        return;
                    }
                    if(log){
                        console.log(response.values);
                    }
                    return resolve(response.values);

                })
            })
        })
    }

    private storeToken(token:any):void {
        try {
            fs.mkdirSync(GoogleSheets.TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') throw err;
        }
        fs.writeFile(GoogleSheets.TOKEN_PATH, JSON.stringify(token), null);
        console.log('Token stored to ' + GoogleSheets.TOKEN_PATH);
    }

    private getNewToken(oauth2Client:any):void {
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
    
    public entryPoint(method:Function, instance:GoogleSheets):Promise<any> {
        if (!method) method = this.GetSheetValues;
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .catch()
    }

    public subscribeToDriveResource(path: string):Promise<any> {
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
                      //console.log('The API returned an error: ' + err);
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

    public submitTradeDealValues(teams: ITeam[], deal:IDeal):Promise<any>{
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
                    console.log(result);
                    if (err) {
                        console.log(err,"ERROR HERE")
                        return reject(err);
                    }
                    console.log("HERE");
                    return resolve(result.values);
                })
            }).then(values => values)
        }).catch(e => {throw(e)})
    }

    public commitAnswers(values:string[][] | number[][], range:string, sheetId:string ):Promise<any> {
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

            console.log("data to submit", values);
          // console.log("TRYING TO SEND:",requestBody)
          return new Promise((resolve, reject) => {
              sheets.spreadsheets.values.batchUpdate(
                  requestBody, 
                  (err:any, result: any) => {
                  console.log(result);
                  if (err) {
                      console.log(err,"ERROR HERE")
                      return reject(err);
                  }
                  console.log("HERE");
                  return resolve(result.values);
              })
          })
        })
        .catch()
    }

    public setTeamListener(teamSlug:string):Promise<any> {
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth: any) => {
            var service = google.drive('v3');
            return new Promise((resolve, reject) => {
                service.files.watch({
                    resource: {
                      id: new Date().getMilliseconds().toString(),
                      type: 'web_hook',
                      address: 'https://planetsapien.com:8443/sapien/api/driveupdate/'
                    },
                    fileId: "1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg",
                    auth: auth
                }, function(err:any, response:any) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        reject(err);
                        return;
                    }
                    var files = response;
                    console.log(response);
                })
            })
            .catch(e => {})
        })
    }

    public createTeamSheet(sheetName: string, sourceId: string):Promise<any>{
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
                        reject(error);
                    } else {
                        console.log("CREATE SHEET RESPONSE");
                        resolve(resp.id)
                    }
                });
            })
            
        }).catch(e => console.log("CAUGHT ERROR",e));
    }

    public GetNationContent(name: string) {
        const sheets = google.sheets('v4');
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            const sheetId = '1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg'
            return new Promise((resolve, reject) => {
                if (!auth) return;
                sheets.spreadsheets.values.get({
                    auth: auth,            
                    spreadsheetId: sheetId,
                    range: "Round 2 Offers"
                }, (err:any, response: any) => {
                    if (err) {
                        console.log(err,"ERROR HERE");
                        reject(err);
                        return;
                    }
                    var values = response.values.filter((r: any) => {
                        return r[0] == name
                    })
                    values[0][7] = values[0][7] + "\n" +  response.values[9][1];
                    return resolve(values);
                })
            })
        })    
    }

    public getRejectionOrAcceptanceReason(fromNationName: string, toNationName: string): Promise<any>{
        const sheets = google.sheets('v4');
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            const sheetId = '1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg'
            return new Promise((resolve, reject) => {
                if (!auth) return;
                sheets.spreadsheets.values.get({
                    auth: auth,            
                    spreadsheetId: sheetId,
                    //the range where rejection reasons live
                    range: "Round 2 Offers!K2:Q8"
                }, (err:any, response: any) => {
                    if (err) {
                        console.log(err,"ERROR HERE");
                        reject("error");
                        return;
                    }


                    var rows = response.values.filter((r: any) => {
                        return r[0].toUpperCase().indexOf(fromNationName.toUpperCase()) != -1
                    })
                    
                    console.log(rows);

                    if(rows && rows[0]){
                        var column:string[] = rows[0].filter((row:string[], i: number) => {
                            return response.values[0][i] && response.values[0][i].toUpperCase().indexOf(toNationName.toUpperCase()) != -1
                        })
                        console.log(column);
                        if(column) return resolve(column[0]);
                    }
                    
                    return reject("no match found")
                    
                })
            })
        })    
    }

    public  clearRange(sheetId: string, range: string){
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
                      console.error(err);
                      return reject(err);
                    }

                    return resolve(response);
                
                  });
            })
        })    
    }

    public getRatingsByNation(team:ITeam){
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
                      console.error(err);
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