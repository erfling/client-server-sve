import { ACTION_TYPES, Action, GameAction, testUpdate} from './../actions/Actions';
import ApplicationStore from '../stores/Store';
import IBaseClass from '../../../shared/models/BaseModel';
import IGame from '../../../shared/models/Game';
import { combineReducers } from 'redux';

const initialState: ApplicationStore = {
    Game: [{Slug:"butt", _id:"1"}, {Slug:"a;lskdjf", _id:"2"}],
    Team: [{Slug:"test"}],
    Loading: true
};

export const Game = (state = initialState.Game, action: GameAction<IGame | IGame[]>) => {
    console.log("Action")
    switch(action.type) {
        case(ACTION_TYPES.GAME_SAVED):
            var payload = action.payload as IGame;
           
            let IDX = state.map((g) => {
                return {_id:g._id || null }
            }).filter((g)=>{
                return g._id == payload._id
            })[0] || null;

            return IDX ? state.map((g)=>{
                return g._id == payload._id ? Object.assign(g, payload) : state;
            }) : state.concat( [Object.assign( payload, { _id: (state.length+1).toString() } ) ] )

        default:
            return state;
    }
}

export const Application = ( state = initialState.Loading, action: Action<any> ) => {
    switch(action.type){
        case (ACTION_TYPES.IS_LOADING):
            return Object.assign(state, {Loading: true})
        case (ACTION_TYPES.LOADING_COMPLETE):
            return Object.assign(state, {Loading: false})
        default:
            return state;
    }
}

export default combineReducers(
    {
        Game,
        Application
    }
)
