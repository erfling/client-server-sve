//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import Chart from '../components/Chart';
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
    acknowledgeDealRejection: () => {}
}
export interface ChartProps{
    Dashboard: any;
}

interface MyOwnProps {
    ChartLabel?:string
}

const mapStateToProps = (state: ApplicationStore, ownProps: MyOwnProps): ChartProps & MyOwnProps => {
    return {
        Dashboard: state.GameData.Dashboard,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: MyOwnProps) => {
    return {}
}

const ChartContainer = connect<ChartProps, MyOwnProps>(mapStateToProps, mapDispatchToProps)(Chart);
export default ChartContainer;
//dispatch(Actions.setWaterValues(team))