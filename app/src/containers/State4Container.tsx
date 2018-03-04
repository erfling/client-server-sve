//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State4 from '../components/State4';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';
import IRole from  '../../../shared/models/IRole';

interface DispatchProps {
    getPlayer:() => {}
    setWaterValues:(team:ITeam) => {}
    submitRatings:(teamWithRatings: ITeam) => {}
    getContent: (team: ITeam) => {}
    selectRole: (role: string, teamSlug:string) => {}
    submitRoleRating: (roleName: string, teamSlug: string, rating: any) => {} 
}
export interface State1Props{
    CurrentPlayer: ITeam;
    StateContent: any;
    SelectedRole: IRole;
    SocketConnected: boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
        StateContent: state.GameData.StateContent,
        SelectedRole: state.GameData.SelectedRole,
        SocketConnected: state.Application.SocketConnected
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch( Actions.getPlayer() ),
        setWaterValues: (team: ITeam) => {dispatch(Actions.setWaterValues(team))},
        submitRatings: (teamWithRatings: ITeam) => dispatch( Actions.submitRatings(teamWithRatings) ),
        getContent: (team: ITeam) => dispatch( Actions.getContent( team ) ),
        selectRole: (role: string, teamSlug:string) => dispatch( Actions.selectRole(role, teamSlug) ),
        submitRoleRating: (roleName: string, teamSlug: string, rating: any) => dispatch( Actions.submitRoleRating(roleName, teamSlug, rating) ) 
    }
}

const State3Container = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(State4);
export default State3Container;