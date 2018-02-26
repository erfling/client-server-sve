import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import DealFormWrapper from './form-elements/DealForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Modal, Icon, Button, Select} from 'antd';
import ITradeOption from '../../../shared/models/ITradeOption';
import INation from '../../../shared/models/INation';

import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    DiscreteColorLegend,
    DiscreteColorLegendItem,
    Hint } from 'react-vis';

interface State2Props{
   CurrentPlayer: ITeam;
   PendingDealOffer: IDeal;
   //Options: ITradeOption[];
   getPlayer: () => {}
   proposeDeal: (deal: IDeal) => {}
   acceptOrRejectDeal: (deal: IDeal, accept: boolean) => {}
   forwardDeal: (deal: IDeal) => {}
   match: any;
   Dashboard: any;
}
export default class State2 extends React.Component<State2Props, {PlayerNotFound:boolean, ParallaxByNation: any, ShowChart:boolean, ChosenCountry: string}> {

    componentWillMount(){
        this.setState({PlayerNotFound: false, ShowChart: false})
        console.log("LOCAL STORAGE FROM STATE 1 COMPONENT", localStorage)
        if(!this.props.CurrentPlayer){
            if(localStorage.getItem("SVE_PLAYER")){
                this.props.getPlayer()
            }else{
                this.setState({PlayerNotFound: true})
            }
        }
        window.scrollTo(0,0);
    }

    prepDeal(){
        //formValues.fromId = this.props.
        
        var deal: IDeal = {
            TradeOption: null,
            FromTeamSlug: this.props.CurrentPlayer.Slug,
            FromNationName: (this.props.CurrentPlayer.Nation as INation).Name,
            ToNationName: this.state.ChosenCountry
        }
        console.log("WHAT'S THE DEAL?", deal)
        this.props.proposeDeal(deal);
        
    }

    respondToDeal(deal: IDeal, accept: boolean) {
        this.props.acceptOrRejectDeal(deal, accept)
    }

    prepareToForwardDeal(deal: IDeal, newRecipient: string, accept: boolean = null){
        console.log(deal, newRecipient)

        let dealChanges:Partial<IDeal> = {
            TradeOption: deal.TradeOption as ITradeOption,
            TransferFromNationName: (this.props.CurrentPlayer.Nation as INation).Name,
            TransferFromTeamSlug: this.props.CurrentPlayer.Slug,
            TransferToNationName: newRecipient,
            TransferAccepted: accept != undefined ? accept : null
        }
        let transferDeal = Object.assign(
            {},
            deal,
            dealChanges
        )

        console.log(transferDeal);
        this.props.forwardDeal(transferDeal);
    }

    prepareAcceptOrRejectForwardDeal(deal: IDeal, accept: boolean = null){

        let dealChanges:Partial<IDeal> = {
            TransferAccepted: accept
        }
        let transferDeal = Object.assign(
            {},
            deal,
            dealChanges
        )

        console.log(transferDeal);
        this.props.forwardDeal(transferDeal);
    }

    componentDidUpdate(){
        if(this.props.CurrentPlayer && this.props.CurrentPlayer.Nation && !this.state.ParallaxByNation)this.loadImage();
    }
    
    getColor(){
        var temp = this.props.Dashboard[100];

        if(temp <= 0){
            return "green";
        }else if(temp >= 2){
            return "red";
        } else {
            return "orange";
        }
    }

    showOrHideChart(){  
        this.setState(Object.assign({}, this.state, {ShowChart: !this.state.ShowChart}));
        var element:HTMLElement = document.querySelector(".tempTracker");
        element.classList.toString().indexOf("show") == -1 ? element.classList.add("show") : element.classList.remove("show")
    }


    loadImage(){
        if(!this.props.CurrentPlayer.Nation)return;
        const River = require("../img/river-waterfall-cliff-rock-forest-tree.jpg");
        var imagePath = "../img/"
        switch ((this.props.CurrentPlayer.Nation as INation).Name) {
        
            case "Australia":
                return imagePath + "sydney-opera.jpeg";
            case "Bangladesh":
                return  imagePath + "Bangladesh_beach.jpeg";            
            case "China":
                return imagePath + "china_banner.jpeg";
            case "India":
                return imagePath + "India_market.jpeg"; 
            case "Japan":
                return imagePath + "japan_fuji.jpeg";
            case "Vietnam":
                return imagePath + "vietnam_Paddy.jpeg";
            default:
                imagePath = null;
                break;

            
        }

        console.log("PATH TO IMAGE IS", imagePath)
        if(imagePath)this.setState(Object.assign(this.state, {ParallaxByNation: imagePath}))
        console.log(this.state)
    }

