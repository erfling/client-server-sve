import formValues from  '../../../shared/models/FormValues';
import { SocketEvents } from './../../../shared/models/SocketEvents';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import * as socketIo from 'socket.io-client';
import ApplicationStore from '../stores/Store'
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import BaseClass from '../../../api/src/models/BaseModel';
import IPlayer from '../../../shared/models/IPlayer';
import { store } from '../index';
import { setTimeout } from 'timers';


const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
const socketPort = window.location.host.includes('sapien') ? ":9443" : ":5000";
const baseRestURL = protocol +  "//" + window.location.hostname + port + "/sapien/api/";
//const socket = socketIo({path: socketPort + "/" + "Team1", transports: ['websocket'] });
const socket = socketIo(protocol +  "//" + window.location.hostname + socketPort + "/" + "Team1");
console.log("BASE",socket)
console.log("SOCKET ON CONNECT", socket);
const teamSocket = '';


 //SET UP SOCKET EVENTS
 socket.on(SocketEvents.CONNECT, (data: any) => {
    console.log("SOCKET RETURNED SOMETHING", data);
    console.log("SOCKET THAT RETURNED", socket);
})/*f
*/
export interface Action<T> {
    type: string;
    payload?: T;
    payloads?: T[];
}

export interface GameAction<IGame> extends Action<IGame | IGame[]> {
    payload?: IGame;
    payloads?: IGame[];
}

export enum ACTION_TYPES {
    GAME_SAVED = "GAME_SAVED",
    IS_LOADING = "IS_LOADING",
    LOADING_COMPLETE = "LOADING_COMPLETE",
    GAMES_LOADED = "GAMES_LOADED",
    TEAMS_LOADED_WITH_GAMES = "TEAMS_LOADED_WITH_GAMES",
    TEAMS_LOADED = "TEAMS_LOADED",
    PLAYERS_LOADED = "PLAYERS_LOADED",
    PLAYERS_LOADED_WITH_TEAMS = "PLAYERS_LOADED_WITH_TEAMS",
    GET_TEAM_BY_SLUG = "GET_TEAM_BY_SLUG",
    TEAM_SELECTED = "TEAM_SELECTED",
    ROLE_SELECTED = "ROLE_SELECTED",
    CURRENT_PLAYER_SET = "CURRENT_PLAYER_SET",
    SUBMIT = "SUBMIT",
    SUBMITTING = "SUBMITTING",
    DASHBOARD_UPDATING = "DASHBOARD_UPDATING",
    DASHBOARD_UPDATED = "DASHBOARD_UPDATED",
    EDIT_GAME = "EDIT_GAME",
    CANCEL_EDIT_GAME = "CANCEL_EDIT_GAME",


    UPDATE_ENVIRONMENTAL_HEALTH = "UPDATE_ENVIRONMENTAL_HEALTH",
    ADD_CLIENT_OBJECT = "ADD_CLIENT_OBJECT",
    REST_SAVE_SUCCESS = "REST_SAVE_SUCCESS",
    CURRENT_GAME_SET = "CURRENT_GAME_SET",
    GOT_OBJECT_BY_SLUG = "GOT_OBJECT_BY_SLUG",

    PLAYER_JOINED = 'PLAYER_JOINED',
    GOT_TEAMS = "GOT_TEAMS",
    GOT_PLAYER_FROM_LOCAL_STORAGE = "GOT_PLAYER_FROM_LOCAL_STORAGE"

}


const gamePushed: ActionCreator<GameAction<IGame>> = (game: IGame) => {
    return {
        type: ACTION_TYPES.GAME_SAVED,
        payload: game
    }
}

const dataInit: ActionCreator<GameAction<IGame[]>> = (type, payload:any) => {
    return {
        type,
        payload
    }
}
const isLoading: ActionCreator<Action<boolean>> = (type = ACTION_TYPES.IS_LOADING, payload: boolean) => {
    return {
        type,
        payload
    }
}

/*
export const loadInitialDataSocket = (socket: SocketIOClient.Socket) => {
    return (dispatch: Dispatch<any>) => {
        socket.on('initialList', (data: any) => {
            console.dir(data)
            dispatch(reduxAction(data))
        })
    }
}
*/

export const fetchGames = () => {
    return (dispatch: Dispatch<GameAction<IGame> | Action<any>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true));
        console.log("fetching games");        
    }
    
}

const getTeamBySlug:ActionCreator<Action<any>> = (type:string, payload:string) => {
    return {
        type,
        payload
    }
}
export const findTeam = (slug:string = null) => {
    return (dispatch: Dispatch<Action<ITeam>>) => {
        dispatch(getTeamBySlug(ACTION_TYPES.GET_TEAM_BY_SLUG, slug));        
    }
}

const getPlayersFromTeam:ActionCreator<Action<ITeam>> = (type:string, payload: ITeam) => {
    return {
        type,
        payload
    }
}
export const findPlayers = (team:ITeam) => {
    return (dispatch: Dispatch<Action<ITeam>>) => {
        dispatch(getPlayersFromTeam(ACTION_TYPES.PLAYERS_LOADED_WITH_TEAMS, team));
    }
}

