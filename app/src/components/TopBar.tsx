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
interface TopOfTheProps{
   CurrentPlayer?: ITeam
   getPlayer?: () => {}
   getDaysAbove?: (team: ITeam) => {}
   Dashboard?: any;
   DaysAbove2?: number;
   SocketConnected?: boolean;
}
export default class TopBar extends React.Component<TopOfTheProps, {PlayerNotFound:boolean, LocalDaysAbove2: number, LocalDashboard: number}> {

    componentDidMount(){
        this.setState({PlayerNotFound: false})
        if(!this.props.CurrentPlayer && this.props.getPlayer){
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

    componentDidUpdate(oldProps:any, oldState:any){
        if(this.props.CurrentPlayer && !this.props.CurrentPlayer.GameState.includes("2")){
            this.getData();
        }
        else if(this.props.Dashboard && this.props.Dashboard.length){
            if(this.state.LocalDashboard == null || this.state.LocalDashboard == undefined
                || this.state.LocalDashboard != parseFloat(this.props.Dashboard[100][0])
            ){
                console.log(this.state.LocalDashboard, this.props.Dashboard[100][0], this.state.LocalDashboard != parseFloat(this.props.Dashboard[100][0]));
                if(!this.state || ( !oldState || !oldState.LocalDashboard || oldState.LocalDashboard != this.state.LocalDashboard ) ){
                    this.setState(Object.assign({}, this.state, {LocalDashboard: parseFloat(this.props.Dashboard[100][0])}))
                }
            }
        }
    }

    animateScore(){
        var elem:HTMLElement = document.querySelector(".animation-target");
        elem.classList.add("waves")
        console.log("FOUND ELEMENT: ", elem);
    }

    getData() {
        if(this.props.SocketConnected && !this.props.DaysAbove2){
            //this.props.getDaysAbove(this.props.CurrentPlayer);
        }
    } 

    getColor() {
        var temp = this.props.Dashboard[100];

        if (temp <= 0) {
            return "#16591f";
        } else if (temp >= 2) {
            return "#ba1b1b";
        } else {
            return "#ffa400";
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
        return !this.props.children && this.props.CurrentPlayer && this.props.SocketConnected ? 
                    <Row ref="tempTracker" className="tempTracker">
                        {this.props.CurrentPlayer.GameState.indexOf("2") != -1 ? 
                        <div>Temp in 2100:&nbsp;<span className="animation-target" style={{color: this.getColor()}}>{this.props.Dashboard[100]}</span>
                        <span>Your Trade Bank: ${this.getTradeBank()} Billion</span></div>
                        :
                        <div>Days 2&#176; above pre-industrial temps: <span className="animation-target">{this.props.DaysAbove2}</span></div>}
                    </Row> 
                    : 
                    <Row ref="tempTracker" className="tempTracker">
                        {this.props.children}
                    </Row>    
               
    }
}