import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import RatingsForm from './form-elements/RatingsForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col} from 'antd';
import INation from '../../../shared/models/INation';
import IDeal from '../../../shared/models/IDeal';
import {Ratings} from '../../../api/src/models/Ratings';
import ChartContainer from '../containers/ChartContainer'

const WOTW = require("../img/The-War-of-the-Worlds-Radio-Broadcast.jpg");
const NY = require("../img/The_New_Yorker_logo.png");
interface State3Props{
   CurrentPlayer: ITeam
   getPlayer?: () => {}
   getDaysAbove?: (team: ITeam) => {}
   Dashboard: any;
   DaysAbove2: number;
   SocketConnected: boolean;
}
export default class State3 extends React.Component<State3Props, {PlayerNotFound:boolean}> {

    componentDidMount(){
        this.setState({PlayerNotFound: false})
        if(!this.props.CurrentPlayer){
            if(localStorage.getItem("SVE_PLAYER")){
                this.props.getPlayer();
            }else{
                this.setState({PlayerNotFound: true})                
            }
        }else{
            console.log("CURRENT PLAYER ALREADY IN REDUX STORE")
        }
        window.scrollTo(0,0);
    }

    componentDidUpdate(){
        console.log("did updated called", this.props.SocketConnected, this.props.DaysAbove2)
        this.getData();
    }

    getData() {
        console.log("Calling get data")
        if(this.props.SocketConnected && !this.props.DaysAbove2){
            this.props.getDaysAbove(this.props.CurrentPlayer);
        }
    } 

    getColor() {
        var temp = this.props.Dashboard[100];

        if (temp <= 0) {
            return "green";
        } else if (temp >= 2) {
            return "red";
        } else {
            return "orange";
        }
    }

    getTradeBank() {
        if (this.props.CurrentPlayer.DealsProposedBy.length) return 0;
        return this.props.CurrentPlayer.DealsProposedTo.length ? ((this.props.CurrentPlayer.DealsProposedTo[0] as IDeal).Value + 1) * 10 : 10
    }

    render(){
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const future = new Date(year + 20, month, day);
        if(!this.props.CurrentPlayer)return <div></div>
        return this.props.CurrentPlayer && this.props.SocketConnected ? 
                    <Row ref="tempTracker" className="tempTracker">
                        {this.props.CurrentPlayer.GameState.indexOf("2") != -1 ? 
                        <div>Temp  in 2100: <span style={{ color: this.getColor() }}>{this.props.Dashboard[100]}</span>
                        <span>Your Trade Bank: ${this.getTradeBank()} Billion</span></div>
                        :
                        <div>Days 2&#176; above pre-industrial temps: <span>{this.props.DaysAbove2}</span></div>}
                    </Row> : null    
               
    }
}