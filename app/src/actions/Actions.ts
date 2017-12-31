import { GameAction } from './Actions';
import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';
import { Socket } from 'socket.io-client';
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
    LOADING_COMPLETE = "LOADING_COMPLETE"
}

const reduxAction: ActionCreator<Action<any>> = (obj: any) => {
    return {
        type: "Thang",
        obj
    };
};

const gameSaved: ActionCreator<GameAction<IGame>> = (game: IGame) => {
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



export const loadInitialDataSocket = (socket: SocketIOClient.Socket) => {
    return (dispatch: Dispatch<any>) => {
        socket.on('initialList', (data: any) => {
            console.dir(data)
            dispatch(reduxAction(data))
        })
    }
}

export const saveGame = (socket: SocketIOClient.Socket, game: IGame) => {
    return (dispatch: Dispatch<any>) => {
        socket.on('gameSaved', (savedGame: IGame) => {
            dispatch(gameSaved(savedGame))
        })
    }
}

export const testUpdate = () => {
    gamePushed({ Slug: "testing1234" })
    return (dispatch: Dispatch<any>) => {
        //dispatch(gamePushed({ Slug: "testing1234" }))
        gamePushed({ Slug: "testing1234" })
    }
}
