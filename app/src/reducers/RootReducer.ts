import { ACTION_TYPES, Action, GameAction} from './../actions/Actions';
import ApplicationStore from '../stores/Store';
import IBaseClass from '../../../shared/models/BaseModel';
import IGame from '../../../shared/models/Game';
import { combineReducers } from 'redux';

const initialState: ApplicationStore = {
    Game: [],
    Team: [],
    Loading: true
};

export const InitialData = (state = initialState.Game, action: Action<any[]>) => {
    switch(action.type){
       
        default:
            return state;
    }
}

export const Game = (state = initialState.Game, action: GameAction<IGame | IGame[]>) => {
    switch(action.type) {
        case(ACTION_TYPES.GAME_SAVED):
            var game = action.payload as IGame;           
            let IDX = state.map((g) => {
                return {_id:g._id || null }
            }).filter((g)=>{
                return g._id == game._id
            })[0] || null;

            return IDX ? state.map((g)=>{
                return g._id == game._id ? Object.assign(g, game) : state;
            }) : state.concat( [Object.assign( game, { _id: (state.length+1).toString() } ) ] )
        
        case(ACTION_TYPES.GAMES_LOADED):
            console.log("pay", action.payload);
            var games = action.payload as IGame[];
            return games.map((g,i) => Object.assign(g, {idx:i}));
            /**const filteredResponseObj = rawResponseBodyObj.reduce(function(map, obj) {
    map[obj.name] = obj.content;
    return map;
}, {}); */
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
        Application,
        InitialData
    }
)
