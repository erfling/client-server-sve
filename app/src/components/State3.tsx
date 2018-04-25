import * as React from 'react';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Button, Row, Col, Icon, Input, Checkbox } from 'antd';
import INation from '../../../shared/models/INation';
import { Ratings } from '../../../api/src/models/Ratings';
import ScrollyContainer from './ScrollyContainer';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import { ACTION_TYPES } from '../actions/Actions';

interface State3Props {
    CurrentPlayer: ITeam
    getPlayer: () => {}
    match: any;
    SocketConnected: boolean;
}

interface State3State {
    Completed3A: boolean;
    Value3A: string;
    Completed3B: boolean;
    Value3B: string;
    Value3C: string[];
    Value3D: string;
    Advance3C: boolean;
    Completed3C: boolean;
    Completed3D: boolean;
    PlayerNotFound: boolean;
}

const zoomer = require("../img/zoom-planet.png");
export default class State3 extends React.Component<State3Props, State3State> {

    componentDidMount() {
        this.setState({ Completed3A: false, Value3C: ["", "", "", "", "", ""], Advance3C: false })
        if (!this.props.CurrentPlayer) {
            if (localStorage.getItem("SVE_PLAYER")) {
                this.props.getPlayer();
            } else {
                this.setState({ PlayerNotFound: true })
            }
        } else {
            console.log("CURRENT PLAYER ALREADY IN REDUX STORE")
        }
        //window. To(0, 0);

    }

    componentDidUpdate(prevProps: State3Props, prevState: State3State) {
        if (this.state && !this.state.Completed3D && this.props.CurrentPlayer.GameWon) {
            this.setState(Object.assign({}, this.state, { Completed3D: true }));
        }
    }

