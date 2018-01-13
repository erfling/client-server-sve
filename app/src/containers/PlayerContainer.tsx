import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";
//import TeamDetail from '../components/TeamDetail';
//import './app.scss';

interface DispatchProps {
    fetchTeam: (slug:string) => {}
}
interface TeamDetailProps{
    Player: IPlayer;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): TeamDetailProps => {
    return {
        Player: state.GameData.CurrentPlayer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        fetchTeam: (slug: string) => dispatch(Actions.findTeam(slug))        
    }
}



const TeamDetailContainer = connect<TeamDetailProps, any>(mapStateToProps, mapDispatchToProps)(TeamDetail);
export default TeamDetailContainer;