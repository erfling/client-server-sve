import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import DealFormWrapper from './form-elements/DealForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Row, Col, Modal, Icon, Button, Select, Spin, List } from 'antd';
import ITradeOption from '../../../shared/models/ITradeOption';
import INation from '../../../shared/models/INation';
import ChartContainer from '../containers/ChartContainer'
import TopBarContainer from '../containers/TopBarContainer'

import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    DiscreteColorLegend,
    DiscreteColorLegendItem,
    Hint
} from 'react-vis';

interface State2Props {
    CurrentPlayer: ITeam;
    PendingDealOffer: IDeal;
    RejectedDealOffer: IDeal;
    AcceptedDealOffer: IDeal;
    //Options: ITradeOption[];
    getPlayer: () => {}
    proposeDeal: (deal: IDeal) => {}
    rejectDeal: (deal: IDeal) => {}
    acceptDeal: (deal: IDeal) => {}
    acknowledgeDealRejection: () => {}
    match: any;
    Dashboard: any;
    Round2Won: boolean;
}

interface IClientTradeOption {
    value: string;
    text: string;
}

const Beach = require("../img/Bangladesh_beach.jpeg")
export default class State2 extends React.Component<State2Props, { PlayerNotFound: boolean, ParallaxByNation: any, ShowChart: boolean, ChosenCountry: string, TradeOptions: string[], SelectionOptions: IClientTradeOption[], RejectedDeal: boolean, showVictoryModal: boolean, victoryModalShown: boolean }> {

    componentWillMount() {
        this.setState({ PlayerNotFound: false, ShowChart: false })
        console.log("LOCAL STORAGE FROM STATE 1 COMPONENT", localStorage)
        if (!this.props.CurrentPlayer) {
            if (localStorage.getItem("SVE_PLAYER")) {
                this.props.getPlayer()
            } else {
                this.setState({ PlayerNotFound: true })
            }
        }
        window.scrollTo(0, 0);
    }

    componentDidUpdate(){
        if(this.props.Dashboard && this.props.Dashboard.length > 100 && this.props.Dashboard[100] < 1 && !this.state.showVictoryModal && !this.state.victoryModalShown){
            this.setState(Object.assign({}, this.state, {
                showVictoryModal: true,
                victoryModalShown: true
            }));
        }
    }

    prepDeal() {
        var chosenOption = this.state.TradeOptions.filter(o => {
            console.log(o.toUpperCase(), this.state.ChosenCountry.toUpperCase())
            return o.toUpperCase().indexOf(this.state.ChosenCountry.toUpperCase()) != -1
        })[0] || null
        console.log(chosenOption, this.state.ChosenCountry.toUpperCase())
        var deal: IDeal = {
            CLASS_NAME: "Deal",
            FromTeamSlug: this.props.CurrentPlayer.Slug,
            FromNationName: (this.props.CurrentPlayer.Nation as INation).Name,
            ToNationName: this.state.ChosenCountry,
            Message: chosenOption
        }

        deal.Value = this.getTradeBank() / 10;
        
        console.log("WHAT'S THE DEAL?", deal)
        this.props.proposeDeal(deal);
    }

    rejectDeal(deal: IDeal) {
        this.props.rejectDeal(deal)
    }

    acceptDeal(deal: IDeal) {
        this.props.acceptDeal(deal)
    }
    
    getBodyClassName() {
        var temp = this.props.Dashboard[100];

        if (temp <= 0) {
            return "success";
        } else if (temp >= 2) {
            return "danger";
        } else {
            return "warning";
        }
    }

    getOptionsByTeam(): { value: string, text: string }[] {
        var options = [
            "Australia",
            "Bangladesh",
            "China",
            "India",
            "Japan",
            "Vietnam"
        ]   .filter(nation => nation != (this.props.CurrentPlayer.Nation as INation).Name)
            .map(s => {
                return {
                    text: "Invest $" + (this.props.CurrentPlayer.DealsProposedTo.length ? ((((this.props.CurrentPlayer.DealsProposedTo[0]) as IDeal).Value + 1) * 10) : "10") + " billion in " + s,
                    value: s
                }
            })
        return options;
    }

    getParsedData(data: number[] | string[] | number) {
        var parsedData: any[] = [];

        for (var i = 2000; i < 2101; i++) {

            let value = typeof data == "number" ? data : data[i - 2000];
            parsedData.push({
                x: i,
                y: typeof value == "string" ? parseFloat(value) : value
            })
        }
        return parsedData;
    }

