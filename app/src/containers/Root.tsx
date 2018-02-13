import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/IGame';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";
import GameWrapper from "../components/GameWrapper";

interface Props extends ApplicationStore {
}
interface DispatchProps {
    fetchGames: () => {}
}
const mapStateToProps = (state:ApplicationStore, ownProps: {}) => {
    console.log(state);
    return {
        Game: state.GameData.Game,
        CurrentGame: state.GameData.CurrentGame,
        Application: state.Application,
        form: state.form
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Props & DispatchProps>, ownProps: any) => {
    return {
        fetchGames: () => dispatch(Actions.fetchGames())         
    }
}



const Root = connect<Props, any>(mapStateToProps, mapDispatchToProps)(GameWrapper);
export default Root;