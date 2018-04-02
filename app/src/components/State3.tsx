import * as React from 'react';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Button, Row, Col, Icon, Input, Checkbox } from 'antd';
import INation from '../../../shared/models/INation';
import { Ratings } from '../../../api/src/models/Ratings';
import ScrollyContainer from './ScrollyContainer';

interface State3Props {
    CurrentPlayer: ITeam
    getPlayer: () => {}
    setWaterValues: (team: ITeam) => {}
    submitRatings: (formValues: any) => {}
    getContent: (team: ITeam) => {}
    getDaysAbove: (team: ITeam) => {}
    match: any;
    StateContent: any;
    DaysAbove2: number;
    SocketConnected: boolean;
}

interface State3State {
    Completed3A: boolean;
    Value3A: string;
    Completed3B: boolean;
    Completed3C: boolean;
    Completed3D: boolean;
    PlayerNotFound: boolean;
}

export default class State3 extends React.Component<State3Props, State3State> {

    componentDidMount() {
        this.setState({ Completed3A: false })
        if (!this.props.CurrentPlayer) {
            if (localStorage.getItem("SVE_PLAYER")) {
                this.props.getPlayer();
            } else {
                this.setState({ PlayerNotFound: true })
            }
        } else {
            console.log("CURRENT PLAYER ALREADY IN REDUX STORE")
            this.props.getContent(this.props.CurrentPlayer)
        }
        //window. To(0, 0);

    }

    componentDidUpdate() {
        this.getData();
        //if(this.props.CurrentPlayer && !this.state.Ratings)this.getRatings();
    }

    getData() {
        if (this.props.SocketConnected && !this.props.DaysAbove2 && this.props.CurrentPlayer) {
            this.props.getDaysAbove(this.props.CurrentPlayer);
        }
    }


    getRatings() {
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/sheets/ratings";
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
                console.log("RATINGS RETURNED", r)
                this.setState(Object.assign({}, this.state, { Ratings: r }))
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
                <ScrollyContainer
                    Active={!this.state.Completed3A}
                    BackgroundColor={this.state.Value3A && this.state.Value3A.toUpperCase() == this.evaluateState1() ? "#64c766" : "#1790ff"}
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
                                        if (this.state.Value3A) console.log(this.state.Value3A.toUpperCase(), this.evaluateState1(), this.state.Value3A.toUpperCase() == this.evaluateState1());
                                        if (this.state.Value3A && this.state.Value3A.toUpperCase() == this.evaluateState1()) {
                                            setTimeout(() => this.setState(Object.assign({}, this.state, { Completed3A: true })), 1000)
                                        }
                                    }, 1)
                                }
                                }
                            />
                        </Col>
                    </Col>
                </ScrollyContainer>

                <ScrollyContainer
                    BackgroundColor="#3129FF"
                    Active={this.state.Completed3A}
                >

                    <Button
                        className="checker"
                        type="dashed"
                    >
                        <Checkbox>Check your button</Checkbox>
                    </Button>
                </ScrollyContainer>

                <ScrollyContainer
                    BackgroundColor="#1790ff"
                    Active={this.state.Completed3B}
                >
                    <p><p>Check your button</p></p>
                    
                </ScrollyContainer>

                <ScrollyContainer
                    BackgroundColor="#3129FF"
                    Active={this.state.Completed3C}
                >
                    <p><p>3D Content goes here</p></p>
                </ScrollyContainer>

            </GameWrapper>
        )

    }
}
/**suffix={suffix}
                       */