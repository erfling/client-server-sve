import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import formValues from  '../../../shared/models/FormValues';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";
import TeamDetail from '../components/TeamDetail';
//import './app.scss';

interface DispatchProps {
    fetchTeam: (slug: string) => {},
    selectPlayer: (event: React.MouseEvent<HTMLAnchorElement>, player: IPlayer) => {}
}
interface TeamDetailProps{
    Team:ITeam;
    Dashboard:any;
    DashboardUpdating: boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): TeamDetailProps => {
    return {
        Team: state.GameData.SelectedTeam,
        Dashboard: state.GameData.Dashboard,
        DashboardUpdating: state.Application.DashboardUpdating
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        fetchTeam: (slug: string) => dispatch(Actions.fetchTeamDetails(slug)),
        submitForm: (values: formValues) => {
            console.log(values);
            dispatch(Actions.dispatchSubmitForm(Object.assign(values)))
        },
        subscribeToDashboard: () => { dispatch( Actions.updateDashboard()) }
    }
}

const TeamDetailContainer = connect<TeamDetailProps, any>(mapStateToProps, mapDispatchToProps)(TeamDetail);
export default TeamDetailContainer;