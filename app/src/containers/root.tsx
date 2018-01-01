import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/Game';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";
import Games from '../components/games';

//import './app.scss';

interface Props extends ApplicationStore {
}
interface DispatchProps {
    fetchGames: () => {}
}

const mapStateToProps = (state:ApplicationStore, ownProps: {}): ApplicationStore => {
    return {
        Game: state.Game,
        Team: state.Team,
        Loading: state.Loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Props & DispatchProps>, ownProps: any) => {
    return {
        fetchGames: () => dispatch(Actions.fetchGames())         
    }
}



const Root = connect<Props, any>(mapStateToProps, mapDispatchToProps)(Games);
export default Root;