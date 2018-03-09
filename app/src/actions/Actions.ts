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
import IDeal from '../../../shared/models/IDeal';
import IRatings from '../../../shared/models/IRatings';
import IRole from '../../../shared/models/IRole';
import { Socket } from 'dgram';
import { actionTypes } from 'redux-form';
import { json } from 'express';

const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
const socketPort = window.location.host.includes('sapien') ? ":9443" : ":5000";
const baseRestURL = protocol +  "//" + window.location.hostname + port + "/sapien/api/";
//const socket = socketIo({path: socketPort + "/" + "Team1", transports: ['websocket'] });
var socket:SocketIOClient.Socket;


export interface Action<T> {
    type: string;
    payload?: T;
    payloads?: T[];
}

export interface GameAction<IGame> extends Action<IGame | IGame[]> {
    payload?: IGame;
    payloads?: IGame[];
}

interface ActionDescription {
    actionType:string,
    payloadType?: string
}   

export const ACTION_TYPES = {
    GAME_SAVED: {
        actionType: "GAME_SAVED", 
        payloadType: "IGame"
    },
    IS_LOADING:{
        actionType: "IS_LOADING", 
        payloadType: "boolean"        
    },
    GAMES_LOADED: {
        actionType: "GAMES_LOADED",
        payloadType: "IGame",
        isArray: true
    },
    TEAM_SELECTED: {
        actionType: "TEAM_SELECTED",
        payloadType: "ITeam"
    },
    ROLE_SELECTED: {
        actionType: "ROLE_SELECTED",
        payloadType: "IRole"
    },
    CURRENT_PLAYER_SET:{
        actionType: "CURRENT_PLAYER_SET",
        payloadType: "ITeam"
    },
    SUBMITTING: {
        actionType: "SUBMITTING",
        payloadType: "any"
    }
    /*
    
    SUBMITTING = "SUBMITTING",
    DASHBOARD_UPDATING = "DASHBOARD_UPDATING",
    DASHBOARD_UPDATED = "DASHBOARD_UPDATED",
    YEARS_ABOVE_2_UPDATED = "YEARS_ABOVE_2_UPDATED",
    EDIT_GAME = "EDIT_GAME",
    CANCEL_EDIT_GAME = "CANCEL_EDIT_GAME",
    SET_CURRENT_GAME = "SET_CURRENT_GAME",
    CURRENT_GAME_SAVED = "CURRENT_GAME_SAVED",
    GOT_CURRENT_GAME = "GOT_CURRENT_GAME",

    UPDATE_ENVIRONMENTAL_HEALTH = "UPDATE_ENVIRONMENTAL_HEALTH",
    ADD_CLIENT_OBJECT = "ADD_CLIENT_OBJECT",
    REST_SAVE_SUCCESS = "REST_SAVE_SUCCESS",
    CURRENT_GAME_SET = "CURRENT_GAME_SET",
    GOT_OBJECT_BY_SLUG = "GOT_OBJECT_BY_SLUG",

    PLAYER_JOINED = 'PLAYER_JOINED',
    PLAYER_UPDATED = "PLAYER_UPDATED",
    GOT_TEAMS = "GOT_TEAMS",
    GOT_PLAYER_FROM_LOCAL_STORAGE = "GOT_PLAYER_FROM_LOCAL_STORAGE",

    GAME_STATE_CHANGED       = "GAME_STATE_CHANGED",
    GAME_STATE_CHANGED_ADMIN = "GAME_STATE_CHANGED_ADMIN",
    GOT_GAME = "GOT_GAME",

    DEAL_PROPOSED = "DEAL_PROPOSED",
    DEAL_RESPONSE = "DEAL_RESPONSE",
    DEAL_REJECTED = "DEAL_REJECTED",
    DEAL_ACCEPTED = "DEAL_ACCEPTED",
    ACKNOWLEDGE_DEAL_REJECTION  = "ACKNOWLEDGE_DEAL_REJECTION",
    ROUND_2_WON = "ROUND_2_WON",

    RATINGS_SUBMITTED = "RATINGS_SUBMITTED",

    GOT_CONTENT = "GOT_CONTENT",

    SOCKET_CONNECTED = "SOCKET_CONNECTED",
    GAME_RESET = "GAME_RESET"
*/
}