    getOptionsByTeam():string[]{
        return [
            "Australia",
            "Bangladesh",
            "China",
            "India",
            "Japan",
            "Vietnam"
        ].filter(s => s != (this.props.CurrentPlayer.Nation as INation).Name)
         .map(s => "Invest $" + this.props.CurrentPlayer.DealsProposedTo.length ? (this.props.CurrentPlayer.DealsProposedTo.length * 10).toString() : "10" + " billion in " + s)
    }
    

    getParsedData(data:number[] | string[] | number){
        var parsedData:any[] = [];
        
        for(var i = 2000; i < 2101; i++){
            
            let value = typeof data == "number" ? data : data[i - 2000];
            parsedData.push({
                x: i.toString() + " ",
                y: value
            })
        }
        console.log("PARSED DATA:", parsedData)
        return parsedData;
    }

    render(){
        if(!this.props.CurrentPlayer)return <div/>
        return this.props.CurrentPlayer && 
                this.props.CurrentPlayer.Nation ? 
                <GameWrapper
                    ParallaxImg={require("../img/sydney-opera.jpeg")}
                    HeaderText={(this.props.CurrentPlayer.Nation as INation).Name}
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                >   
                    {this.props.Dashboard &&  
                        this.props.Dashboard.length > 100 ? 
                        <Row ref="tempTracker" className="tempTracker">
                            Global Temp difference in 2100: <span style={{color: this.getColor()}}>{this.props.Dashboard[100]}</span> 
                            <Button onClick={e => this.showOrHideChart()} type="primary" shape="circle"><Icon type="line-chart" /></Button>
                            <Modal 
                                width="95%"
                                visible={this.state.ShowChart}
                                footer={<Button onClick={e => this.showOrHideChart()}>Close <Icon type="close-circle-o" /></Button>}
                            >
                                <XYPlot
                                    height={400}
                                    width={700}
                                    className="line-chart"
                                >
                                    <HorizontalGridLines />
                                    <VerticalGridLines />      
                                    
                                    <XAxis title="Year" />
                                    <YAxis title="Temperature" />
                                    <LineSeries
                                            strokeWidth={3}
                                            color="red"
                                            label="test"
                                            className="first-series"
                                            style={{
                                                strokeDasharray: '10 2'
                                            }}
                                            data={this.getParsedData(2)}                                                                           
                                        />
                                    

                                   <LineSeries
                                        strokeWidth={3}
                                        color="orange"
                                        className="second-series"
                                        style={{
                                            strokeDasharray: '10 2'
                                        }}
                                        data={this.getParsedData(0)}
                                    />
                                        
                                    

                                   <LineSeries
                                        className="third-series"
                                        color={this.getColor()}
                                        style={{
                                            //strokeDasharray: '10 2'
                                        }}
                                        strokeWidth={3}
                                        data={this.getParsedData(this.props.Dashboard)}
                                    />
                                        
                                    
                                    <DiscreteColorLegend
                                        className="impact-chart"
                                        colors={["red", "orange", this.getColor()]}
                                        orientation="horizontal"
                                        items={["Paris Accord", "Preindustrial Level", "Adjusted Temp Increase"]}
                                    />
                                </XYPlot>
                            </Modal>
                            
                            
                        </Row> : null
                    }
                    {this.props.PendingDealOffer ? 
                        this.props.PendingDealOffer.TransferFromNationName  ? 
                        <Modal
                            title={
                                this.props.PendingDealOffer.TransferFromTeamSlug == this.props.CurrentPlayer.Slug 
                                    ? <p>Your team offered {this.props.PendingDealOffer.FromNationName}'s trade deal to {this.props.PendingDealOffer.TransferToNationName}.</p> 
                                    : <p>{this.props.PendingDealOffer.TransferFromNationName} has offered {this.props.PendingDealOffer.FromNationName}'s' trade deal to you.</p>
                            }
                            visible={true}
                            width="95%"
                            footer={
                                this.props.PendingDealOffer.TransferFromTeamSlug == this.props.CurrentPlayer.Slug 
                                ? null
                                : [
                                    <Button type="primary" size="large" onClick={e => {this.prepareAcceptOrRejectForwardDeal(this.props.PendingDealOffer, true)}}>Accept Deal</Button>,
                                    <Button type="danger" size="large" onClick={e => {this.prepareAcceptOrRejectForwardDeal(this.props.PendingDealOffer,  false)}}>Reject Deal</Button>         
                                ]
                            }
                        >
                            <p>{(this.props.PendingDealOffer.TradeOption as ITradeOption).Message}</p>                        
                        </Modal> :
                        <Modal
                            title={
                                this.props.PendingDealOffer.FromTeamSlug == this.props.CurrentPlayer.Slug 
                                    ? <p>Your team offered a trade deal to {this.props.PendingDealOffer.ToNationName}.</p> 
                                    : <p>{this.props.PendingDealOffer.FromNationName} wants to make a trade deal.</p>
                            }
                            visible={true}
                            width="95%"
                            footer={
                                this.props.PendingDealOffer.FromTeamSlug == this.props.CurrentPlayer.Slug 
                                ? null
                                : [
                                    <Button type="primary" size="large" onClick={e => {this.respondToDeal(this.props.PendingDealOffer, true)}}>Accept Deal</Button>,
                                    <Button type="danger" size="large" onClick={e => {this.respondToDeal(this.props.PendingDealOffer, false)}}>Reject Deal</Button>
                                ]
                            }
                        >
                            <p>{(this.props.PendingDealOffer.TradeOption as ITradeOption).Message}</p>                        
                        </Modal> : null
                            
                            
                    }
                    <Row className="form-wrapper">
                        <p>{new Date().toLocaleDateString()}. A reprive.</p>
                        <p>You know the stakes. Work with other nations to build a liveable, sutainable world, as you build a better future for your own nation.</p>                        
                    </Row>
    
                    
                    <pre>{JSON.stringify(this.props.CurrentPlayer, null, 2)}</pre>
                    <Row className="form-wrapper">
                        <Select
                            style={{width:'100%'}}
                            placeholder="--Select Nation--"
                            onChange={e => this.setState(Object.assign({}, this.state, {ChosenCountry: e}))}
                        >
                            {this.getOptionsByTeam().map((o, i) => <Select.Option key={i} value={o}>{o}</Select.Option>)}
                        </Select>                    
                    </Row>
                   
                    <Row className="form-wrapper">
                        <div className="form-wrapper" style={{backgroundColor: 'transparent'}}>
                            {this.state && <Button className="game-button block" onClick={e => this.prepDeal()} disabled={!this.state.ChosenCountry}>Propose Deal </Button>}
                        </div>                  
                    </Row>
                    
                  
                    <Row>      
                        {this.props.CurrentPlayer.DealsProposedTo.length ?    
                            <ul>                 
                                {(this.props.CurrentPlayer.DealsProposedTo as IDeal[]).map(d => {
                                    
                                    return <li>
                                            <h5>You Accepted {d.TransferFromNationName || d.FromNationName}'s' Trade Deal</h5>
                                                {(d.TradeOption  as ITradeOption).Message}
                                                <Button type="danger" onClick={e => this.respondToDeal(d, false)}>Cancel Deal</Button>
                                                Offer deal to
                                                {this.props.CurrentPlayer.Nation && (this.props.CurrentPlayer.Nation as INation).TradeOptions ?   
                                                    <Row>
                                                        {((this.props.CurrentPlayer.Nation as INation).TradeOptions as ITradeOption[])
                                                            .filter(o => {
                                                                return o.ToNationId != d.ToNationName
                                                            })
                                                            .map(o => <Button onClick={e => this.prepareToForwardDeal(d, o.ToNationId)}>{o.ToNationId}</Button>)
                                                        }
                                                    </Row>
                                                    : <h1>hey</h1>
                                                }
                                        </li>
                                })}
                            </ul> 
                            : null
                        }
                    </Row> 

                    <Row>      
                        {this.props.CurrentPlayer.DealsProposedBy.length ? 
                            <ul>                                                  
                                {(this.props.CurrentPlayer.DealsProposedBy as IDeal[]).map(d => {
                                    return  <li>
                                                <h5>{d.TransferToNationName || d.ToNationName} Accepted Your Trade Deal</h5>
                                                <p>
                                                    {(d.TradeOption  as ITradeOption).Message}
                                                    <Button type="danger" onClick={e => this.respondToDeal(d, false)}>Cancel Deal</Button>
                                                </p>
                                            </li>
                                })}
                            </ul> 
                            : null
                        }
                    </Row>

                    {this.state.PlayerNotFound && <Redirect to="/"/>}
               </GameWrapper> : <h1>Loading</h1>
    }
}
//                    {this.props.CurrentPlayer && <pre>{JSON.stringify(this.props.CurrentPlayer, null, 2)}</pre>}
/*                    
{this.props.Submitting && <Icon type="loading"/>}
<Row className="form-wrapper">
                        <p>{(this.props.CurrentPlayer.Nation as INation).Content[0][6]}</p>                        
                    </Row>

                    <Row className="form-wrapper">
                        {(this.props.CurrentPlayer.Nation as INation).Content[0].filter((c:string, i: number) => i != 0 && i < 6).map((content: string) => <p>{content.replace(/\#([^}]+)\#/,"")}</p>)}
                    </Row>
*/