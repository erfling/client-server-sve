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
    setWaterValues:(team:ITeam) => {}
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
        setWaterValues: (team: ITeam) => {dispatch(Actions.setWaterValues(team))}
    }
}

const State3Container = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(State3);
export default State3Container;