//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State2 from '../components/State2';
import ITeam from '../../../shared/models/ITeam';
import { ACTION_TYPES } from '../actions/Actions';
import IDeal from '../../../shared/models/IDeal';
import INation from '../../../shared/models/INation';
import ITradeOption from '../../../shared/models/ITradeOption';

interface DispatchProps {
    getPlayer:() => {}
    proposeDeal:(deal:{from:string, to: string, deal:string}) => {},
    acceptOrRejectDeal: (deal: IDeal, accept: boolean) => {}
    forwardDeal: (deal: IDeal) => {}
}
export interface State2Props{
    CurrentPlayer: ITeam;
    PendingDealOffer: IDeal;
    Dashboard: any;
    //Options: ITradeOption[]
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State2Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
        PendingDealOffer: state.GameData.PendingDealOffer,
        Dashboard: state.GameData.Dashboard
        //Options: (state.GameData.CurrentPlayer.Nation as INation).TradeOptions as ITradeOption[]
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch( Actions.getPlayer() ),
        proposeDeal: ( deal: IDeal ) => {
            dispatch( Actions.proposeDeal(deal) )
        },
        acceptOrRejectDeal: (deal: IDeal, accept: boolean) => dispatch( Actions.acceptOrRejectDeal(deal, accept) ),
        forwardDeal: (deal:IDeal) => dispatch( Actions.forwardDeal(deal) ) 

    }
}

const State2Container = connect<State2Props, {}>(mapStateToProps, mapDispatchToProps)(State2);
export default State2Container;
//dispatch(Actions.setWaterValues(team))