const teamSelected:ActionCreator<Action<ITeam>> = (type:string, payload: ITeam) => {
    return {type,payload};
}
export const fetchTeamDetails = (slug:string) => {
    //const socket = socketIo("http://localhost:5000/" + slug);

    return (dispatch: Dispatch<GameAction<ITeam>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true));
        //socket.on(SocksetTimetEvents.CONNECT,()=>{
        //setTimeout(() => {
            console.log("getting team", slug);

        socket.emit(SocketEvents.SELECT_TEAM, slug);

        //},2000)
        socket.on(SocketEvents.SELECT_TEAM, (res:ITeam) => { 

            dispatch(teamSelected(ACTION_TYPES.TEAM_SELECTED, res));
            //setTimeout(() => dispatch( isLoading(ACTION_TYPES.IS_LOADING, false) ), 10)
        })
        //})
        
    }
    
}

const setCurrentPlayer:ActionCreator<Action<string>> = (type:string, payload:string) => {
    return {
        type,
        payload
    }
}
export const chooseCurrentPlayer = (player:IPlayer) => {
    console.log("CHOOSING PLAYER", player);
    return (dispatch: Dispatch<Action<IPlayer>>) => {
        socket.on("DRIVE_UPDATE",(dashboardData:any) => {
            dispatch(dashboardUpdated(ACTION_TYPES.DASHBOARD_UPDATED, dashboardData));
        })
        dispatch(setCurrentPlayer(ACTION_TYPES.CURRENT_PLAYER_SET, player._id));
    }
}

const setCurrentGame:ActionCreator<Action<IGame>> = (type:string, payload: IGame) => {
    return {
        type,
        payload
    }
}
export const chooseCurrentGame = (game: IGame) => {
    console.log("CHOOSING GAME", game);
    return (dispatch: Dispatch<Action<IPlayer>>) => {
        dispatch(setCurrentPlayer(ACTION_TYPES.CURRENT_GAME_SET, game));
    }
}

const appStateChange:ActionCreator<Action<boolean>> = (type:string, payload:boolean) => {return {type, payload}}
const submitForm:ActionCreator<Action<formValues>> = (type:string, payload:formValues):Action<formValues> => {return {type, payload}}
export const dispatchSubmitForm = (values:formValues) => {
    return (dispatch: Dispatch<Action<formValues>>) => {
        dispatch(appStateChange(ACTION_TYPES.DASHBOARD_UPDATING, true))
        socket.emit(SocketEvents.SUBMIT_TO_SHEET, values);
    }
}

const dashboardUpdated:ActionCreator<Action<any>> = (type:string, dashboardData:any):Action<any> => {
    return {type, payload: dashboardData}
}
export const updateDashboard = () => {
    return (dispatch: Dispatch<Action<any>>) => {
        console.log(socket);
        socket.on(SocketEvents.DASHBOARD_UPDATED, (dashboardData:any) => {
            console.log("DASHBOARD UPDATE", "dashboardData:", dashboardData);
            dispatch(dashboardUpdated(ACTION_TYPES.DASHBOARD_UPDATED, dashboardData));
            dispatch(appStateChange(ACTION_TYPES.DASHBOARD_UPDATING, false));
         })         
    }
}

const gotGames: ActionCreator<Action<IGame[]>> = (type: string, payload:IGame[]) => {return {type, payload}}
export const getGames = () => {
    return (dispatch: Dispatch<Action<IGame[]>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true))
        console.log("BASE REST",baseRestURL);
        return fetch(baseRestURL + 'games')
            .then(( res:Response ) => {
                console.log(res);
                return res.json()
            })
            .then( (games:IGame[] ) => {
                dispatch( gotGames( ACTION_TYPES.GAMES_LOADED, games ) );
                setTimeout( () => {dispatch(isLoading(ACTION_TYPES.IS_LOADING, false))},200);
            })
            .catch( ( reason ) => { console.log(reason); alert("LOAD asdf") } )
    }
}

export const editGame = (game: IGame): Dispatch<Action<string>> => {
    return (dispatch: Dispatch<Action<string>>) => {
        dispatch({type:ACTION_TYPES.EDIT_GAME, payload: game._id});
    }
}
export const cancelEditGame = (game: IGame): Dispatch<Action<string>> => {
    return (dispatch: Dispatch<Action<string>>) => {
        dispatch({type:ACTION_TYPES.CANCEL_EDIT_GAME, payload: game._id});
    }
}

const gameSaved: ActionCreator<GameAction<IGame>> = (game: IGame):GameAction<IGame> => {
    return {
        type: ACTION_TYPES.GAME_SAVED,
        payload: game
    }
}

