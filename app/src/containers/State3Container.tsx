//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State3 from '../components/State3';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';

interface DispatchProps {
    getPlayer:() => {}
}
export interface State3ContainerProps{
    CurrentPlayer: ITeam;
    SocketConnected: boolean;
    GameWon: boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State3ContainerProps => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
        SocketConnected: state.Application.SocketConnected,
        GameWon: state.GameData.GameWon
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => {
            dispatch( Actions.getPlayer() )
        },
    }
}

const State3Container = connect<State3ContainerProps, {}>(mapStateToProps, mapDispatchToProps)(State3);
export default State3Container;