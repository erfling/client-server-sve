import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import ITeam from '../../../shared/models/ITeam';
import WaterForm from './form-elements/WaterForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Select, Button} from 'antd';
import Horse from '-!svg-react-loader?name=Icon!../img/horse.svg';

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
                        <div>
                            <p>{future.toLocaleDateString()}. A world on the brink of disaster.</p>
                            <p>Nations and industries have failed to act, and the worst has come to pass.</p>
                            <p>Cities flood with undrinkable salwater, while, month after month, no rains come.</p>
                            <p>Planet Sapien must now face extreme and inevitable rationing of its most precious resource.</p>
                            <p>Your team (substitute name of team and UN-like or here), brought together from the best minds in industry, the non-profit sector, and government, must act now.</p>
                            <p>Given the extreme scarcity, there is not enough fresh water to support agriculture, healthcare, industry and government. It must be distributed wisely, and there is only enough fresh water to give some of it to two sectors, or all of it to one.</p>
                        </div>

                        <h3>The Case for Agriculture</h3>
                        <div>
                            <p>Population growth increases food production demand to over 80% of available water</p>
                            <p>Diverted water leads to sourcing shifts from surface water to groundwater</p>
                            <p>Groundwater recovery is expensive and requires &gt;20 times the energy to divert</p>
                            <p>Fertilisers and pesticides which require intense water usage cannot be used</p>
                            <p>Irrigation is unsustainable</p>
                            <p>Yields drop</p>
                            <p>Crops fail as drought increases</p>
                            <p>Food production stops on previously arable land</p>
                        </div>
                        <h3>The Case for Healthcare</h3>
                        <div className="form-info">
                            <p>Growing populations place increased demand on the healthcare services</p>
                            <p>Clean water supply failure leads to the use of rainwater and other 'dirty' water sources</p>
                            <p>Sanitation failures lead to massive spikes in infection for those in hospital</p>
                            <p>Water borne disease increases</p><p>Newborns are particularly susceptible to infection and sepsis</p>
                            <p>Infant mortality significantly increases</p><p>Women stop coming to the hospital to give birth</p>
                            <p>Increases in mortality caused by other birth complications hospitals can treat</p>
                            <p>Adult populations at greater risk of infections which originate in the hospital like cholera outbreaks</p>
                            <p>Hospitals are no longer safe and incubate disease</p>
                        </div>
                        <h3>The Case for Industry</h3>
                        <div>
                            <p>Larger populations increase demand for water intensive production</p>
                            <p>As water becomes scarce degraded water is used impacting product quality</p>
                            <p>Production and output fall as costs escalate</p>
                            <p>Financial pressure leads to headcount decrease</p>
                            <p>Debt spirals and banks refuse to lend as revenues fall</p>
                            <p>Companies collapse infecting the banking system which has unsustainable debt levels across multiple industries</p>
                        </div>
                        <h3>The Case for Government</h3>
                        <div>
                            <p>Growing populations require water delivered by local government in regional areas</p>
                            <p>Water supply shortages lead to imposed restrictions on personal use to below 25 litres per day</p>
                            <p>Restrictions are insufficient and impact rural areas dramatically stopping supply completely in some areas</p>
                            <p>Mass migration begins as millions head for cities which have more reliable source water</p>
                            <p>Refugee crisis and civil unrest lead to mass anti-government demonstrations</p>
                            <p>Military occupies streets</p><p>Governments are toppled after a state of emergency is introduced</p>
                        </div>            
                    </Row> : null}
                    {this.props.CurrentPlayer.GameState == "1B" || this.props.CurrentPlayer.GameState == "1C" ? 
                    <Row>
                        {!this.state.Decided && 

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
                                <Button className="game-button block" onClick={e =>  this.setState(Object.assign({}, this.state, {Decided: true}))}>Commit Decision</Button>
                            </Row>

                        }
                        

                        {this.state.Decided &&
                            this.state.FeedBack ?
                            <Row className="state1results">
                                <h5>You Chose {this.state.ChosenHorse}</h5>
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
                    : null}
                    
               </GameWrapper>
            )
               
    }
}