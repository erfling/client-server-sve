import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import ITeam from '../../../shared/models/ITeam';
import WaterForm from './form-elements/WaterForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Row, Col, Select, Button } from 'antd';
import Horse from '-!svg-react-loader?name=Icon!../img/horse.svg';
require('smoothscroll-polyfill').polyfill();

const City = require("../img/Drought_water_city.jpg");

interface State1Props {
    CurrentPlayer: ITeam
    getPlayer: () => {}
    setWaterValues: (team: ITeam) => {}
    match: any;
}
export default class State1 extends React.Component<State1Props, { PlayerNotFound: boolean, ChosenHorse: string, FeedBack: string[][], Decided: boolean }> {
    componentWillMount() {
        this.setState({ PlayerNotFound: false, ChosenHorse: null })
    }

    componentDidMount() {

        if (!this.props.CurrentPlayer) {
            if (localStorage.getItem("SVE_PLAYER")) {
                this.props.getPlayer()
                console.log(this.props.CurrentPlayer);
            } else {
                this.setState({ PlayerNotFound: true })
            }
        } else {
            console.log("CURRENT PLAYER ALREADY IN REDUX STORE")
        }
        window.scrollTo(0, 0);

        this.getResults();
    }

    setDecisionState(e: string) {
        this.setState(Object.assign({}, this.state, { Decided: true }));
        console.log(document.querySelector(".decided-messaged"));
        setTimeout(() => document.querySelector(".decided-messaged").scrollIntoView({ behavior: "smooth" }), 500);
    }

    getResults() {
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/getWaterResuls";

        fetch(
            URL
        )
            .then(r => r.json())
            .then(r => {
                this.setState(Object.assign({}, this.state, { FeedBack: r }))
            })
    }

    replaceWinner() {
        const teamFeedBack = this.state.FeedBack.filter(f => f[0] && f[0].toUpperCase() == this.state.ChosenHorse.toUpperCase())
        console.log(teamFeedBack);
        return teamFeedBack[0].filter((content, i) => i != 0 && i < 5)
            .map(content => content.startsWith("^") ? teamFeedBack[0][5] : content.substr(1))
    }


    render() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const future = new Date(year + 20, month, day);

        const getLabel = (i: number): string => {

            switch (i) {
                case 0:
                    return "War"
                case 1:
                    return "Disease "
                case 2:
                    return "Poverty"
                case 3:
                    return "Famine"
                default:
                    break;
            }

            return "";
        }

        if (!this.props.CurrentPlayer) return <div>Should go to login<Redirect to="/" /></div>
        return (
            <GameWrapper
                ParallaxImg={City}
                HeaderText="Who Gets The Water?"
                match={this.props.match}
                CurrentPlayer={this.props.CurrentPlayer}
            >
                <Row type="flex" justify="center">
                    <Col xs={24}>
                        {this.props.CurrentPlayer.GameState == "1A"
                            ? <Row type="flex" justify="center">
                                <Col xs={23}>
                                    {this.state.FeedBack && this.state.FeedBack[12][2]
                                        .split("\n")
                                        .filter(content => content.length)
                                        .map((content: string) => {
                                            return content == content.toUpperCase() ? <h3>{content}</h3> : <p>{content}</p>
                                        })}

                                    <Row className="formWrapper">
                                        <h4 className="decided-messaged" style={{ margin: "10px 0 20px" }}>{this.state.Decided && <span>You selected {this.state.ChosenHorse}. Change your mind? If so, simply choose again</span>}</h4>
                                        <Select
                                            style={{ width: '100%' }}
                                            onChange={e => this.setState(Object.assign({}, this.state, { ChosenHorse: e, Decided: false }))}
                                            placeholder="Who gets the water?"
                                        >
                                            <Select.Option value="Agriculture">Agriculture</Select.Option>
                                            <Select.Option value="Government">Government</Select.Option>
                                            <Select.Option value="Healthcare">Healthcare</Select.Option>
                                            <Select.Option value="Industry">Industry</Select.Option>
                                        </Select>
                                        <Button style={{ margin: "10px 0 50px" }} className="game-button block" onClick={e => this.setDecisionState(this.state.ChosenHorse)}>Commit Decision</Button>
                                    </Row>
                                </Col>
                            </Row> : null}

                        {this.props.CurrentPlayer.GameState == "1B" &&
                            <Row style={{ minHeight: '25vh', marginTop: '-19px' }}>
                                <Col xs={24}>
                                    {this.state.Decided &&
                                        this.state.FeedBack ?
                                        <Row className="state1results">
                                            {this.state.FeedBack.filter(f => f[0] && f[0].toUpperCase() == this.state.ChosenHorse.toUpperCase())
                                                .map(f => {
                                                    return f.filter((c, i) => i != 0 && i != 5).map((c, i) => {
                                                        return <Row className={c.charAt(0) == "^" && this.props.CurrentPlayer.GameState != "1C" ? "winner" : null}>
                                                            <div>
                                                                <Horse />
                                                                <p>
                                                                    {getLabel(i)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p>{c.substring(1, c.length)}</p>
                                                            </div>
                                                        </Row>
                                                    })
                                                })}
                                        </Row> : null}
                                </Col>
                            </Row>
                        }

                        {this.props.CurrentPlayer.GameState == "1C" &&
                            <Row style={{ minHeight: '25vh', marginTop: '-19px' }}>
                                <Col xs={24}>
                                    {this.state.Decided &&
                                        this.state.FeedBack ?
                                        <Row>
                                            <Row className="state1results">
                                                {this.replaceWinner()
                                                    .map((c: string, i) => {
                                                        return <Row className={c.indexOf("The fourth horseman has arrived") != -1 ? "former-winner" : null}>
                                                            <div>
                                                                <Horse />
                                                                <p>
                                                                    {getLabel(i)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p>{c}</p>
                                                            </div>
                                                        </Row>

                                                    })}
                                            </Row>
                                        </Row> : null}
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </GameWrapper>
        )

    }
}