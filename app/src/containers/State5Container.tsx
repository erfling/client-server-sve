//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State5 from '../components/State5';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';

interface DispatchProps {
    getPlayer:() => {}
}
export interface State1Props{
    CurrentPlayer: ITeam;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch( Actions.getPlayer() ),
    }
}

const State5Container = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(State5);
export default State5Container;