    submitSubRoundCompletion(subRoundCompleted: number) {
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/round3subroundcomplete";

        var teamToSubmit = Object.assign({}, this.props.CurrentPlayer, { HighestRoundThreeCompletion: subRoundCompleted })
        console.log("ABOUT TO SEND TO SERVER: ", teamToSubmit);
        fetch(
            URL,
            {
                method: "POST",
                body: JSON.stringify(teamToSubmit),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
            .then(r => r.json())
            .then(r => {
                console.log("Victory submitted", r)
            })
    }

    submitVitory() {
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/gamewon";
        fetch(
            URL,
            {
                method: "POST",
                body: JSON.stringify(this.props.CurrentPlayer),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
            .then(r => r.json())
            .then(r => {
                console.log("Victory submitted", r)
            })
    }

    evaluateState1(): string {
        var val: string = '';
        switch ((this.props.CurrentPlayer.Nation as INation).Name) {
            case "Australia":
                val = "India"
                break;
            case "Bangladesh":
            case "India":
                val = "Bangladesh"
                break
            case "China":
                val = "Japan"
                break
            case "Japan":
                val = "Australia"
                break
            case "Vietnam":
                val = "China"
                break
        }
        return val.toUpperCase();
    }

    render() {

        const getState3Content = (): any => {
            switch (this.props.CurrentPlayer.TeamNumber) {
                case (1):
                    return <p>Cumulative projected temp increase by 2100:<br /> (Cumulative Emissions - Negative Emissions) / 1,000</p>;
                case (2):
                    return <p>Cumulative carbon emitted by coal:<br /> 745 Gigatons of Carbon (GtC)</p>;
                case (3):
                    return <p>Cumulative carbon emitted by oil and gas:<br /> 502 Gigatons of Carbon (GtC)</p>;
                case (4):
                    return <p>Cumulative carbon emitted by all sources other than coal, oil and gas:<br /> 378 Gigatons of Carbon (GtC)</p>;
                case (5):
                    return <p>Cumulative carbon captured by negative emissions technologies:<br /> 125 Gigatons of Carbon (GtC)</p>;
                case (6):
                    return <p>Number of Years Above 2 Degrees:<br />(Cumulative Projected Temp Increase by 2100) X 20</p>;
            }
            return "";
        }

        if (!this.props.CurrentPlayer) return <div>Should go to login<Redirect to="/" /></div>
        if (!this.state) return <div></div>
        return (
            <GameWrapper
                HeaderText=""
                match={this.props.match}
                CurrentPlayer={this.props.CurrentPlayer}
                ParallaxImg=""
                HideImage={true}
            >
                {!this.state.Completed3B && !this.props.CurrentPlayer.GameWon && (!this.props.CurrentPlayer.HighestRoundThreeCompletion || this.props.CurrentPlayer.HighestRoundThreeCompletion < 1) &&
                    <ScrollyContainer
                        Active={true}
                        WasActive={this.state.Completed3A || (this.props.CurrentPlayer.HighestRoundThreeCompletion != undefined || this.props.CurrentPlayer.HighestRoundThreeCompletion > 1)}
                        BackgroundColor={this.state.Value3A && this.state.Value3A.toUpperCase() == this.evaluateState1() ? "#64c766" : "#f7f7f7"}
                    >
                        <Col xs={20} lg={8}>
                            <Col xs={24}>
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    disabled={this.state.Value3A && this.state.Value3A.toUpperCase() == this.evaluateState1()}
                                    prefix={<Icon type="lock" style={
                                        {
                                            color: !this.state.Value3A || this.state.Value3A.toUpperCase() != this.evaluateState1() ? 'rgba(0,0,0,.25)' : 'green',
                                            transition: 'all .5sec'
                                        }
                                    } />}
                                    onChange={e => {
                                        this.setState(Object.assign({}, this.state, { Value3A: e.target.value }))

                                        setTimeout(() => {
                                            if (this.state.Value3A && this.state.Value3A.toUpperCase() == this.evaluateState1()) {
                                                this.submitSubRoundCompletion(1);
                                                (document.activeElement as HTMLFormElement).blur();
                                                setTimeout(() => this.setState(Object.assign({}, this.state, { Completed3A: true })), 1000)
                                            }
                                        }, 1)
                                    }
                                    }
                                />
                            </Col>
                        </Col>
                    </ScrollyContainer>
                }
                {this.state.Completed3A
                    || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion == 1)
                    && !this.props.CurrentPlayer.GameWon ?

                    <ScrollyContainer
                        BackgroundColor={(this.state.Value3B && this.state.Value3B.toUpperCase() == "30") ? "#64c766" : "#f7f7f7"}
                        Active={this.state.Completed3A || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion == 1)}
                        WasActive={this.state.Completed3B || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion > 1)}
                    >

                        <Col xs={20} lg={20}>
                            <p>
                                <p>
                                    Congratulations on reducing the projected temperature in 2100 through clever deal making in the previous round. However, based on current projections there are still several years in which the temperature is more than 2 degrees Celsius above pre-industrial levels, which is above the Paris Accord level. Compute the number of years above 2 degrees.
                                </p>
                            </p>
                            <p><p style={{ fontSize: '110%' }}>{getState3Content()}</p></p>
                            <Input
                                placeholder="Years 2 Degrees Above"
                                type="number"
                                disabled={this.state.Value3B && this.state.Value3B.toUpperCase() == "30"}
                                prefix={<Icon type="lock" style={
                                    {
                                        color: !this.state.Value3B || this.state.Value3B.toUpperCase() != "30" ? 'rgba(0,0,0,.25)' : 'green',
                                        transition: 'all .5sec'
                                    }
                                } />}
                                onChange={e => {
                                    this.setState(Object.assign({}, this.state, { Value3B: e.target.value }))

                                    setTimeout(() => {
                                        if (this.state.Value3B && this.state.Value3B.toUpperCase() == "30") {
                                            this.submitSubRoundCompletion(2);
                                            (document.activeElement as HTMLFormElement).blur();
                                            setTimeout(() => this.setState(Object.assign({}, this.state, { Completed3B: true })), 1000);
                                        }
                                    }, 1)
                                }
                                }
                            />
                        </Col>
                    </ScrollyContainer> : null
                }
                {this.state.Completed3B
                    || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion == 2)
                    && !this.props.CurrentPlayer.GameWon ?
                    <ScrollyContainer
                        BackgroundColor={this.state.Advance3C ? "#64c766" : "#f7f7f7"}
                        Active={this.state.Completed3B || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion == 2)}
                        WasActive={this.state.Completed3C || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion > 2)}
                    >
                        <Row
                            type="flex"
                            justify="center"
                        >
                            <Col xs={22}>
                                <p>
                                    <p>
                                        Decrease the number of years above two degrees by entering the six word passphrase. Check your button so you can get a clue to the passphrase.
                                </p>
                                </p>
                            </Col>
                            <Col xs={22}>


                                {this.state.Value3C.map((s, i) => {
                                    return <Row>
                                        <Col xs={22}>
                                            <Input
                                                className={"input" + i}
                                                prefix={<Icon type="lock" style={
                                                    {
                                                        color: !this.state.Value3C || this.state.Value3C[i].toUpperCase() != "TOGETHER WE WILL SAVE THE PLANET".split(" ")[i] ? 'rgba(0,0,0,.25)' : 'green',
                                                        transition: 'all .5sec'
                                                    }
                                                } />}
                                                disabled={this.state.Value3C[i].toUpperCase() == "TOGETHER WE WILL SAVE THE PLANET".split(" ")[i]}
                                                style={{ padding: '10px 0' }}
                                                onChange={e => {
                                                    this.setState(Object.assign({}, this.state, {
                                                        Value3C: this.state.Value3C.map((v, j) => {
                                                            return i == j ? e.target.value.toUpperCase() : v;
                                                        })
                                                    }))
                                                    if (e.target.value.toUpperCase() == "TOGETHER WE WILL SAVE THE PLANET".split(" ")[i]) {
                                                        var elClass = ".input" + (i + 1)
                                                        var el: HTMLSpanElement = document.querySelector(elClass);
                                                        if (el) {
                                                            var formEl: HTMLInputElement = el.querySelector("input");
                                                            if (formEl) formEl.focus();
                                                        }
                                                    }

                                                }}
                                            />
                                        </Col>
                                    </Row>
                                })}
                                <Button
                                    style={{
                                        marginTop: '30px',
                                    }}
                                    className="checker"
                                    type="primary"
                                    size="large"
                                    onClick={e => {
                                        var checkbox: HTMLFormElement = document.querySelector(".checkbox-3C");
                                        if (checkbox) checkbox.click();
                                    }}
                                    disabled={!this.state.Value3C || this.state.Value3C.join("").toUpperCase() != "Together we will save the planet".toUpperCase().replace(/ /g, '')}
                                >
                                    <Checkbox
                                        className="checkbox-3C"
                                        disabled={!this.state.Value3C || this.state.Value3C.join("").toUpperCase() != "Together we will save the planet".toUpperCase().replace(/ /g, '')}
                                        onChange={e => setTimeout(() => {
                                            this.submitSubRoundCompletion(3);
                                            this.setState(Object.assign({}, this.state, { Advance3C: true }));
                                            (document.activeElement as HTMLFormElement).blur();
                                            setTimeout(() => this.setState(Object.assign({}, this.state, { Completed3C: true })), 1000)

                                        }, 1)}
                                    ><span>CHECK YOUR BUTTON</span></Checkbox>
                                </Button>
                            </Col>
                        </Row>
                    </ScrollyContainer> : null
                }
                {this.state.Completed3C
                    || (this.props.CurrentPlayer.HighestRoundThreeCompletion
                        && this.props.CurrentPlayer.HighestRoundThreeCompletion == 3)
                    || this.props.CurrentPlayer.GameWon ?
                    <ScrollyContainer
                        className={this.props.CurrentPlayer.GameWon ? "victory" : null}
                        BackgroundColor={this.state.Completed3D ? "#000" : "#f7f7f7"}
                        Active={this.state.Completed3C || this.props.CurrentPlayer.GameWon || (this.props.CurrentPlayer.HighestRoundThreeCompletion && this.props.CurrentPlayer.HighestRoundThreeCompletion == 3)}
                    >
                        <Row
                            type="flex"
                            justify="center"
                            style={{ width: '100vh' }}
                        >
                            {!this.state.Completed3D &&
                                <Col xs={20}>

                                    <p>
                                        <p>
                                            Engage the rest of the world in solving the problem: it will take more than one region. Do this by entering the 30-character global cooperation code. You can discover this code by arranging the images in the file in the fourth flip.
                                </p>

                                    </p>
                                    <Input.TextArea
                                        placeholder="Passphrase"
                                        disabled={this.state.Completed3D}
                                        onChange={(e) => {
                                            var complete = e.target.value.toUpperCase().replace(/ /g, '') == "ZOOMOUT&YOUCANSEETHEBIGPICTURE";
                                            this.setState(Object.assign({}, this.state, {
                                                Value3D: e.target.value.toUpperCase().replace(/ /g, ''),
                                                Completed3D: complete
                                            }))
                                            if (complete) this.submitVitory();
                                        }
                                        }
                                    ></Input.TextArea>
                                </Col>
                            }

                            {this.state.Completed3D &&
                                <Col xs={24} style={{ width: '100vh' }}>
                                    <img src={zoomer} className="zoom" />
                                    <p className="zoom-text">
                                        <p>
                                            Together, you saved the planet!
                                    </p>
                                    </p>
                                </Col>}
                        </Row>
                    </ScrollyContainer> : null
                }
            </GameWrapper>
        )

    }
}
