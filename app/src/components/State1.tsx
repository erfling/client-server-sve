import * as React from 'react';
import ITeam from '../../../shared/models/ITeam';
import WaterForm from './form-elements/WaterForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Row, Col, Select, Button, Alert, Icon, Radio } from 'antd';
const RadioGroup = Radio.Group;
import ChartContainer from '../containers/ChartContainer';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import { ACTION_TYPES } from '../actions/Actions';

import Horse from '-!svg-react-loader?name=Icon!../img/horse.svg';
require('smoothscroll-polyfill').polyfill();

const City = require("../img/Drought_water_city.jpg");

// COMPONENT //
///////////////

interface State1Props {
    CurrentPlayer: ITeam
    getPlayer: () => {}
    setWaterValues: (team: ITeam) => {}
    match: any;
}

export class State1 extends React.Component<State1Props, { PlayerNotFound: boolean, Selection: string, ChosenHorse: string, PendingChoice: string, FeedBack: string[][], Decided: boolean }> {
    componentWillMount() {
        this.setState({ PlayerNotFound: false, ChosenHorse: null })
    }

    componentDidMount() {

        if (!this.props.CurrentPlayer) {
            if (localStorage.getItem("SVE_PLAYER")) {
                this.props.getPlayer()
                console.log(this.props.CurrentPlayer);
                if (this.props.CurrentPlayer && this.props.CurrentPlayer.ChosenHorse)
                    this.setState(Object.assign(this.state, { Selection: this.props.CurrentPlayer.ChosenHorse }))
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

        //set choice as the one being sent to server
        this.setState(Object.assign(this.state, { PendingChoice: e }))
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/chooseHorse";
        fetch(
            URL,
            {
                method: "POST",
                body: JSON.stringify(Object.assign(this.props.CurrentPlayer, { ChosenHorse: e })),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
            .then(r => r.json())
            .then(r => {
                this.setState(Object.assign({}, this.state, { PendingChoice: null }))
            })

        //

        this.setState(Object.assign({}, this.state, { Decided: true }));
        var elem = document.querySelector(".decided-messaged");
        if (elem) setTimeout(() => document.querySelector(".decided-messaged").scrollIntoView({ behavior: "smooth" }), 500);
    }

    getResults() {
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol + "//" + window.location.hostname + port + "/sapien/api/getWaterResuls";

        fetch(
            URL
        )
            .then(r => r.json())
            .then(r => {
                this.setState(Object.assign({}, this.state, {
                    FeedBack: r,
                    Selection: this.props.CurrentPlayer && this.props.CurrentPlayer.ChosenHorse ? this.props.CurrentPlayer.ChosenHorse : null
                }))
                console.log(this.state);
            })
    }

    replaceWinner() {
        const teamFeedBack = this.state.FeedBack.filter(f => f[0] && f[0].toUpperCase() == this.props.CurrentPlayer.ChosenHorse.toUpperCase())
        console.log(teamFeedBack);
        return teamFeedBack[0].filter((content, i) => i != 0 && i < 5)
            .map(content => content.startsWith("^") ? teamFeedBack[0][5] : content.substr(1))
    }

    getIcon() {
        return <Icon type="loading" />
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
                        {this.props.CurrentPlayer.GameState == "1A" || !this.props.CurrentPlayer.ChosenHorse
                            ? <Row type="flex" justify="center">
                                <Col xs={24}>
                                    {this.state.FeedBack && this.state.FeedBack[12][2]
                                        .split("\n")
                                        .filter(content => content.length)
                                        .map((content: string) => {
                                            return content == content.toUpperCase() ? <h3>{content}</h3> : <p><p>{content}</p></p>
                                        })}

                                    <ChartContainer>
                                        Global Warming {this.props.CurrentPlayer && this.props.CurrentPlayer.GameState}
                                    </ChartContainer>
                                    <Row type="flex" justify="center">
                                        <Col xs={23}>
                                            {this.state.FeedBack && this.state.FeedBack[13][2]
                                                .split("\n")
                                                .filter(content => content.length)
                                                .map((content: string) => {
                                                    return content == content.toUpperCase() ? <h3>{content}</h3> : <p><p>{content}</p></p>
                                                })}
                                        </Col>
                                    </Row>
                                    <Row className="formWrapper bottom-form" type="flex" justify="center">
                                        <Col xs={22}>           
                                            <div className="big-radio-group">
                                                <label>Who gets the water?</label>

                                                <RadioGroup
                                                    value={this.props.CurrentPlayer.ChosenHorse || this.state.Selection || null}
                                                    disabled={this.props.CurrentPlayer.ChosenHorse != null}
                                                    onChange={e => this.setState(Object.assign(this.state, { Selection: e.target.value }))}>
                                                    {["Agriculture", "Government", "Healthcare", "Industry"]
                                                        .map(choice =>
                                                            <Radio value={choice}>{choice}</Radio>
                                                        )}
                                                </RadioGroup>
                                                <Button
                                                    style={{ margin: "30px 0 50px" }}
                                                    type="primary"
                                                    size="large"
                                                    disabled={!this.state.Selection || this.props.CurrentPlayer.ChosenHorse != null}
                                                    onClick={e => this.setDecisionState(this.state.Selection)}
                                                >
                                                    Commit Decision {this.state.PendingChoice != null && <Icon type="loading" />}
                                                </Button>
                                            </div>
                                        </Col>

                                        {this.props.CurrentPlayer.GameState != "1A" && !this.props.CurrentPlayer.ChosenHorse ?
                                            <Alert
                                                type="error"
                                                className="bottom-alert"
                                                style={{ margin: "10px 0 20px" }}
                                                message={<h4>Please make a selection.</h4>}>
                                            </Alert> : null}

                                    </Row>
                                </Col>
                            </Row> : null}

                        {this.props.CurrentPlayer.GameState == "1B" && this.props.CurrentPlayer.ChosenHorse ?
                            <Row style={{ minHeight: '25vh', marginTop: '-19px' }}>
                                <Col xs={24}>
                                    {this.state.FeedBack ?
                                        <Row className="state1results">
                                            {this.state.FeedBack.filter(f => f[0] && f[0].toUpperCase() == this.props.CurrentPlayer.ChosenHorse.toUpperCase())
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
                            </Row> : null
                        }

                        {this.props.CurrentPlayer.GameState == "1C" && this.props.CurrentPlayer.ChosenHorse ?
                            <Row style={{ minHeight: '25vh', marginTop: '-19px' }}>
                                <Col xs={24}>
                                    {this.state.FeedBack ?
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
                            </Row> : null
                        }
                    </Col>
                </Row>
            </GameWrapper>
        )

    }
}

// CONTAINER //
///////////////

interface DispatchProps {
    getPlayer: () => {}
    setWaterValues: (team: ITeam) => {}
    getPossibleResults: () => {}
}
export interface State1ContainerProps {
    CurrentPlayer: ITeam;
}

const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1ContainerProps => {
    return {
        CurrentPlayer: state.GameData.CurrentPlayer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        getPlayer: () => dispatch(Actions.getPlayer()),
        setWaterValues: (team: ITeam) => { dispatch(Actions.setWaterValues(team)) },
    }
}

const State1Container = connect<State1ContainerProps, {}>(mapStateToProps, mapDispatchToProps)(State1);
export default State1Container;
/* <div>
                                                    <div className="button-wrapper">
                                                        <Button
                                                            type={!this.props.CurrentPlayer.ChosenHorse || (this.props.CurrentPlayer.ChosenHorse && this.props.CurrentPlayer.ChosenHorse == choice) ? "primary" : "dashed"}
                                                            size="large"
                                                            onClick={e => this.setDecisionState(choice)}
                                                        >
                                                            Choose {choice}
                                                        </Button>
                                                    </div>
                                                    <div className="icon-wrapper">

                                                        {this.state.PendingChoice && this.state.PendingChoice == choice && !this.props.CurrentPlayer.ChosenHorse ? 
                                                            <Icon type="loading" /> : null
                                                        }
                                                        {this.props.CurrentPlayer.ChosenHorse && this.props.CurrentPlayer.ChosenHorse == choice ? 
                                                            <Icon type="check-circle-o" /> : null
                                                        }
                                                    </div>
                                                </div>
                                                 onChange={this.onChange} value={this.state.value}*/