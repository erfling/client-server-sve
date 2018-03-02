//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State4 from '../components/State4';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';

interface DispatchProps {
    getPlayer:() => {}
    setWaterValues:(team:ITeam) => {}
    submitRatings:(teamWithRatings: ITeam) => {}
    getContent: (team: ITeam) => {}
}
export interface State1Props{
    CurrentPlayer: ITeam;
    StateContent: any
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
        StateContent: state.GameData.StateContent
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch( Actions.getPlayer() ),
        setWaterValues: (team: ITeam) => {dispatch(Actions.setWaterValues(team))},
        submitRatings: (teamWithRatings: ITeam) => dispatch( Actions.submitRatings(teamWithRatings) ),
        getContent: (team: ITeam) => dispatch( Actions.getContent( team ) )
    }
}

const State3Container = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(State4);
export default State3Container;