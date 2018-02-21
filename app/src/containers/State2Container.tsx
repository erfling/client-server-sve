//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State2 from '../components/State2';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';
import IDeal from '../../../shared/models/IDeal';

interface DispatchProps {
    getPlayer:() => {}
    proposeDeal:(deal:{from:string, to: string, deal:string}) => {}
}
export interface State2Props{
    CurrentPlayer: ITeam;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State2Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch( Actions.getPlayer() ),
        proposeDeal: ( deal: IDeal ) => {
            dispatch( Actions.proposeDeal(deal) )
        }
    }
}

const State2Container = connect<State2Props, {}>(mapStateToProps, mapDispatchToProps)(State2);
export default State2Container;
//dispatch(Actions.setWaterValues(team))