import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Col, Row } from 'antd';
//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import { ACTION_TYPES } from '../actions/Actions';
import ITeam from '../../../shared/models/ITeam';
import {
    DiscreteColorLegend,
    RadialChart,
    Hint
} from 'react-vis';

interface ValidSubmissionProps {
    NumTeams: number;
    TeamsCompleted: string[];
}



export class ValidSubmissions extends React.Component<ValidSubmissionProps, {chartData:any}> {

    componentDidUpdate(){
        /*if(this.props.TeamsCompleted && ){

        }*/
    }

    render() {
        const chartData = [{angle: this.props.NumTeams - this.props.TeamsCompleted.length, className: "incomplete"}, {angle: this.props.TeamsCompleted.length, className: "complete"}];

        return <div>
                    <div>
                        <div>
                            <RadialChart
                                className="completion-chart"
                                data={chartData}
                                width={100}
                                height={100} 
                            />
                        </div>
                        <div>
                            <h2 style={{margin: '0 0 0 10px'}}>
                                {this.props.TeamsCompleted ? this.props.TeamsCompleted.length : 0} of {this.props.NumTeams} Teams have submitted.
                            </h2>
                        </div>
                    </div> 
                </div>               
    }
}

const mapStateToProps = (state: ApplicationStore, ownProps: {}): ValidSubmissionProps => {
    return {
        NumTeams: state.GameData.CompletionStatus.NumTeams,
        TeamsCompleted: state.GameData.CompletionStatus.TeamsCompleted
    };
};

const ValidSubmissionsContainer = connect<ValidSubmissionProps, {}>(mapStateToProps, {})(ValidSubmissions);
export default ValidSubmissionsContainer;
