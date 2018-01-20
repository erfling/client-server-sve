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
    selectGame: (event: React.MouseEvent<HTMLAnchorElement>, game: IGame) => {}
}
interface TeamDetailProps{
    Games:IGame[];
    Loading:boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): TeamDetailProps => {
    return {
        Games: state.GameData.Game,
        Loading: state.Application.Loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getGames: () => dispatch( Actions.getGames() )
    }
}

const AdminGamesListContainer = connect<TeamDetailProps, any>(mapStateToProps, mapDispatchToProps)(AdminGamesList);
export default AdminGamesListContainer;