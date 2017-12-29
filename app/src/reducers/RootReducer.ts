import { loadInitialDataSocket, saveGame, ACTION_TYPES, Action } from './../actions/Actions';
import {ApplicationStore} from '../stores/Store';
import IBaseClass from '../../../shared/models/BaseModel';

const initialState: ApplicationStore = {
    Game: [],
    Team: []
};

export const RootReducer = (state = initialState, action:Action<any | IBaseClass>) => {
    switch(action.type) {
        case(ACTION_TYPES.GAME_SAVED): 
            return state.Game.map(g => {
                return g._id != action.payload._id ? g : Object.assign(g, action.payload)
            })
        default:
            return state;
    }
}