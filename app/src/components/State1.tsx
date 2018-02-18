import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import WaterForm from './form-elements/WaterForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 

const City = require("../img/Drought_water_city.jpg");

interface State1Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
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
    }

    render(){
        return <GameWrapper
                    ParallaxImg={City}
                    HeaderText="Who Gets The Water?"
                >
                    <WaterForm form="waterForm"/>
                    {this.state.PlayerNotFound && <Redirect to="/"/>}
               </GameWrapper>
    }
}