import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import RatingsForm from './form-elements/RatingsForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col} from 'antd';
import IRatings from '../../../shared/models/IRatings';
import {Ratings} from '../../../api/src/models/Ratings';

const WOTW = require("../img/The-War-of-the-Worlds-Radio-Broadcast.jpg");
const NY = require("../img/The_New_Yorker_logo.png");
interface State3Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   setWaterValues: (team:ITeam) => {}
   submitRatings: (formValues: any) => {}
   getContent: (team: ITeam) => {}
   match:any;
   StateContent: any;
}
export default class State3 extends React.Component<State3Props, {PlayerNotFound:boolean}> {

    componentWillMount(){
        
    }

    componentDidMount(){
        console.log("COMPONENT MOUNTING???????????????????")
        this.setState({PlayerNotFound: false})
        if(!this.props.CurrentPlayer){
            if(localStorage.getItem("SVE_PLAYER")){
                this.props.getPlayer();
            }else{
                this.setState({PlayerNotFound: true})                
            }
        }else{
            console.log("CURRENT PLAYER ALREADY IN REDUX STORE")
            this.props.getContent(this.props.CurrentPlayer)
        }
        window.scrollTo(0,0);
    }
    
    componentDidUpdate(){
        console.log("UPDATED")
    }

    prepareRatings(formValues: any){
        var ratings:IRatings = {};
        Object.keys(formValues).forEach((o:string) => {
            var nation:string = o.split("_")[0];
            if (!(ratings as any)[nation]) (ratings as any)[nation] = {};
            (ratings as any)[nation][o.substr(nation.length + 1)] = formValues[o];
        })
        this.props.submitRatings(Object.assign(this.props.CurrentPlayer, {Ratings: ratings}));
        console.log(ratings);
    }

    render(){
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const future = new Date(year + 20, month, day);
        if(!this.props.CurrentPlayer)return <div>Should go to login<Redirect to="/"/></div>
        return (
                this.props.CurrentPlayer && <GameWrapper
                    ParallaxImg={WOTW}
                    HeaderText="War Of The Worlds"
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                >   
                    {this.props.CurrentPlayer.GameState == "3B" 
                        ?    
                        <Row className="form-wrapper" gutter={{lg:"1", xl:"1"}}>
                            <Col sm={23} md={23} lg={23}>
                                <RatingsForm onSubmit={this.prepareRatings.bind(this)}/>
                            </Col> 
                        </Row>                 
                        : 
                        <Row className="form-wrapper" gutter={{lg:"1", xl:"1"}}>
                            <h3><img src={NY} style={{maxWidth:'100%'}}/></h3>
                            <h3>DECEIVING THE NATION</h3>
                            <p style={{fontWeight:"lighter", textAlign:"center"}}>By Akwugo St. Claire,&nbsp; February 22, {new Date().getFullYear() + 2}</p>
                        
                            {this.props.StateContent ? <Col sm={23} md={23} lg={12}>
                                {this.props.StateContent[0][0].split("\n").map((c:string, i:number) => {
                                    return c == c.toUpperCase() ? <h3>{c}</h3> : i == 0 ? <p><em><strong>{c}</strong></em></p> : <p>{c}</p>
                                })}
                            </Col> 
                            : <span>{this.props.getContent(this.props.CurrentPlayer)}</span>}

                        </Row>
                    }

               </GameWrapper>
            )
               
    }
}