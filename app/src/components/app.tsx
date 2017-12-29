import * as React from "react";
import Games from "./games";
import IGame from '../../../shared/models/Game';
import ApplicationStore  from '../stores/Store';
import { initialState } from '../reducers/RootReducer';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';

import './app.scss';

interface Props extends ApplicationStore{
}

const mapStateToProps = (state: ApplicationStore, ownProps: {}): Props => {
    return {
        Game: state.Game,
        Team: state.Team,
        Loading: state.Loading,
    };
  };

// State is never set so we use the '{}' type.
export default class App extends React.Component<Props & Actions, ApplicationStore> {
    state:ApplicationStore = initialState;

    render() {
        return <div>
                 <h1>wowee {this.props.hey}</h1>
                </div>
    }
}