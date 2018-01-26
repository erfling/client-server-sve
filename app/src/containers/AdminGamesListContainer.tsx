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
interface GameListProps{
    Games:IGame[];
    Loading:boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): GameListProps => {
    return {
        Games: state.GameData.Game,
        Loading: state.Application.Loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getGames: () => dispatch( Actions.getGames() ),
        editGame: (game: IGame) => dispatch( Actions.editGame(game) ),
        cancelEditGame: (game: IGame) => dispatch( Actions.cancelEditGame(game) ),
        saveGame: (game: IGame) => dispatch( Actions.restSave(game) ),
        addGame: () => dispatch( Actions.addClientObject("Game") )
    }
}

const AdminGamesListContainer = connect<GameListProps, any>(mapStateToProps, mapDispatchToProps)(AdminGamesList);
export default AdminGamesListContainer;