import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import DealFormWrapper from './form-elements/DealForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Modal, Icon, Button} from 'antd';
import ITradeOption from '../../../shared/models/ITradeOption';
import INation from '../../../shared/models/INation';


const River = require("../img/river-waterfall-cliff-rock-forest-tree.jpg");

interface State2Props{
   CurrentPlayer: ITeam;
   PendingDealOffer: IDeal;
   getPlayer: () => {}
   proposeDeal: (deal: IDeal) => {}
   acceptOrRejectDeal: (deal: IDeal, accept: boolean) => {}
}
export default class State2 extends React.Component<State2Props, {PlayerNotFound:boolean}> {

    componentWillMount(){
        this.setState({PlayerNotFound: false})
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

    prepDeal(formValues: any){
        console.log(JSON.parse(formValues.chosenDeal))
        //formValues.fromId = this.props.
        
        var deal: IDeal = {
            TradeOption: JSON.parse(formValues.chosenDeal),
            from: this.props.CurrentPlayer.Slug,
            to  : JSON.parse(formValues.chosenDeal).to,
            accept: null
        }
        console.log("WHAT'S THE DEAL?", deal)
        this.props.proposeDeal(deal);
        
    }

    respondToDeal(deal: IDeal, accept: boolean) {
        this.props.acceptOrRejectDeal(deal, accept)
    }

    render(){
        if(!this.props.CurrentPlayer)return <div/>
        return this.props.CurrentPlayer &&<GameWrapper
                    ParallaxImg={River}
                    HeaderText={(this.props.CurrentPlayer.Nation as INation).Name}
                >   
                    {this.props.PendingDealOffer && <Modal
                            title={
                                this.props.PendingDealOffer.from == this.props.CurrentPlayer.Slug 
                                    ? <p>Your team offered a trade deal to {(this.props.PendingDealOffer.TradeOption as ITradeOption).ToNationId}.</p> 
                                    : <p>{(this.props.PendingDealOffer.TradeOption as ITradeOption).FromNationId} wants to make a trade deal.</p>
                            }
                            visible={true}
                            width="95%"
                            footer={
                                this.props.PendingDealOffer.from == this.props.CurrentPlayer.Slug 
                                ? null
                                : [
                                    <Button type="primary" size="large" onClick={e => {this.respondToDeal(this.props.PendingDealOffer, true)}}>Accept Deal</Button>,
                                    <Button type="danger" size="large" onClick={e => {this.respondToDeal(this.props.PendingDealOffer, false)}}>Reject Deal</Button>
                                ]
                            }
                        >
                        <p>{(this.props.PendingDealOffer.TradeOption as ITradeOption).Message}</p>
                        
                        </Modal> }
                    <Row className="form-wrapper">
                        <p>{new Date().toLocaleDateString()}. A reprive.</p>
                        <p>You know the stakes. Work with other nations to build a liveable, sutainable world, as you build a better future for your own nation.</p>
                    </Row>

                    <Row>      
                        {this.props.CurrentPlayer.DealsProposedTo.length ?    
                            <ul>                 
                                {(this.props.CurrentPlayer.DealsProposedTo as IDeal[]).map(d => {
                                    
                                    return  <li>
                                                <h5>{(d.TradeOption  as ITradeOption).ToNationId} Accepted Your Trade Deal</h5>
                                                <p>{(d.TradeOption  as ITradeOption).Message}</p>
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
                                                    <h5>You Accepted {(d.TradeOption  as ITradeOption).ToNationId}'s Trade Deal</h5>
                                                    <p>{(d.TradeOption  as ITradeOption).Message}</p>
                                                </li>
                                })}
                            </ul> 
                            : null
                        }
                    </Row>

                    <DealFormWrapper form="dealForm" onSubmit={this.prepDeal.bind(this)}/>
                    {this.state.PlayerNotFound && <Redirect to="/"/>}
               </GameWrapper>
    }
}