    parseMessage(message: string) {
        return message.startsWith("#") ? message.substring(3).split("\n").map(s => <p>{s}</p>) : message.split("\n").map(s => <p>{s}</p>);
    }

    getTradeOptionContent() {
        var options = (this.props.CurrentPlayer.Nation as INation).Content[0].filter((c: string[], i: number) => {
            return i > 0 && i < 7 && c.length > 0;
        })
        this.setState(Object.assign({}, this.state, { TradeOptions: options }));

        return options;
    }

    getTradeBank() {
        if (this.props.CurrentPlayer.DealsProposedBy.length) return 0;
        return this.props.CurrentPlayer.DealsProposedTo.length ? ((this.props.CurrentPlayer.DealsProposedTo[0] as IDeal).Value + 1) * 10 : 10
    }

    render() {
        if (!this.props.CurrentPlayer) return <div />

        return this.props.CurrentPlayer &&
            this.props.CurrentPlayer.Nation && this.props.Dashboard ?
            <GameWrapper
                ParallaxImg={Beach}
                HeaderText="Who Gets The Money?"
                match={this.props.match}
                CurrentPlayer={this.props.CurrentPlayer}
            >
                
                <Row className={this.getBodyClassName() + " trades"} type="flex" justify="center">
                    {this.props.Dashboard &&
                        this.props.Dashboard.length > 100 ?
                        <TopBarContainer /> : null
                    }
                    <Col xs={24} style={{paddingLeft:'13px'}}>
                        <h1 style={{ marginTop: "50px", textAlign:"center" }}>{(this.props.CurrentPlayer.Nation as INation).Name}</h1>
                        {this.props.Dashboard && this.props.Dashboard.length > 100 ? <ChartContainer/> : null}
                    </Col>

                    {this.props.PendingDealOffer ?

                        <Modal
                            title={
                                this.props.PendingDealOffer.FromTeamSlug == this.props.CurrentPlayer.Slug
                                    ? <span>Your team offered a trade deal to {this.props.PendingDealOffer.ToNationName}.</span>
                                    : <span>{this.props.PendingDealOffer.FromNationName} wants to make a trade deal.</span>
                            }
                            visible={true}
                            width="95%"
                            footer={
                                this.props.PendingDealOffer.FromTeamSlug == this.props.CurrentPlayer.Slug
                                    ? [<Button type="danger" size="large" onClick={e => { this.rejectDeal(this.props.PendingDealOffer) }}>Rescind Deal</Button>]
                                    : [
                                        <Button type="primary" size="large" onClick={e => { this.acceptDeal(this.props.PendingDealOffer) }}>Accept Deal</Button>,
                                        <Button type="danger" size="large" onClick={e => { this.rejectDeal(this.props.PendingDealOffer) }}>Reject Deal</Button>
                                    ]
                            }
                        >
                            {this.parseMessage(this.props.PendingDealOffer.Message)}
                        </Modal> : null


                    }

                    {this.props.RejectedDealOffer ?

                        <Modal
                            title={
                                this.props.RejectedDealOffer.FromTeamSlug == this.props.CurrentPlayer.Slug
                                    ? <span>Your trade deal with {this.props.RejectedDealOffer.ToNationName} was rejected{this.props.RejectedDealOffer.CanAccept == false && " by the SVI"}.</span>
                                    : <span>Your trade deal with {this.props.RejectedDealOffer.FromNationName} was rejected{this.props.RejectedDealOffer.CanAccept == false && " by the SVI"}.</span>
                            }
                            visible={true}
                            width="80%"
                            footer={<Button type="primary" size="large" onClick={e => this.props.acknowledgeDealRejection()}>OK</Button>}
                        >
                            {this.props.RejectedDealOffer.CanAccept == false && this.parseMessage(this.props.RejectedDealOffer.Message)}
                        </Modal> : null

                    }

                    {this.props.AcceptedDealOffer && this.props.AcceptedDealOffer.ToNationName != "Bangladesh" ?

                        <Modal
                            title={
                                this.props.AcceptedDealOffer.FromTeamSlug == this.props.CurrentPlayer.Slug
                                    ? <span>Your trade deal with {this.props.AcceptedDealOffer.ToNationName} was accepted by the SVI.</span>
                                    : <span>Your trade deal with {this.props.AcceptedDealOffer.FromNationName} was accepted by the SVI.</span>
                            }
                            visible={true}
                            width="80%"
                            footer={<Button type="primary" size="large" onClick={e => this.props.acknowledgeDealRejection()}>OK</Button>}
                        >
                            {this.parseMessage(this.props.AcceptedDealOffer.Message)}
                        </Modal> : null

                    }
                    

                    <Col xs={23}>

                        {this.props.CurrentPlayer.Nation && (this.props.CurrentPlayer.Nation as INation).Content && (this.props.CurrentPlayer.Nation as INation).Content.length ? 
                        <Row>
                            <p>
                                {(this.props.CurrentPlayer.Nation as INation).Content[0][7].split('\n').filter((c: string) => c.length).map((c: string) => {
                                    return c == c.toUpperCase() ? <h4>{c}</h4> : <p>{c.replace(/\[([^}]+)\]/, moment().format('MMMM D, YYYY').toString())}</p>
                                })}
                            </p>
                        </Row> : null}


