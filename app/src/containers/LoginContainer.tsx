//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import LoginFormComponent from '../components/Login';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';

interface DispatchProps {
    joinGame: (player:IPlayer) => {}
    getTeams: () => {};
    selectTeam: (team: ITeam) => {};
}
export interface LoginFormProps{
    LoggingIn:boolean;
    Loading:boolean;
    Teams: ITeam[];
    SelectedTeam:  ITeam;
    SelectedRole: string;
    CurrentTeam: ITeam

}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): LoginFormProps => {
    return {
        LoggingIn: state.Application.Loading,
        Loading: state.Application.Loading,
        Teams: state.GameData.Team,
        SelectedTeam: state.GameData.SelectedTeam,
        SelectedRole: state.GameData.SelectedRole,
        CurrentTeam: state.GameData.CurrentPlayer
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        joinGame: (player: IPlayer) => {
            console.log(player);
            dispatch( Actions.login( player ) )
        },
        getTeams: () => {
            dispatch( Actions.getTeams() )
        },
        selectTeam: (team: ITeam) => {
            console.log("select fired to give us" , team)
            dispatch( Actions.selectTeam(team) )
        },
        selectRole: (role: string) => dispatch(Actions.selectRole(role))
    }
}

const LoginContainer = connect<LoginFormProps, {}>(mapStateToProps, mapDispatchToProps)(LoginFormComponent);
export default LoginContainer;