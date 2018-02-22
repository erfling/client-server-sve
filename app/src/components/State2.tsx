import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import DealFormWrapper from './form-elements/DealForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col} from 'antd';


const River = require("../img/river-waterfall-cliff-rock-forest-tree.jpg");

interface State2Props{
   CurrentPlayer: ITeam;
   PendingDealOffer: IDeal;
   getPlayer: () => {}
   proposeDeal: (deal: IDeal) => {}
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
        //formValues.fromId = this.props.
        var deal: IDeal = {
            from: this.props.CurrentPlayer.Slug,
            to  : formValues.text.split(" ").splice(-1)[0],
            text: formValues.text
        }
        console.log("WHAT'S THE DEAL?", deal)
        this.props.proposeDeal(deal);
    }

    render(){
        if(!this.props.CurrentPlayer)return <div/>
        return this.props.CurrentPlayer &&<GameWrapper
                    ParallaxImg={River}
                    HeaderText="Come Together"
                >   
                    {this.props.PendingDealOffer && <div>DEAL OFFERED</div>}
                    <Row className="form-wrapper">
                        <p>{new Date().toLocaleDateString()}. A reprive.</p>
                        <p>You know the stakes. Work with other nations to build a liveable, sutainable world, as you build a better future for your own nation.</p>
                    </Row>

                    <DealFormWrapper form="dealForm" onSubmit={this.prepDeal.bind(this)}/>
                    {this.state.PlayerNotFound && <Redirect to="/"/>}
               </GameWrapper>
    }
}