export const createTeamSocket = (team:ITeam) => {
    console.log("")
    if (socket) {
        console.log("SOCKET ALREADY PRESENT")
        return (dispatch: Dispatch<Action<ITeam>>) => {
            dispatch( {
                type: ACTION_TYPES.PLAYER_JOINED,
                payload: team
            } );
        }
    } else {
        socket = socketIo(protocol +  "//" + window.location.hostname + socketPort + "/" + team.GameId);

        console.log("OUR SOCKET IS", socket);

        //SET UP SOCKET EVENTS
        socket.on(SocketEvents.ROOM_MESSAGE, (roomName:string, msg: string) => {
            console.log("SOCKET RETURNED ROOM " + roomName + "MESSAGE", msg);
        })
        socket.on(SocketEvents.CONNECT, (data: any) => {
            console.log("SOCKET ON CONNECT THAT RETURNED:", socket);
            socket.emit(SocketEvents.JOIN_ROOM, team.Slug);
        })
        
        return (dispatch: Dispatch<Action<ITeam>>) => {
            console.log("WILL RETURN DISPATCH")
            socket.on(SocketEvents.TEAM_UPDATED, (team:ITeam) => {
                console.log("heard team update event from server over socket")
                dispatch( {
                    type: ACTION_TYPES.IS_LOADING,
                    payload: false
                } );
                dispatch( {
                    type: ACTION_TYPES.PLAYER_UPDATED,
                    payload: team
                } );
                dispatch({
                    type: ACTION_TYPES.GAME_STATE_CHANGED,
                    payload:team
                })
            })
            .on(SocketEvents.PROPOSE_DEAL, (deal:IDeal) => {
                console.log("SOCKET RETURNED DEAL_PR   OPOSED:", deal);
                dispatch( {
                    type: ACTION_TYPES.DEAL_PROPOSED,
                    payload: deal
                } );

                dispatch( {
                    type: ACTION_TYPES.IS_LOADING,
                    payload: false
                } )
            })
            .on(SocketEvents.RESPOND_TO_DEAL || SocketEvents.FORWARD_DEAL, (deal: IDeal) => {
                console.log("DEAL RESPONSE IS", deal)
                dispatch( {
                    type: ACTION_TYPES.DEAL_RESPONSE,
                    payload: deal
                } );

                dispatch( {
                    type: ACTION_TYPES.IS_LOADING,
                    payload: false
                } )
            })
            .on(SocketEvents.DEAL_REJECTED, (deal:IDeal) => {
                dispatch( {
                    type: ACTION_TYPES.DEAL_REJECTED,
                    payload: deal
                } );

                dispatch( {
                    type: ACTION_TYPES.IS_LOADING,
                    payload: false
                } )
            })
            .on(SocketEvents.DEAL_ACCEPTED, (deal: IDeal) => {
                dispatch( {
                    type: ACTION_TYPES.DEAL_ACCEPTED,
                    payload: deal

                } );

                dispatch( {
                    type: ACTION_TYPES.IS_LOADING,
                    payload: false
                } )
            })
            .on(SocketEvents.DASHBOARD_UPDATED,(dashboardData:any) => {
                console.log("DASHBOARD_UPDATED")
                dispatch(dashboardUpdated(ACTION_TYPES.DASHBOARD_UPDATED, dashboardData));
            })
            .on(SocketEvents.DASHBOARD_UPDATED_WIN,(dashboardData:any) => {
                console.log("DASHBOARD_UPDATED WITH VICTORY")
                dispatch({type:ACTION_TYPES.ROUND_2_WON});
            })
            .on(SocketEvents.JOIN_ROLE, (role:IRole) => {
                dispatch( {
                    type: ACTION_TYPES.ROLE_SELECTED,
                    payload: role
                } );

                dispatch( {
                    type: ACTION_TYPES.IS_LOADING,
                    payload: false
                } )
            })
            .on(SocketEvents.HAS_CONNECTED, (msg: string) => {
                console.log('HAS CONNECTED', msg);
                dispatch( {
                    type:ACTION_TYPES.SOCKET_CONNECTED
                } )
            })
            .on(SocketEvents.ROLE_RETURNED, (role:IRole) => {
                console.log("server returned", role)
                dispatch( {
                    type: ACTION_TYPES.ROLE_SELECTED,
                    payload: role
                } );
            })
            .on(SocketEvents.UPDATE_YEARS_ABOVE_2, (years: number | string) => {
                console.log("SERVER SAYS DAYS ABOVE 2 IS:", years);
                dispatch( {
                    type: ACTION_TYPES.YEARS_ABOVE_2_UPDATED,
                    payload: years
                } );
            })
        }
    }
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


export const fetchGames = () => {
    return (dispatch: Dispatch<GameAction<IGame> | Action<any>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true));
        console.log("fetching games");        
    }
    
}


