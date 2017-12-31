import * as React from "react";
//import Games from "./games";
import IGame from '../../../shared/models/Game';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as ReactDOM from "react-dom";
import Games from '../components/games';

//import './app.scss';

interface Props extends ApplicationStore {
}
interface DispatchProps {
    testUpdate: () => {}
}

const mapStateToProps = (state:ApplicationStore, ownProps: {}): ApplicationStore => {
    console.log("STATE HERE",state)
    return {
        Game: state.Game,
        Team: state.Team,
        Loading: state.Loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Props & DispatchProps>, ownProps: any) => {
    return {
        testUpdate: () =>  {
            dispatch(
                {
                    type: Actions.ACTION_TYPES.GAME_SAVED,
                    payload: {Slug: "hello"}
                }
            )  
        }      
    }
}
/**testUpdate: () =>  {
            dispatch(
                Actions.testUpdate()
            )  
        }   */

const Root = connect<Props, any>(mapStateToProps, mapDispatchToProps)(Games);
export default Root;