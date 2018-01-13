import { ACTION_TYPES, Action, GameAction} from './../actions/Actions';
import ApplicationStore from '../stores/Store';
import IBaseClass from '../../../shared/models/BaseModel';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux'

const initialState: ApplicationStore = {
    GameData: {
        Game: [],
        Team: [],
        SelectedTeam: null
    },
    Application: {
        Loading: false
    }
};


export const GameData = (state = initialState.GameData, action: GameAction<IGame | IGame[]>) => {
    switch(action.type) {
        case(ACTION_TYPES.GAME_SAVED):
            var game = action.payload as IGame;           
            let IDX = state.Game.map((g) => {
                return {_id:g._id || null }
            }).filter((g)=>{
                return g._id == game._id
            })[0] || null;

            return IDX ? state.Game.map((g)=>{
                return g._id == game._id ? Object.assign(g, game) : state;
            }) : state.Game.concat( [Object.assign( game, { _id: (state.Game.length+1).toString() } ) ] )
        
        case(ACTION_TYPES.GAMES_LOADED):
            console.log("pay", action.payload);
            var games = action.payload as IGame[];
            var teams:ITeam[] = [];
            return Object.assign( {}, state, 
                { Game: games.map((g,i) => Object.assign(g, { idx:i} ) ) },
            );
        case(ACTION_TYPES.TEAMS_LOADED_WITH_GAMES):
            var games = action.payload as IGame[];  
            var teams:ITeam[] = [];         
            games.forEach( (g:IGame):void => {
                var ts:ITeam[] = g.Teams as ITeam[];
                teams = teams.concat(ts);
            });
            return Object.assign( {}, state, 
                { Team: teams },
            );
        case(ACTION_TYPES.GET_TEAM_BY_SLUG):
            return Object.assign({}, state, {SelectedTeam: state.Team.filter(t => t.Slug == action.payload)[0] || null})
            /**const filteredResponseObj = rawResponseBodyObj.reduce(function(map, obj) {
    map[obj.name] = obj.content;
    return map;
}, {}); */
        default:
            return state;
    }
}

export const Application = ( state = initialState.Application, action: Action<{type:string, payload:boolean}> ) => {
    switch(action.type){
        case (ACTION_TYPES.IS_LOADING):
            return Object.assign({}, {Loading: action.payload})
        default:
            return state;
    }
}

export default combineReducers(
    {
        GameData,
        Application,
        form: FormReducer,
        router: routerReducer
    }
)