export const restSave = (payload: IGame | ITeam | IPlayer) => {
    let method = payload._id ? "PUT" : "POST";
    let url = baseRestURL + payload.REST_URL;
    url = url + (payload._id ? "/" + payload._id : "");
    let body = JSON.stringify(payload);
    return (dispatch:Dispatch<Action<any>>) => {
        dispatch({type:ACTION_TYPES.SUBMITTING, payload: true});

        fetch(
            url, 
            {
                method,
                body, 
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then( (res:Response) => {
            return res.json()//.then(r => r);
        })
        .then( (saved: IGame | ITeam | IPlayer) => {
            setTimeout(() => {
                dispatch({type:ACTION_TYPES.SUBMITTING, payload: false})
                dispatch({type:ACTION_TYPES.REST_SAVE_SUCCESS, payload: saved})
            }, 200);          
        })
        .catch(reason => {console.log(reason), alert("SAVE FAILED")})
    }
}
export const addClientObject = ( objectType:string ) =>{
    return ( dispatch:Dispatch<Action<any>> ) => dispatch( { type:ACTION_TYPES.ADD_CLIENT_OBJECT, payload:{ CLASS_NAME:objectType, IsSelected:true, REST_URL: objectType.toLowerCase() + 's'} } );
}


//TODO: add action, apllication store membder, reducer switch for abstraced types. set states.
export const restFetchBySlug = ( type: string, slug:string) => {
    let url = baseRestURL + type.toLowerCase() + "s/" + slug;
    return (dispatch:Dispatch<Action<IGame | ITeam | IPlayer>>) => {
        fetch( url )
            .then( r => r.json() )
            .then( ( r: ITeam | IGame | IPlayer ) => {
                r.IsSelected = true;
                dispatch( {
                    type: ACTION_TYPES.GOT_OBJECT_BY_SLUG,
                    payload: r
                });
                //dispatch({type:ACTION_TYPES.})
            })
    }
}

export const getTeams = () => {
    let url = baseRestURL + "teams"
    return (dispatch:Dispatch<Action<ITeam[]>>) => {
        dispatch({type: ACTION_TYPES.IS_LOADING, payload: true})
        console.log("getting teams from", url)
        return fetch( url )
            .then( (r: any) => r.json() )
            .then( ( r: ITeam[] ) => {
                dispatch( {
                    type: ACTION_TYPES.GOT_TEAMS,
                    payload: r
                })
                dispatch({type: ACTION_TYPES.IS_LOADING, payload: false})
                return r;

            })
    }
}


export const setEnvironmentalHealth = (health: number):Dispatch<Action<number>> => {
    return (dispatch: Dispatch<Action<number>>) => {
        dispatch( {
            type: ACTION_TYPES.UPDATE_ENVIRONMENTAL_HEALTH, 
            payload: health
        });
    }

}

export const login = (player: IPlayer) => {
    return (dispatch: Dispatch<Action<IGame[]>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true))
        console.log("BASE REST",baseRestURL);
        const url = baseRestURL + 'login';
        return fetch(
                url, 
                {
                    method: "POST",
                    body: JSON.stringify(player),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }
            )
            .then(( res:Response ) => {
                return res.json()
            })
            .then( (jwt:any )=>{
                console.dir("A:LKJSDFLKj",jwt);
                dispatch( {
                    type: ACTION_TYPES.PLAYER_JOINED,
                    payload: jwt
                } );

                setTimeout( () => {dispatch(isLoading(ACTION_TYPES.IS_LOADING, false))},1000)

               
                socket.on(SocketEvents.TEAM_UPDATED, (team:ITeam) => {
                    dispatch( {
                        type: ACTION_TYPES.IS_LOADING,
                        payload: false
                    } );
                    dispatch( {
                        type: ACTION_TYPES.PLAYER_JOINED,
                        payload: jwt
                    } );
                })

            })
            .catch( ( reason ) => { console.log(reason);} )
    }
}

const setUpSocketListeners = () => {
    
}

export const selectTeam = (team:ITeam) => {
    return (dispatch: Dispatch<Action<ITeam>>) => {
        dispatch({
            type: ACTION_TYPES.TEAM_SELECTED,
            payload: team
        })
    }

}   

export const selectRole = (role: string) => {
    console.log("STORAGE",localStorage.sve_player);
    return (dispatch: Dispatch<Action<ITeam>>) => {
        dispatch({
            type: ACTION_TYPES.ROLE_SELECTED,
            payload: role
        })
    }
}

export const getPlayer = () => {
    console.log("PLAYER IS", JSON.parse(localStorage.getItem("SVE_PLAYER")))
    return (dispatch: Dispatch<Action<any>>) => {
        dispatch({
            type: ACTION_TYPES.GOT_PLAYER_FROM_LOCAL_STORAGE,
            payload: JSON.parse(localStorage.getItem("SVE_PLAYER"))
        })
    }
}

export const setWaterValues = (team: ITeam) => {
    console.log("SETTING WATER VALUES", team);
    socket.emit(SocketEvents.UPDATE_TEAM, team);
    return (dispatch: Dispatch<Action<ITeam>>) => {
        dispatch( {
            type: ACTION_TYPES.IS_LOADING,
            payload: true
        } );
    }
}