                        <Row>
                            {(this.state.TradeOptions ? this.state.TradeOptions : this.getTradeOptionContent()).map((o: string) => <p>{this.parseMessage(o)}</p>)}
                        </Row>

                        {!this.props.CurrentPlayer.DealsProposedBy.length && typeof this.props.CurrentPlayer.DealsProposedTo[0] != "string" ? 
                        <Row className="propose-block">
                            <label>Propose a Trade</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="--Select Nation--"
                                onChange={e => this.setState(Object.assign({}, this.state, { ChosenCountry: e }))}
                            >
                                {this.getOptionsByTeam().map((o, i) => <Select.Option key={i} value={o.value}>{o.text}</Select.Option>)}
                            </Select>
                            {this.state && <Button style={{ marginTop: '10px' }} className="game-button block" onClick={e => this.prepDeal()} disabled={!this.state.ChosenCountry}>Propose Trade</Button>}

                        </Row> : null}


                        <Row>
                            {this.props.CurrentPlayer.DealsProposedTo.length && typeof this.props.CurrentPlayer.DealsProposedTo[0] != "string" ?
                                <ul className="deal-list">
                                    {(this.props.CurrentPlayer.DealsProposedTo as IDeal[]).map(d => {

                                        return <li>
                                            <div>
                                                <Icon type="global" />
                                            </div>
                                            <div>
                                                <h3>You Accepted {d.TransferFromNationName || d.FromNationName}'s' Trade Deal for ${d.Value * 10}Billion</h3>
                                                <p>{this.parseMessage(d.Message)}</p>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                                : null
                            }
                        </Row>

                        <Row>
                            {this.props.CurrentPlayer.DealsProposedBy.length ?
                                <ul className="deal-list">
                                    {(this.props.CurrentPlayer.DealsProposedBy as IDeal[]).map(d => {
                                        return <li>
                                            <div>
                                                <Icon type="global" />
                                            </div>
                                            <div>
                                                <h3>{d.TransferToNationName || d.ToNationName} Accepted Your Trade Deal for ${d.Value * 10}Billion</h3>
                                                <p>{this.parseMessage(d.Message)}</p>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                                : null
                            }
                        </Row>

                        {this.state.PlayerNotFound && <Redirect to="/" />}
                    </Col>
                </Row>


                {this.props.Dashboard && this.props.Dashboard.length > 100 && this.props.Dashboard[100] < .3 ? 
                <Modal
                    className="victory-modal"
                    visible={ this.props.Dashboard[100] < 1 && this.state.showVictoryModal }
                    width={"95%"}
                    footer={[<Button onClick={e => this.setState(Object.assign({}, this.state, {
                        showVictoryModal: false
                    }))}>OK</Button>]}
                >
                    <Icon type="trophy" style={{color:"green"}} />
                    <p>Congratulations. You've worked with the international community to lower temperatures in 2100 to pre-industrial levels.</p>
                </Modal> : null}

            </GameWrapper>
            :
            <Row style={{height: '100vh'}} type="flex" justify="center" >
                <Col xs={24} style={{marginTop: '35vh'}}>
                    <h4 style={{textAlign:"center"}}>Downloading Climate Data <Spin style={{fontSize:'120%', marginLeft:'10px'}} indicator={<Icon type="loading"/>} /></h4>
                </Col>
            </Row>
    }

}
