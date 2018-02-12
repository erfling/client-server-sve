//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import State1 from '../components/State1';
import ITeam from '../../../shared/models/ITeam';

interface DispatchProps {
}
export interface State1Props{
    CurrentTeam: ITeam & {CurrentRole: string}
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
       CurrentTeam: state.GameData.CurrentPlayer
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
    }
}

const LoginContainer = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(State1);
export default LoginContainer;