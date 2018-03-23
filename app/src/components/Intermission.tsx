import * as React from "react";
import GameWrapper from './GameWrapper';
import '../style/app.scss';
import { Row, Col } from 'antd';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import ITeam from '../../../shared/models/ITeam';
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export interface IntermissionProps {
    CurrentPlayer: ITeam;
    match: any
}
export class Intermission extends React.Component<IntermissionProps, { Now: any, TwentyMinutesFromNow: number, TimesUp: boolean, Timer: any }> {

    constructor(props: IntermissionProps) {
        super(props);
    }   

    componentWillMount() {
        var twentyMinutesLater = new Date().setSeconds(Date.now() + 12000000);
        var TwentyMinutesFromNow = twentyMinutesLater.valueOf();
        this.setState(Object.assign({}, { TwentyMinutesFromNow, TimesUp: false }))
    }

    secondsToTime(miliseconds: number) {  
        var time = miliseconds/1000;   
        var minutes = "0" + Math.floor(time / 60);
        var seconds = "0" + (time - parseInt(minutes) * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    }

    componentDidMount() {
        console.log("CALLED COMPONENT DID MOUNT IN INTERMISSION CMPNT", this.state.TwentyMinutesFromNow);
        var timer = setInterval(this.countDown.bind(this), 1000)
        this.setState(Object.assign({}, { Timer:  timer}));
    }

    componentDidUpdate() {
    }

    countDown() {
        if (this.state) {
            console.log("countdown");
            var now = Date.now();
            let time = this.secondsToTime(this.state.TwentyMinutesFromNow - now);
            this.setState(Object.assign( {}, this.state, { Now: time } ) )
            console.log(this.state.Now)
            if (this.state.TwentyMinutesFromNow - now == 0) {
                clearInterval(this.state.Timer);
                this.setState({ TimesUp: true });
            }
        } else {
            console.log("countdown without time");
        }
    }

    render() {
        return <GameWrapper
            HeaderText="Intermission"
            match={this.props.match}
            CurrentPlayer={this.props.CurrentPlayer}
            ParallaxImg=""
            HideImage={true}
        >
            <Row type="flex" justify="center" align="middle">
                <h3>{this.state && this.state.Now ? <p><p>{this.state.Now}</p></p> : null}</h3>
                <Col xs={22}>
                    <p>
                        <p>What was your systemic leverage point?</p>
                        <p>Where is your team on stability/agility matrix?</p>
                        <p>What connections are you seeing?</p>
                        <p>What are you thinking/feeling?</p>
                        <p>What are you considering doing differently when you return?</p>
                        <p>What questions do you have for the group or the facilitators when we return?</p>
                    </p>
                </Col>
            </Row>
        </GameWrapper>
    }
}

interface DispatchProps {
}
export interface IntermissionContainerProps {
    CurrentPlayer: ITeam
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): IntermissionContainerProps => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer
    };
};

const IntermissionContainer = connect<IntermissionContainerProps, {}>(mapStateToProps)(Intermission);
export default IntermissionContainer;
