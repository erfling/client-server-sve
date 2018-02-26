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
    
    public GetSheetValues(sheetId:string = null, range: string = null):any {
        const sheets = google.sheets('v4');
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            if (!sheetId) sheetId = '1R5Od_XTcwDyOKsLHaABHL8o9cl7Qg7P3zlYyBUUWds8'
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

    public submitTradeDealValues(teams: ITeam[]):Promise<any>{
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {

            var values = teams.sort((a, b) => {
                return (a.Nation as INation).Name > (b.Nation as INation).Name ? 1 : 0
            }
            ).map((t) => {
                console.log((t.Nation as INation).Name, t.DealsProposedTo.length)
                return [t.DealsProposedTo.length];
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
                spreadsheetId: '1nvQUmCJAb6ltOUwLm6ZygZE2HqGqcPJpGA1hv3K_9Zg',
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

    public commitAnswers(player:IPlayer, formValues:formValues):Promise<any> {
        return this.readAndAuthFile('./api/src/creds/client_secret.json')
        .then(this.authorize)
        .then((auth) => {
            var values:any[][] = [
                [
                    null, parseInt(formValues.PeopleOnBoard), "test"
                ],
                [
                    null, parseInt(formValues.LaunchDate)
                ],
                [
                    null, formValues.Budget
                ],
                [
                    null, null
                ],
                [
                    null, null
                ],
                [
                    null, null
                ],
                [
                    null, null
                ],
                [
                    null, formValues.RecruitingBudget
                ],
                [
                    null, null
                ]
            ];
            var data = [];
            var range = player.SheetRange + "!A2:C10"
            const sheets = google.sheets('v4');
            /*
            var body = {
                data:data,
                valueInputOption: 'USER_ENTERED'
            }
            */
            var requestBody = {
                resource: body,
                spreadsheetId: '1IhiI6i9eiN-fIIaVedG0ODoMsso7oi34DFK-A9SAg4Q',
                auth:auth,
            }

            var data = [];
            data.push({
                range: range,
                values: values
            });
            // Additional ranges to update ...
            var body = {
                data: data,
                valueInputOption: 'USER_ENTERED'
            };

          // console.log("TRYING TO SEND:",requestBody)
          return new Promise((resolve, reject) => {
              sheets.spreadsheets.values.batchUpdate({
                  spreadsheetId:'1IhiI6i9eiN-fIIaVedG0ODoMsso7oi34DFK-A9SAg4Q',
                  resource: body,
                  auth:auth
              }, (err:any, result: any) => {
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
                      address: 'https://planetsapientestsite.com:8443/sapien/api/driveupdate/' + teamSlug
                    },
                    fileId: "1R5Od_XTcwDyOKsLHaABHL8o9cl7Qg7P3zlYyBUUWds8",
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

    /*
        sheets.spreadsheets.values.get({
          auth: this.auth,
          spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          range: 'Class Data!A2:E',
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }
          var rows = response.values;
          if (rows.length == 0) {
            console.log('No data found.');
          } else {
            console.log('Name, Major:');
            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              // Print columns A and E, which correspond to indices 0 and 4.
              console.log('%s, %s', row[0], row[4]);
            }
          }
        });
      }
      */
}