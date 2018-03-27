import * as React from "react";
import GameWrapper from './GameWrapper';
import '../style/app.scss';
import { Row, Col, Button, Icon } from 'antd';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import ITeam from '../../../shared/models/ITeam';
import TopBar from '../containers/TopBarContainer'
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
        if(localStorage.getItem("TwentyMinutesFromNow")){
            this.setState(Object.assign({}, { TwentyMinutesFromNow: parseInt(localStorage.getItem("TwentyMinutesFromNow")), TimesUp: false }))
            setTimeout(() => this.startTimer(), 100);
        }
    }

    startTimer() {
        if(!this.state || !this.state.TwentyMinutesFromNow){
            var twentyMinutesLater = Date.now() + 120000000;
            localStorage.setItem("TwentyMinutesFromNow", twentyMinutesLater.valueOf().toString())
            var TwentyMinutesFromNow = twentyMinutesLater.valueOf();
            this.setState(Object.assign({}, { TwentyMinutesFromNow, TimesUp: false, }))
        }
        var timer = setInterval(this.countDown.bind(this), 1000)
        this.setState(Object.assign({}, { Timer: timer }));
    }

    secondsToTime(time: number) {

        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 3600 % 60);

        var mDisplay = m > 9 ? m + ":" : "0" + m + ":";
        var sDisplay = s > 9 ? s : "0" + s;

        return mDisplay + sDisplay;
    }

    componentDidMount() {


    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        clearInterval(this.state.Timer);
    }
    //TODO: store initial time in localStorage
    countDown() {
        if (this.state) {
            var now = Date.now();
            console.log(this.state.TwentyMinutesFromNow, this.state.TwentyMinutesFromNow - now);
            let time = this.secondsToTime((this.state.TwentyMinutesFromNow - now));
            this.setState(Object.assign({}, this.state, { Now: time }))
            if (this.state.TwentyMinutesFromNow - now <= 0) {
                clearInterval(this.state.Timer);
                this.setState({ TimesUp: true, Now: "00:00" });
            }
        } else {
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
            <Row>
                <TopBar>
                    {this.state && this.state.Now ? <h4 style={{ marginTop: '-18px' }}>{this.state.Now}</h4> : null}
                    {!this.state || !this.state.Now ? <Button
                        onClick={e => this.startTimer()}
                        className="topbar-button"
                    >
                        Start Timer
                    </Button> : null}
                </TopBar>
                <Row type="flex" justify="center" align="middle" className="intermission-content" style={{ minHeight: '100vh' }}>
                    <Col xs={22}>
                        <p>
                            <p style={{
                                fontWeight: "bold",
                                opacity: this.state && this.state.TimesUp ? 1 : 0,
                                maxHeight: this.state && this.state.TimesUp ? "10vh" : "0",
                                fontSize:'220%',
                                transition: "all 1s"
                            }}>Time has expired.</p>                                
                            

                            <p>What was your systemic leverage point?</p>
                            <p>Where is your team on stability/agility matrix?</p>
                            <p>What connections are you seeing?</p>
                            <p>What are you thinking/feeling?</p>
                            <p>What are you considering doing differently when you return?</p>
                            <p>What questions do you have for the group or the facilitators when we return?</p>
                        </p>
                    </Col>
                </Row>
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
