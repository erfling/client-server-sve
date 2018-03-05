//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import TopBar from '../components/TopBar';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';

interface DispatchProps {
    getPlayer: () => {}
    getDaysAbove: (team: ITeam) => {}
}
export interface State1Props{
    CurrentPlayer: ITeam
  
   Dashboard: any;
   DaysAbove2: number;
   SocketConnected: boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
        DaysAbove2: state.GameData.DaysAbove2,
        SocketConnected: state.Application.SocketConnected,
        Dashboard: state.GameData.Dashboard

    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => {
            dispatch( Actions.getPlayer() )
        },
        getDaysAbove: (team:ITeam) => dispatch( Actions.getDaysAbove(team) )
    }
}

const TopBarContainer = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(TopBar);
export default TopBarContainer;