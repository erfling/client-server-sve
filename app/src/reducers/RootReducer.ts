import { loadInitialDataSocket, saveGame, ACTION_TYPES, Action, GameAction } from './../actions/Actions';
import ApplicationStore from '../stores/Store';
import IBaseClass from '../../../shared/models/BaseModel';
import IGame from '../../../shared/models/Game';

export const initialState: ApplicationStore = {
    Game: [],
    Team: [],
    Loading: true
};

export const RootReducer = (state:ApplicationStore = initialState, action: Action<any | IBaseClass>) => {
    switch(action.type) {
        case(ACTION_TYPES.GAME_SAVED): 
            return state.Game.map(g => {
                return g._id != action.payload._id ? g : Object.assign(g, action.payload)
            })
        default:
            return state;
    }
}

export const GameReducer = (state = initialState, action: GameAction<IGame | IGame[]>) => {
    switch(action.type) {
        case(ACTION_TYPES.GAME_SAVED):
            var payload = action.payload as IGame;
            return state.Game.map(g => {
                return g._id != payload._id ? g : Object.assign(g, action.payload)
            })
        default:
            return state;
    }
}