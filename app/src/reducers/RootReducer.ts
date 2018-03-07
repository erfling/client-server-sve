import { TradeOption } from './../../../api/src/models/TradeOption';
import { Team } from './../../../api/src/models/Team';
import { ACTION_TYPES, Action} from './../actions/Actions';
import ApplicationStore from '../stores/Store';
import IBaseClass from '../../../shared/models/BaseModel';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import IDeal from '../../../shared/models/IDeal';
import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux'
import ITradeOption from '../../../shared/models/ITradeOption';

const initialState: ApplicationStore = {
    GameData: {
        Game: [],
        Team: [],
        SelectedTeam: null,
        Dashboard: null,
        EnvironmentalHealth:0,
        ReceivedProposedDeals: [],
        SentProposedDeals: [],
        PendingDealOffer: null,
        RejectedDealOffer: null,
        AcceptedDealOffer: null,
        StateContent: null,
        SelectedRole: null,
        DaysAbove2: null,
        CurrentGames: null
    },
    Application: {
        Loading: false,
        DashboardUpdating: true,
        Submitting:false,
        SocketConnected:false,
        Round2Won: false
    },
    form:{}
};


export const GameData = (state = initialState.GameData, action: Action<any>) => {
    switch(action.type) {
        case (ACTION_TYPES.DEAL_PROPOSED):            
            return Object.assign({}, state, {PendingDealOffer: action.payload})
           
        case (ACTION_TYPES.DEAL_RESPONSE):        
            console.log("Deal response in reducer", action.payload)
            return Object.assign({}, state, {CurrentPlayer: Object.assign(
                {}, state.CurrentPlayer, {
                    DealsProposedTo: action.payload.DealsProposedTo,
                    DealsProposedBy: action.payload.DealsProposedBy,
                }
            ), PendingDealOffer: null})

        case (ACTION_TYPES.DEAL_REJECTED):
            return Object.assign({}, state, {RejectedDealOffer: action.payload, AcceptedDealOffer: null, PendingDealOffer: null})

        case (ACTION_TYPES.DEAL_ACCEPTED):
            return Object.assign({}, state, {RejectedDealOffer: null, AcceptedDealOffer: action.payload, PendingDealOffer: null})

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
        
        case(ACTION_TYPES.ACKNOWLEDGE_DEAL_REJECTION):
            return Object.assign({}, state, {RejectedDealOffer: null, AcceptedDealOffer: null})
        
        case(ACTION_TYPES.GAMES_LOADED):
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
        case(ACTION_TYPES.TEAM_SELECTED):
            var team:ITeam = action.payload as ITeam;  
            return Object.assign({}, state, {SelectedTeam: team || null})
        case(ACTION_TYPES.GET_TEAM_BY_SLUG):
            return Object.assign({}, state, {SelectedTeam: state.Team.filter(t => t.Slug == action.payload)[0] || null})
        case(ACTION_TYPES.CURRENT_PLAYER_SET):
            let players: IPlayer[] = state.SelectedTeam.Players as IPlayer[];
            var newState = Object.assign({},state);
            newState.SelectedTeam.Players = players.map(p => Object.assign({}, p, {IsSelected: p._id == action.payload}))
            return newState;

        case(ACTION_TYPES.CURRENT_GAME_SET):
            var game:IGame = action.payload as IGame;  
            return Object.assign({}, state, {SelectedGame: game || null})

        case(ACTION_TYPES.EDIT_GAME):
            var newState = Object.assign({},state);
            newState.Game = state.Game.map(g => Object.assign({}, g, {IsSelected: g._id == action.payload}))
            return newState;
        case(ACTION_TYPES.CANCEL_EDIT_GAME):
            var newState = Object.assign({},state);
            newState.Game = state.Game.filter(g => g._id).map(g => Object.assign({}, g, {IsSelected:false}))
            return newState;
        case(ACTION_TYPES.DASHBOARD_UPDATED):
            return Object.assign({}, state, {Dashboard: action.payload})
        case(ACTION_TYPES.ROUND_2_WON):
            return Object.assign({}, state, {Dashboard: action.payload})
        case(ACTION_TYPES.GOT_GAME):
            return Object.assign({}, state, {SelectedGame: action.payload})
        case(ACTION_TYPES.GAME_STATE_CHANGED_ADMIN):
            console.log("REDUCER HANDLING")
            var ns = JSON.parse(JSON.stringify(state));
            ns.SelectedGame.State = action.payload.State;
            return ns;
            //, Game: state.Game.map(g => g._id == action.payload._id ? Object.assign(action.payload, {IsSelected: true}) :  g)}
        case (ACTION_TYPES.REST_SAVE_SUCCESS):
            var newState = Object.assign({} ,state);
            var objects = newState[action.payload.CLASS_NAME];
            var found = false;
            newState[action.payload.CLASS_NAME] = objects.filter((o:IBaseClass) => o._id).map((o:IBaseClass) => {
                found = o._id == action.payload._id ? true : found;
                var newObject = o._id == action.payload._id ? Object.assign({}, action.payload, { IsSelected: false }) : { IsSelected: false } 
                console.log(newObject, action.payload)
                return Object.assign( 
                    {}, 
                    o, 
                    newObject
                )
            })
            if(!found) newState[action.payload.CLASS_NAME].splice(0, 0, action.payload);
            return newState;

        case (ACTION_TYPES.GOT_OBJECT_BY_SLUG):
            var newState = Object.assign({} ,state);
            var objects = newState[action.payload.CLASS_NAME] || [action.payload];
            console.log("OBJECTS",objects, action)
            var found = false;
            newState[action.payload.CLASS_NAME] = objects.filter((o:IBaseClass) => o._id).map((o:IBaseClass) => {
                found = o._id == action.payload._id ? true : found;
                var newObject = o._id == action.payload._id ? Object.assign({}, action.payload, { IsSelected: false }) : { IsSelected: false } 
                console.log(newObject, action.payload)
                return Object.assign( 
                    {}, 
                    o, 
                    newObject
                )
            })
            if(!found) {
                newState[action.payload.CLASS_NAME].splice(0, 0, action.payload);
            }
            newState["Selected" + action.payload.CLASS_NAME] = action.payload;
            return newState;
        
        case (ACTION_TYPES.ADD_CLIENT_OBJECT):
            var newState = Object.assign({} ,state);
            var objects = newState[action.payload.CLASS_NAME];
            newState[action.payload.CLASS_NAME] = [action.payload, ...objects];
            return newState;
        case ACTION_TYPES.UPDATE_ENVIRONMENTAL_HEALTH:
            return Object.assign({}, state, {EnvironmentalHealth: action.payload})

        case ACTION_TYPES.GOT_TEAMS:
            return Object.assign({}, state, {Team: action.payload})
        case ACTION_TYPES.ROLE_SELECTED:
            localStorage.setItem("SELECTED_ROLE", JSON.stringify(action.payload));
            return Object.assign({}, state, {SelectedRole: action.payload});
        case ACTION_TYPES.PLAYER_JOINED:
            localStorage.setItem('SVE_PLAYER', JSON.stringify(action.payload.team));
            localStorage.setItem('TOKEN', JSON.stringify(action.payload.token));
            console.log(action.payload)
            return Object.assign({}, state, {CurrentPlayer: Object.assign({}, action.payload.team)})
        case ACTION_TYPES.PLAYER_UPDATED:
            localStorage.setItem('SVE_PLAYER', JSON.stringify(action.payload));
            return Object.assign({}, state, {CurrentPlayer: Object.assign({}, action.payload)})
        case ACTION_TYPES.GAME_STATE_CHANGED: 
            localStorage.setItem('SVE_PLAYER', JSON.stringify(action.payload));
            return Object.assign({}, state, {CurrentPlayer: Object.assign({}, state.CurrentPlayer, {GameState: action.payload.GameState})})
        case ACTION_TYPES.GOT_PLAYER_FROM_LOCAL_STORAGE: 
            return Object.assign({}, state, {CurrentPlayer: Object.assign({}, action.payload)})
        case ACTION_TYPES.RATINGS_SUBMITTED:
            localStorage.setItem('SVE_PLAYER', JSON.stringify(action.payload));
            return Object.assign({}, state, {CurrentPlayer: Object.assign({}, action.payload)})
        case ACTION_TYPES.CURRENT_GAME_SAVED:
            return Object.assign({}, state, {Game: action.payload.map((g:IGame) => g)})
        case ACTION_TYPES.GOT_CURRENT_GAME:
            return Object.assign({}, state, {CurrentGames: action.payload})
        case ACTION_TYPES.GOT_CONTENT:
            return Object.assign({}, state, {StateContent: action.payload})
        case ACTION_TYPES.YEARS_ABOVE_2_UPDATED:
            return Object.assign({}, state, {DaysAbove2: action.payload})
        default:
            return state;
    }
}

export const Application = ( state = initialState.Application, action: Action<{type:string, payload:boolean}> ) => {
    switch(action.type){
        case (ACTION_TYPES.IS_LOADING):
            return Object.assign({}, state, {Loading: action.payload})
        case (ACTION_TYPES.DASHBOARD_UPDATING):
            return Object.assign({}, state, {DashboardUpdating: action.payload})
        case (ACTION_TYPES.SUBMITTING):
            return Object.assign({}, state, {Submitting: action.payload})
        case (ACTION_TYPES.SOCKET_CONNECTED):
            return Object.assign({}, state, {SocketConnected: true})
        case (ACTION_TYPES.ROUND_2_WON):
            return Object.assign({} , state, {Round2Won: true})
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
