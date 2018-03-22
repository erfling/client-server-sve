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
    proposeDeal:(deal:{from:string, to: string, deal:string}) => {}
    rejectDeal: (deal: IDeal) => {}
    acceptDeal: (deal: IDeal, accept: boolean) => {}
    acknowledgeDealRejection: () => {}
}
export interface State2Props{
    CurrentPlayer: ITeam;
    PendingDealOffer: IDeal;
    RejectedDealOffer: IDeal;
    Dashboard: any;
    AcceptedDealOffer: IDeal;
    Round2Won: boolean
    //Options: ITradeOption[]
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State2Props => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
        RejectedDealOffer: state.GameData.RejectedDealOffer,
        AcceptedDealOffer: state.GameData.AcceptedDealOffer,
        PendingDealOffer: state.GameData.PendingDealOffer,
        Dashboard: state.GameData.Dashboard,
        Round2Won: state.Application.Round2Won
        //Options: (state.GameData.CurrentPlayer.Nation as INation).TradeOptions as ITradeOption[]
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch( Actions.getPlayer() ),
        proposeDeal: ( deal: IDeal ) => dispatch( Actions.proposeDeal(deal) ),
        rejectDeal: ( deal: IDeal, rescinded: boolean = false ) => dispatch( Actions.rejectDeal( deal, rescinded ) ),
        acceptDeal: (deal: IDeal, accept: boolean) => dispatch( Actions.acceptDeal(deal, accept) ),
        acknowledgeDealRejection: () => dispatch( Actions.acknowledgeDealRejection() )
    }
}

const State2Container = connect<State2Props, {}>(mapStateToProps, mapDispatchToProps)(State2);
export default State2Container;
//dispatch(Actions.setWaterValues(team))