import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import RatingsForm from './form-elements/RatingsForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'antd';
import IRatings from '../../../shared/models/IRatings';
import INation from '../../../shared/models/INation';
import { Ratings } from '../../../api/src/models/Ratings';
import ChartContainer from '../containers/ChartContainer'
import TopBarContainer from '../containers/TopBarContainer';
import { CriteriaName } from '../../../shared/models/CriteriaName';

const WOTW = require("../img/The-War-of-the-Worlds-Radio-Broadcast.jpg");
const NY = require("../img/The_New_Yorker_logo.png");
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
export default class State3 extends React.Component<State3Props, { PlayerNotFound: boolean, Ratings:string[] }> {

    componentDidMount() {
        this.setState({ PlayerNotFound: false })
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
        //window.scrollTo(0, 0);
    }

    componentDidUpdate() {
        console.log("did updated called", this.props.SocketConnected, this.props.DaysAbove2)
        this.getData();
        if(this.props.CurrentPlayer && !this.state.Ratings)this.getRatings();
    }

    getData() {
        if (this.props.SocketConnected && !this.props.DaysAbove2 && this.props.CurrentPlayer) {
            this.props.getDaysAbove(this.props.CurrentPlayer);
        }
    }

    prepareRatings(formValues: any) {
        var ratings: IRatings = {};
        Object.keys(formValues).forEach((o: string) => {
            var nation: string = o.split("_")[0];
            if (!(ratings as any)[nation]) (ratings as any)[nation] = {};
            (ratings as any)[nation][o.substr(nation.length + 1)] = formValues[o];
        })
        this.props.submitRatings(Object.assign(this.props.CurrentPlayer, { Ratings: ratings }));
    }

    getRatings(){
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/sheets/ratings";
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
        .then( r => r.json() )
        .then(r => {
            console.log("RATINGS RETURNED", r)
            this.setState(Object.assign({}, this.state, {Ratings: r}))
        })
    }

    render() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const future = new Date(year + 20, month, day);
        if (!this.props.CurrentPlayer) return <div>Should go to login<Redirect to="/" /></div>
        return (
            this.props.CurrentPlayer && <GameWrapper
                ParallaxImg={WOTW}
                HeaderText="War Of The Worlds"
                match={this.props.match}
                CurrentPlayer={this.props.CurrentPlayer}
                HideImage={true}
            >
                {this.props.DaysAbove2 && this.props.SocketConnected ?
                    <TopBarContainer /> : null
                }
                <Col xs={24} style={{ paddingLeft: '13px' }}>
                    <h1 style={{ marginTop: "50px", textAlign: "center" }}>{(this.props.CurrentPlayer.Nation as INation).Name}</h1>
                    <ChartContainer />
                </Col>
                {this.props.CurrentPlayer.GameState == "3B"
                    ?
                    <Row className="form-wrapper" gutter={{ lg: "1", xl: "1" }}>
                        <Col sm={23} md={23} lg={23}>
                            <RatingsForm onSubmit={this.prepareRatings.bind(this)} />
                        </Col>
                    </Row>
                    :
                    this.props.CurrentPlayer.GameState == "3A" ?
                    <Row className="form-wrapper" gutter={{ lg: "1", xl: "1" }}>
                        <h3><img src={NY} style={{ maxWidth: '100%' }} /></h3>
                        <h3>DECEIVING THE NATION</h3>
                        <p style={{ fontWeight: "lighter", textAlign: "center" }}>By Akwugo St. Claire,&nbsp; February 22, {new Date().getFullYear() + 2}</p>

                        {this.props.StateContent ? <Col sm={23} md={23} lg={12}>
                            {this.props.StateContent[0][0].split("\n").map((c: string, i: number) => {
                                return c == c.toUpperCase() ? <h3>{c}</h3> : i == 0 ? <p><em><strong>{c}</strong></em></p> : <p>{c}</p>
                            })}
                        </Col>
                            : <span>{this.props.getContent(this.props.CurrentPlayer)}</span>}

                    </Row> : null
                }

                {this.props.CurrentPlayer.GameState == "3C" && this.state && this.state.Ratings
                    ?
                    <Row className="form-wrapper" gutter={{ lg: "1", xl: "1" }}>
                        <h2>Your Ratings</h2>
                        <Col sm={23} md={23} lg={23}>
                            {this.state.Ratings.slice(1).map((r, i) => {
                                return <Row>
                                    <h4>{Object.keys(CriteriaName)[i].split("_").map(c => c.charAt(0).toUpperCase() + c.slice(1).toLocaleLowerCase() ).join("_").replace(/_/g, ' ') + ": " + Math.round( parseFloat(r) * 10 ) / 10}</h4>
                                </Row>
                            })}
                        </Col>
                    </Row>
                    :
                    null
                }

            </GameWrapper>
        )

    }
}