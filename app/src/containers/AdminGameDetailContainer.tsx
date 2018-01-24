import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/IGame';
import ApplicationStore from '../stores/Store';
import AdminGamesList from '../components/AdminGamesList';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";

interface DispatchProps {
    getGames: (slug: string) => {},
    selectGame: (game: IGame) => {}
    editGame: (game: IGame) => {}
    cancelEditGame: (game: IGame) => {}
    saveGame: (game: any) => {}
    addGame: () => {};
}
interface AdminGameDetailProps{
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
        getGames: () => dispatch( Actions.getGames() ),
        editGame: (game: IGame) => dispatch( Actions.editGame(game) ),
        cancelEditGame: (game: IGame) => dispatch( Actions.cancelEditGame(game) ),
        saveGame: (game: IGame) => dispatch( Actions.restSave(game) ),
        addGame: () => dispatch( Actions.addClientObject("Game") ),
        selectGame: (game: IGame) => dispatch( Actions.chooseCurrentGame( game ) )
    }
}

const AdminGamesListContainer = connect<AdminGameDetailProps, any>(mapStateToProps, mapDispatchToProps)(AdminGamesList);
export default AdminGamesListContainer;