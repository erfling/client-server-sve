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
import PlayerDetail from '../components/PlayerDetail';
import { submit } from "redux-form";

interface DispatchProps {
    selectPlayer: (player: IPlayer) => {}
}
interface TeamDetailProps{
    Players: IPlayer[];
    submitting:boolean
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): TeamDetailProps => {
    var Players: IPlayer[] = state.GameData.SelectedTeam.Players as IPlayer[]
    return {
        Players,
        submitting:state.Application.DashboardUpdating
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return { 
        //selectPlayer: (player: IPlayer) => dispatch(Actions.chooseCurrentPlayer(player)) 
        selectPlayer: (event: React.MouseEvent<HTMLAnchorElement>, player: IPlayer) => {
            event.preventDefault();
            dispatch(Actions.chooseCurrentPlayer(player))
        }    
    }
}

const PlayerDetailContainer = connect<TeamDetailProps, any>(mapStateToProps, mapDispatchToProps)(PlayerDetail);
export default PlayerDetailContainer;