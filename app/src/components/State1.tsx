import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import WaterForm from './form-elements/WaterForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col} from 'antd';

const City = require("../img/Drought_water_city.jpg");

interface State1Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   setWaterValues: (team:ITeam) => {}
}
export default class State1 extends React.Component<State1Props, {PlayerNotFound:boolean}> {

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

    render(){
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const future = new Date(year + 20, month, day)
        return <GameWrapper
                    ParallaxImg={City}
                    HeaderText="Who Gets The Water?"
                >
                    <Row className="form-wrapper">
                        <p>{future.toLocaleDateString()}. A world on the brink of disaster.</p>
                        <p>Nations and industries have failed to act, and the worst has come to pass.</p>
                        <p>Cities flood with undrinkable salwater, while, month after month, no rains come.</p>
                        <p>Planet Sapien must now face extreme and inevitable rationing of its most precious resource.</p>
                        <p>Your team (substitute name of team and UN-like or here), brought together from the best minds in industry, the non-profit sector, and government, must act now.</p>
                        <p>Given the extreme scarcity, there is not enough fresh water to support agriculture, healthcare, industry and government. It must be distributed wisely, and there is only enough fresh water to give some of it to two sectors, or all of it to one.</p>
                    </Row>

                    <WaterForm form="waterForm" onSubmit={this.props.setWaterValues}/>
                    {this.state.PlayerNotFound && <Redirect to="/"/>}
               </GameWrapper>
    }
}