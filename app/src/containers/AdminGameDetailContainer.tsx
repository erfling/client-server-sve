import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import ApplicationStore from '../stores/Store';
import AdminGameDetail from '../components/AdminGameDetail';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";

interface DispatchProps {
    selectGame: (game:string) => {}
    setGameState:(game:IGame, newState:number) => {}
    resetGame: (game:IGame) => {}
    adminJoinedGame: (game: IGame) => {}
    //sendMessageFromAdmin: (gameId:string, message:string) => {}
}
export interface AdminGameDetailProps{
    Game:IGame;
    Loading:boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): AdminGameDetailProps => {
    return {
        Game: state.GameData.SelectedGame,
        Loading: state.Application.Loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        selectGame: (slug: string) => dispatch( Actions.getGame( slug ) ),
        setGameState: (game:IGame, newState: number) => dispatch( Actions.setGameState(game, newState)),
        resetGame: (game:IGame) => dispatch( Actions.resetGame(game) ),
        adminJoinedGame: (game: IGame) => dispatch( Actions.adminJoinedGame(game) )
        //sendMessageFromAdmin: (gameId:string, message:string) => dispatch( Actions.sendMessageFromAdmin(gameId, message) )
    }
}

const AdminGamesListContainer = connect<AdminGameDetailProps, any>(mapStateToProps, mapDispatchToProps)(AdminGameDetail);
export default AdminGamesListContainer;