import { GameAction } from './Actions';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import * as socketIo from 'socket.io-client';
import ApplicationStore from '../stores/Store'
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import BaseClass from '../../../api/src/models/BaseModel';

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
        
        const socket = socketIo("http://localhost:5000");

        
        socket.on('connect', (data: any) => {
            console.dir("SOCKET RETURNED SOMETHING", data)
        })

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

const getPlayersFromTeam:ActionCreator<Action<ITeam>> = (type:string, payload: ITeam) =>{
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