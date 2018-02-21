import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/IGame';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";
import State0 from "../components/State0";

interface Props extends ApplicationStore {
}
interface DispatchProps {
    fetchGames: () => {}
}
const mapStateToProps = (state:ApplicationStore, ownProps: {}) => {
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



const State0Container = connect<Props, any>(mapStateToProps, mapDispatchToProps)(State0);
export default State0Container;