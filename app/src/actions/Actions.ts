import { GameAction } from './Actions';
import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';
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
    TEAMS_LOADED = "TEAMS_LOADED",
    PLAYERS_LOADED = "PLAYERS_LOADED",
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

const dataInit: ActionCreator<Action<any>> = (type, payload:any) => {
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
    return (dispatch: Dispatch<GameAction<IGame>>) => {
        //dispatch(gamePushed({ Slug: "testing1234" }))
        fetch("http://localhost:4000/sapien/api/games", {mode: 'cors'})
        .then(res => res.json())
        .then((data:any)=>{
            console.log("GOT BACK", data);
            dispatch(dataInit(ACTION_TYPES.GAMES_LOADED, data))
        })
        .catch(()=>{
            dispatch(gamePushed({ Slug: "testing1234" }))
        })

        //Socket.connect("http://localhost:4000");
        const socket = socketIo("http://localhost:5000");
        socket.on('connect', (data: any) => {
            console.dir("SOCKET RETURNED SOMETHING", data)
            //dispatch(reduxAction(data))
        })

        socket.on("HELLO", (res:any)=>{
            alert("server said hello")
            console.log("FROM SERVER: ", res)
        })
        
    }
    
}
