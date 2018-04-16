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
    Value3B: string;
    Value3C: string;
    Value3D: string;
    Advance3C: boolean;
    Completed3C: boolean;
    Completed3D: boolean;
    PlayerNotFound: boolean;
}

export default class State3 extends React.Component<State3Props, State3State> {

    componentDidMount() {
        this.setState({ Completed3A: false, Value3C: "", Advance3C: false })
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

        const getState3Content = (): any => {
            switch (this.props.CurrentPlayer.TeamNumber) {
                case (1):
                    return <p>Cumulative projected temp increase by 2100:<br /> (Cumulative Emissions - Negative Emissions) / 1,000</p>;
                case (2):
                    return <p>Cumulative carbon emitted by coal:<br /> 745 Gigatons of Carbon (GtC)</p>;
                case (3):
                    return <p>Cumulative carbon emitted by oil and gas:<br /> 502 GtC</p>;
                case (4):
                    return <p>Cumulative carbon emitted by all sources other than coal, oil and gas:<br /> 378 GtC</p>;
                case (5):
                    return <p>Cumulative carbon captured by negative emissions technologies:<br /> 125 GtC</p>;
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
                <ScrollyContainer
                    Active={true}
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
                    BackgroundColor={(this.state.Value3B && this.state.Value3B.toUpperCase() == "30") ? "#64c766" : "#f7f7f7"}
                    Active={this.state.Completed3A}
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
                                        setTimeout(() => this.setState(Object.assign({}, this.state, { Completed3B: true })), 1000)
                                    }
                                }, 1)
                            }
                            }
                        />
                    </Col>




                </ScrollyContainer>

                <ScrollyContainer
                    BackgroundColor={this.state.Advance3C ? "#64c766" : "#f7f7f7"}
                    Active={this.state.Completed3B}
                >
                    <Row
                        type="flex"
                        justify="center"
                    >
                        <Col xs={20}>
                            <p>
                                <p>
                                    Decrease the number of years above two degrees by entering the six word passphrase. Check your button to discover a clue to the passphrase.
                                    <Button
                                        style={{ marginLeft: '5px' }}
                                        className="checker"
                                        type="primary"
                                        size="large"
                                        disabled={!this.state.Value3C || this.state.Value3C.toUpperCase() != "Together we will save the planet".toUpperCase().replace(/ /g, '')}
                                    >
                                        <Checkbox
                                            disabled={!this.state.Value3C || this.state.Value3C.toUpperCase() != "Together we will save the planet".toUpperCase().replace(/ /g, '')}
                                            onChange={e => setTimeout(() => {
                                                this.setState(Object.assign({}, this.state, { Advance3C: true }));
                                                setTimeout(() => this.setState(Object.assign({}, this.state, { Completed3C: true })), 1000)

                                            }, 1)}
                                        ></Checkbox>
                                    </Button>

                                </p>
                            </p>
                        </Col>
                        <Col xs={20}>
                            <Input.TextArea
                                placeholder="Passphrase"
                                onChange={(e) => {
                                    this.setState(Object.assign({}, this.state, {
                                        Value3C:  e.target.value.toUpperCase().replace(/ /g, '')
                                    }))
                                    console.log(e.target.value.toUpperCase(), this.state.Value3C);
                                }
                                }
                            ></Input.TextArea>
                        </Col>
                    </Row>
                </ScrollyContainer>

                <ScrollyContainer
                    BackgroundColor={this.state.Completed3D ? "#64c766" : "#f7f7f7"}
                    Active={this.state.Completed3C}
                >
                    <Row
                        type="flex"
                        justify="center"
                    >
                        <Col xs={20}>
                            <p>
                                <p>
                                    Engage the rest of the world in solving the problem: it will take more than one region. Do this by entering the 31-letter global cooperation code. You can discover this code by arranging the images in the file in the fourth flip.
                                </p>
                            </p>
                        </Col>
                        <Col xs={20}>
                            <Input.TextArea
                                placeholder="Passphrase"
                                disabled={this.state.Completed3D}
                                onChange={(e) => {
                                    this.setState(Object.assign({}, this.state, {
                                        Value3D: e.target.value.toUpperCase().replace(/ /g, ''),
                                        Completed3D: e.target.value.toUpperCase().replace(/ /g, '') == "ZOOMOUTSOYOUCANSEETHEBIGPICTURE"
                                    }))
                                    console.log(e.target.value.toUpperCase(), this.state.Value3C);
                                }
                                }
                            ></Input.TextArea>
                        </Col>
                    </Row>
                </ScrollyContainer>

            </GameWrapper>
        )

    }
}
/**suffix={suffix}
 * {this.state.Value3C.map((s, i) => {
                                return <Row>
                                    <Col xs={22}>
                                        <Input
                                            style={{padding: '40px 10px', marginBottom:'.5em'}}
                                            placeholder={"Passphrase " + (i + 1)}
                                            onChange={e => this.setState(Object.assign({}, this.state, {
                                                Value3C: this.state.Value3C.map((v, j) => {
                                                    return i == j ? e.target.value.toUpperCase() : v;
                                                })
                                            }))}
                                        />
                                    </Col>
                                </Row>
                            })}
                   
                                    <Col xs={2}>
                                        <p><p>{i + 1}.</p></p>
                                    </Col>    */