const teamSelected:ActionCreator<Action<ITeam>> = (type:string, payload: ITeam) => {
    return {type,payload};
}
export const fetchTeamDetails = (slug:string) => {
    return (dispatch: Dispatch<GameAction<ITeam>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true));
        //setTimeout(() => {
            console.log("getting team", slug);
            socket.emit(SocketEvents.SELECT_TEAM, slug);
        //},2000)
        socket.on(SocketEvents.SELECT_TEAM, (res:ITeam) => {
            dispatch(teamSelected(ACTION_TYPES.TEAM_SELECTED, res));
            //setTimeout(() => dispatch( isLoading(ACTION_TYPES.IS_LOADING, false) ), 10)
        })
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
                return res.json()
            })
            .then( (games:IGame[] ) => {
                console.log("GET GAMES RESPONSE,",games);
                dispatch( gotGames( ACTION_TYPES.GAMES_LOADED, games ) );
                setTimeout( () => {dispatch(isLoading(ACTION_TYPES.IS_LOADING, false))},200);
            })
            .catch( ( reason ) => { console.log("GET GAMES FAILE CUZ: ",reason); } )
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

export const setGameCurrent = (game: IGame) => {
    return (dispatch:Dispatch<Action<IGame[]>>) => {
        dispatch({type:ACTION_TYPES.SUBMITTING, payload: true});
        const url = baseRestURL + "games/setcurrent"
        fetch(
            url, 
            {
                method: "POST",
                body: JSON.stringify(game), 
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then( (res:Response) => {
            return res.json()//.then(r => r);
        })
        .then( (savedGames: IGame[]) => {
            setTimeout(() => {
                dispatch({type:ACTION_TYPES.SUBMITTING, payload: false})
                dispatch({type:ACTION_TYPES.CURRENT_GAME_SAVED, payload: savedGames})
            }, 200);          
        })
        .catch(reason => {console.log(reason), alert("SAVE FAILED")})
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

export const getGame = (slug:string) => {
    let url = baseRestURL + "games/" + slug;
    return (dispatch:Dispatch<Action<IGame | ITeam | IPlayer>>) => {
        fetch( url )
            .then( r => r.json() )
            .then( ( r: ITeam | IGame | IPlayer ) => {
                console.log("we got this from the server", r)
                r.IsSelected = true;
                dispatch( {
                    type: ACTION_TYPES.GOT_GAME,
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

export const login = (team: ITeam) => {
    return (dispatch: Dispatch<Action<IGame[]>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true));
        console.log("BASE REST",baseRestURL);
        const url = baseRestURL + 'login';
        return fetch(
                url, 
                {
                    method: "POST",
                    body: JSON.stringify(team),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }
            )
            .then(( res:Response ) => {
                return res.json()
            })
            .then( (jwt:any ) => {
                dispatch( {
                    type: ACTION_TYPES.PLAYER_JOINED,
                    payload: jwt
                } );

                setTimeout( () => {
                    dispatch(isLoading(ACTION_TYPES.IS_LOADING, false));
                }, 1000);
               
                dispatch(createTeamSocket(team));

            })
            .catch( ( reason ) => { 
                console.log(reason);
            })
    }
}

export const selectTeam = (team:ITeam) => {
    return (dispatch: Dispatch<Action<ITeam>>) => {
        dispatch({
            type: ACTION_TYPES.TEAM_SELECTED,
            payload: team
        })
    }

}   

export const selectRole = (role: string, teamSlug:string) => {
    console.log("STORAGE",localStorage.sve_player);
    return (dispatch: Dispatch<Action<ITeam>>) => {
        socket.emit(SocketEvents.JOIN_ROLE, role, teamSlug);
        dispatch({
            type: ACTION_TYPES.IS_LOADING,
            payload: true
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
        dispatch( login(JSON.parse(localStorage.getItem("SVE_PLAYER"))) );
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

export const setGameState = (game:IGame, newState: number) => {
    return (dispatch: Dispatch<Action<number>>) => {
        const url = baseRestURL + 'changestate';

        return fetch(
            url, 
            {
                method: "POST",
                body: JSON.stringify(Object.assign(game, {State: newState})),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then(( res:Response ) => {
            return res.json()
        })
        .then( (jwt:any )=>{
            dispatch({
                type: ACTION_TYPES.GAME_STATE_CHANGED_ADMIN,
                payload:game
            })
        }
    )
    }
}

export const proposeDeal = (deal: IDeal ) => {
    socket.emit(SocketEvents.PROPOSE_DEAL, deal);
    return (dispatch: Dispatch<Action<boolean>>) => {
        dispatch({
            type: ACTION_TYPES.IS_LOADING,
            payload: true
        })
    }
}

export const acceptOrRejectDeal = (deal: IDeal, Accept: boolean) => {

    let transmittedDeal = Object.assign(deal, {Accept});
    console.log("About to transmit",transmittedDeal);

    return (dispatch: Dispatch<Action<boolean>>) => {
        socket.emit(SocketEvents.RESPOND_TO_DEAL, transmittedDeal);
        dispatch({
            type: ACTION_TYPES.IS_LOADING,
            payload: false
        })
    }
}

export const forwardDeal = (deal: IDeal) => {
    console.log("about to tell server to forward", deal);
    return (dispatch: Dispatch<Action<boolean>>) => {
        socket.emit(SocketEvents.FORWARD_DEAL, deal);
        dispatch({
            type: ACTION_TYPES.IS_LOADING,
            payload: false
        })
    }
}

export const submitRatings = (teamWithRatings: ITeam) => {
    return (dispatch: Dispatch<Action<ITeam>>) => {
        const url = baseRestURL + 'teamratings';
        dispatch({
            type: ACTION_TYPES.IS_LOADING,
            payload: true
        })
        return fetch(
            url, 
            {
                method: "POST",
                body: JSON.stringify(teamWithRatings),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then(( res:Response ) => {
            return res.json()
        })
        .then( (resp:any )=>{
            dispatch({
                type: ACTION_TYPES.RATINGS_SUBMITTED,
                payload:resp
            })
            dispatch({
                type: ACTION_TYPES.IS_LOADING,
                payload: false
            })
        }
    )
    }
}

export const acknowledgeDealRejection = () => {
    return (dispatch: Dispatch<Action<null>>) => {
        dispatch({type: ACTION_TYPES.ACKNOWLEDGE_DEAL_REJECTION})
    }
}

export const getCurrentGame = () => {
    return (dispatch:Dispatch<Action<IGame[]>>) => {
        dispatch({type:ACTION_TYPES.SUBMITTING, payload: true});
        const url = baseRestURL + "games/req/getcurrentgame"
        fetch(
            url, 
            {
                method: "GET",
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then( (res:Response) => {
            return res.json()//.then(r => r);
        })
        .then( (game: IGame) => {
            setTimeout(() => {
                dispatch({type:ACTION_TYPES.SUBMITTING, payload: false})
                dispatch({type:ACTION_TYPES.GOT_CURRENT_GAME, payload: game})
            }, 200);          
        })
        .catch(reason => {console.log(reason), alert("SAVE FAILED")})
    }
}

export const getContent = (team: ITeam) => {
    return (dispatch:Dispatch<Action<any>>) => {
        dispatch({type:ACTION_TYPES.SUBMITTING, payload: true});
        const url = baseRestURL + "sheets/content"
        fetch(
            url, 
            {
                method: "POST",
                body: JSON.stringify(team), 
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then( (res:Response) => {
            return res.json()//.then(r => r);
        })
        .then( (content: any) => {
            setTimeout(() => {
                dispatch({type:ACTION_TYPES.SUBMITTING, payload: false})
                dispatch({type:ACTION_TYPES.GOT_CONTENT, payload: content})
            }, 200);          
        })
        .catch(reason => {console.log(reason), alert("SAVE FAILED")})
    }
}

export const submitRoleRating = (roleName: string, teamSlug: string, rating: any) => {
    return (dispatch:Dispatch<Action<any>>) => {
        socket.emit(SocketEvents.SUBMIT_ROLE_RATING, roleName, teamSlug, rating)
        dispatch({
            type: "NOPE"
        })
    }
}

export const getDaysAbove = (team:ITeam) => {
    return (dispatch: Dispatch<Action<any>>) => {
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";

        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/getDaysAbove";

        fetch(
            URL,
            {
                body: JSON.stringify(team),
                method: "POST",
                headers: new Headers({
                    'Content-Type': 'application/json'
                })

            }
        )
        .then(r => r.json())
        .then(r => {
            console.log(r);
            dispatch( {
                type: ACTION_TYPES.YEARS_ABOVE_2_UPDATED,
                payload: r
            } );
        })
    }
}

export const resetGame = (game:IGame) => {
    console.log(game);
    return (dispatch:Dispatch<Action<IGame>>) => {
        
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/games/resetgame"

        fetch(
            URL,
            {
                body: JSON.stringify(game),
                method: "POST",
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then( r => r.json() )
        .then(r => {
            dispatch({
                type: ACTION_TYPES.GAME_SAVED,
                payload:r
            })

            dispatch({
                type: ACTION_TYPES.GOT_GAME,
                payload:r
            })
        })
    }
}