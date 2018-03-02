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

interface State3Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   setWaterValues: (team:ITeam) => {}
   submitRatings: (formValues: any) => {}
   match:any;
}
export default class State3 extends React.Component<State3Props, {PlayerNotFound:boolean}> {

    componentWillMount(){
        
    }

    componentDidMount(){
        console.log("COMPONENT MOUNTING???????????????????")
        this.setState({PlayerNotFound: false})
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
                        <RatingsForm onSubmit={this.prepareRatings.bind(this)}/>
                        : 
                        <Row className="form-wrapper" gutter={{lg:"1", xl:"1"}}>
                            <h2>Not the New Yorker logo, but one of a similar publication we make up.</h2>
                            <h3>DECEIVING THE NATION</h3>
                            <p style={{fontWeight:"lighter", textAlign:"center"}}>By Akwugo St. Claire,&nbsp; February 22, {new Date().getFullYear() + 2}</p>
                            <Col xl={24}>
                                <p><em><strong>How far should a country go to save its people from an act of self harm? What if that act of self harm could be fatal?</strong></em></p>
                            </Col>
                            <Col sm={24} md={24} lg={12}>
                                <p>For one country the answer was very far indeed.</p>
                                <p>On March 17 the people of Scotland woke to a darkness that was uncommon even as winter still lingered. Their homes cold. Checking for street lights they wondered when the power cut would end as they reached for their mobile phone.</p>
                                <p>Then things began to unravel. They had battery but no connection. Emergency calls could be made but there was no network. No internet. Those who still owned a landline heard only silence. As dawn approached those who had ventured outside could tell that power had gone from the city, the town, the village. Then the stores and offices closed. No trains left terminals. No planes flew. And eeriest of all the radio was silent. The AM and FM stations crackled and buzzed but no voices were heard.</p>
                                <p>When the emergency services came they asked for calm but looked as perplexed as everyone else. The speculation began. A solar flare. A detonation. An electromagnetic pulse. Without information imaginations abound. When the night draws close a tangible fear permeates the people and their communities. They huddle on doorsteps and berate the government for their inaction. Assuming they are still in charge.</p>
                                <p>Thoughts turn to the following day and the need for supplies. A panic stirs. Shopkeepers head to their darkened stores ready to protect their wares. A rumour spreads and though the details are sparse and the source unconfirmed there is talk of a catastrophe. Something natural. Something beyond our experience. The young take the chance to party. Free of obligation for once. The rest place themselves in the hands of hope, unable to imagine what any of it can mean.</p></Col>
                            <Col sm={24} md={24} lg={12}><p>The following day when power returned the news channels buzzed with intensity. Details were sparse. Government reports of an unexplained solar event do little to quell the rising hysteria. Social media spreads memes of the coming apocalypse and the talking heads on television do little more than pour fuel on flames.&nbsp;</p>
                                <p>Then the truth is revealed. And, for once,&nbsp;the term 'shocking' is not hyperbole.</p>
                                <p>It was a hoax.</p>
                                <p>A deception conceived and perpetrated by an unlikely alliance of government officials, media chiefs, and industry leaders from power, transport and telecoms. All involved in a truly Machiavellian plot in the name of climate change. A crisis in waiting they say is being ignored by the public and investors alike. A crisis that will be beyond their ability to cope. Well, if they wanted attention they have their wish.</p>
                                <p>The backlash has been furious. An indignant public is apoplectic that their lives became a plaything for a day. And yet, there is also a kind of grudging admiration. A recognition that true pioneers are rarely acknowledged let alone feted in their own time. Some early opinion polls show a huge spike in recognition of climate change issues.</p>
                                <p>It is too soon to tell. But perhaps this social experiment, this modern day <em>War of the Worlds</em>&nbsp;writ large, will echo long after the din and clamour has subsided. Perhaps it is the wake up call we all so desperately need.</p>
                            </Col>
                        </Row>
                    }

               </GameWrapper>
            )
               
    }
}