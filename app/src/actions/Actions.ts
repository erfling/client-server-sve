import formValues from  '../../../shared/models/FormValues';
import { submit } from 'redux-form';
import { SocketEvents } from './../../../shared/models/SocketEvents';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import * as socketIo from 'socket.io-client';
import ApplicationStore from '../stores/Store'
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import BaseClass from '../../../api/src/models/BaseModel';
import IPlayer from '../../../shared/models/IPlayer';

const socket = socketIo("http://localhost:5000");
socket.on('connect', (data: any) => {
    console.dir("SOCKET RETURNED SOMETHING", data)
})

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
    CURRENT_PLAYER_SET = "CURRENT_PLAYER_SET",
    SUBMIT = "SUBMIT",
    DASHBOARD_UPDATED = "DASHBOARD_UPDATED"
}

const gameSaved: ActionCreator<GameAction<IGame>> = (game: IGame):GameAction<IGame> => {
    return {
        type: ACTION_TYPES.GAME_SAVED,
        payload: game
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
export const saveGame = (socket: SocketIOClient.Socket, game: IGame) => {
    return (dispatch: Dispatch<any>) => {
        socket.on('gameSaved', (savedGame: IGame) => {
            dispatch(gameSaved(savedGame))
        })
    }
}

export const fetchGames = () => {
    return (dispatch: Dispatch<GameAction<IGame> | Action<any>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true))

        socket.on("HELLO", (res:any)=>{
            dispatch(dataInit(ACTION_TYPES.GAMES_LOADED, res));
            dispatch(dataInit(ACTION_TYPES.TEAMS_LOADED_WITH_GAMES, res));    

            setTimeout(() => dispatch( isLoading(ACTION_TYPES.IS_LOADING, false) ), 10)
        })
        
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
        dispatch(getPlayersFromTeam(ACTION_TYPES.PLAYERS_LOADED_WITH_TEAMS, team))
    }
}

const teamSelected:ActionCreator<Action<ITeam>> = (type:string, payload: ITeam) => {
    return {type,payload};
}
export const fetchTeamDetails = (slug:string) => {
    return (dispatch: Dispatch<GameAction<IGame> | Action<any>>) => {
        dispatch(isLoading(ACTION_TYPES.IS_LOADING, true))

        socket.emit(SocketEvents.SELECT_TEAM, slug);
        socket.on(SocketEvents.SELECT_TEAM, (res:ITeam)=>{   
            console.log("RESPONSE", res)       
            dispatch(teamSelected(ACTION_TYPES.TEAM_SELECTED, res));
            setTimeout(() => dispatch( isLoading(ACTION_TYPES.IS_LOADING, false) ), 10)
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
    console.log("CHOOSING", player)
    return (dispatch: Dispatch<Action<IPlayer>>) => {
        dispatch(setCurrentPlayer(ACTION_TYPES.CURRENT_PLAYER_SET, player._id))
    }
}

const submitForm:ActionCreator<Action<formValues>> = (type:string, payload:formValues):Action<formValues> => {return {type, payload}}
export const dispatchSubmitForm = (values:formValues) => {
    return (dispatch: Dispatch<Action<formValues>>) => {
        //dispatch(submitForm)
        socket.emit(SocketEvents.SUBMIT_TO_SHEET, values);
    }
}

const dashboardUpdated:ActionCreator<Action<any>> = (type:string, dashboardData:any):Action<any> => {
    console.log(type, dashboardData);
    return {type, payload: dashboardData}
}//TODO: have components subsribe to this method
export const updateDashboard = () => {
    return (dispatch: Dispatch<Action<any>>) => {
        socket.on(SocketEvents.DASHBOARD_UPDATED, (dashboardData:any) => {
            dispatch(dashboardUpdated(ACTION_TYPES.DASHBOARD_UPDATED, dashboardData))
         })         
    }
}