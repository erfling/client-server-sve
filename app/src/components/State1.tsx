import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import ITeam from '../../../shared/models/ITeam';
import WaterForm from './form-elements/WaterForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Select, Button} from 'antd';
import Horse from '-!svg-react-loader?name=Icon!../img/horse.svg';
require('smoothscroll-polyfill').polyfill();

const City = require("../img/Drought_water_city.jpg");

interface State1Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   setWaterValues: (team:ITeam) => {}
   match:any;
}
export default class State1 extends React.Component<State1Props, {PlayerNotFound:boolean, ChosenHorse: string, FeedBack: string[][], Decided: boolean}> {
    componentWillMount(){
        this.setState({PlayerNotFound: false, ChosenHorse: null})
    }

    componentDidMount(){
        
        if(!this.props.CurrentPlayer){
            if(localStorage.getItem("SVE_PLAYER")){
                this.props.getPlayer()
                console.log(this.props.CurrentPlayer);
            }else{
                this.setState({PlayerNotFound: true})                
            }
        }else{
            console.log("CURRENT PLAYER ALREADY IN REDUX STORE")
        }
        window.scrollTo(0,0);

        this.getResults();
    }
    
    setDecisionState(e: string){
        this.setState( Object.assign({}, this.state, {Decided: true}));
        console.log(document.querySelector(".decided-messaged"));
        setTimeout(() => document.querySelector(".decided-messaged").scrollIntoView({behavior:"smooth"}), 500);
    }

    componentDidUpdate(){
        console.log("UPDATED")
    }

    getResults() {
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/getWaterResuls";

        fetch(
            URL
        )
        .then( r => r.json() )
        .then(r => {
            this.setState(Object.assign({}, this.state, {FeedBack: r}))
        })
    }


    render(){
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const future = new Date(year + 20, month, day);
        if(!this.props.CurrentPlayer)return <div>Should go to login<Redirect to="/"/></div>
        return (
                <GameWrapper
                    ParallaxImg={City}
                    HeaderText="Who Gets The Water?"
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                >  
                    {this.props.CurrentPlayer.GameState == "1A" 
                    ? <Row>
                        {this.state.FeedBack && this.state.FeedBack[12]
                                                            .filter(content => content.length)
                                                            .map( (content:string) => {
                                                                return content == content.toUpperCase() ? <h3>{content}</h3> : <p>{content}</p>
                                                            })}

                        <Row className="formWrapper">
                            <Select
                                style={{width: '100%'}}
                                onChange={e => this.setState(Object.assign({}, this.state, {ChosenHorse:e}))}
                                placeholder="Who gets the water?"
                            >
                                <Select.Option value="Agriculture">Agriculture</Select.Option>
                                <Select.Option value="Government">Government</Select.Option>
                                <Select.Option value="Healthcare">Healthcare</Select.Option>
                                <Select.Option value="Industry">Industry</Select.Option>
                            </Select>
                            <Button style={{margin: "10px 0 50px"}} className="game-button block" onClick={e =>  this.setDecisionState(this.state.ChosenHorse)}>Commit Decision</Button>
                            <h5 className="decided-messaged" style={{margin: "10px 0 20px"}}>{this.state.Decided && <span>You selected {this.state.ChosenHorse}. Change your mind? If so, simply choose again</span>}</h5>
                        </Row>
                                 
                    </Row> : null}

                    {this.props.CurrentPlayer.GameState == "1B" &&
                        <Row style={{minHeight: '25vh', paddingTop:'20px'}}>                        
                            {this.state.Decided &&
                                this.state.FeedBack ?
                                    <Row className="state1results">
                                            {this.state.FeedBack.filter(f => f[0] && f[0].toUpperCase() == this.state.ChosenHorse.toUpperCase())
                                                .map(f => {
                                                    return f.filter((c, i) => i != 0).map((c) => {
                                                        return <Row className={c.charAt(0) == "^" && this.props.CurrentPlayer.GameState != "1C" ? "winner" : null}>
                                                                    <Horse  /><p>{c.substring(1, c.length)}</p>
                                                                </Row>
                                                    })
                                                }) }
                                    </Row> : null}
                        </Row>
                    }    
      
                    {this.props.CurrentPlayer.GameState == "1C" &&
                        <Row style={{minHeight: '25vh', paddingTop:'20px'}}>                        
                            {this.state.Decided &&
                                this.state.FeedBack ?
                                    <Row>
                                        <h5 style={{display: 'block'}}>You Chose {this.state.ChosenHorse}</h5>

                                        <Row className="state1results">
                                                {this.state.FeedBack.filter(f => f[0] && f[0].toUpperCase() == this.state.ChosenHorse.toUpperCase())
                                                    .map(f => {
                                                        return f.filter((c, i) => i != 0).map((c) => {
                                                            return <Row className={c.charAt(0) == "^" && this.props.CurrentPlayer.GameState != "1C" ? "winner" : null}>
                                                                        <Horse  /><p>{c.substring(1, c.length)}</p>
                                                                    </Row>
                                                        })
                                                    }) }
                                        </Row>
                                    </Row> : null}
                        </Row>
                    }    
                    
               </GameWrapper>
            )
               
    }
}