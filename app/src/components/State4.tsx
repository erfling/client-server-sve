import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import RatingsForm from './form-elements/RatingsForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Button, Icon} from 'antd';


import HealthIcon from '-!svg-react-loader?name=Icon!../img/health-icon.svg';
import IndustryIcon from '-!svg-react-loader?name=Icon!../img/industry-icon.svg';
import GovernmentIcon from '-!svg-react-loader?name=Icon!../img/government-icon.svg';
import AgriIcon from '-!svg-react-loader?name=Icon!../img/agri-icon.svg';
import INation from '../../../shared/models/INation';
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');

interface State3Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   setWaterValues: (team:ITeam) => {}
   submitRatings: (formValues: any) => {}
   getContent: (team: ITeam) => {}
   match:any;
   StateContent: any;
}
export default class State4 extends React.Component<State3Props, {PlayerNotFound:boolean}> {

    componentWillMount(){
        
    }

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
            this.props.getContent(this.props.CurrentPlayer)
        }
        window.scrollTo(0,0);
    }
    
    componentDidUpdate(){
        console.log("UPDATED")
    }

    render(){
        
        if(!this.props.CurrentPlayer)return <div>Should go to login<Redirect to="/"/></div>
        return (
                this.props.CurrentPlayer && <GameWrapper
                    ParallaxImg={Hurricane}
                    HeaderText="State 4 Title"
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                >   
                    {this.props.CurrentPlayer.GameState == "4A" &&
                        <Row className="role-selection">
                            <Col sm={24} md={24} lg={24}>                                                        
                                <Row  type="flex" justify="center" style={{paddingTop:'20px'}}>
                                    <h1>Role Selection</h1>                                                            
                                </Row>
                                <Row type="flex" justify="center">
                                    <Col xs={22}>
                                        <GovernmentIcon height={400}/>
                                        <p>The CEO of Warburton, the region's largest agrichemical business faced with growing food production for an escalating population in a time of water scarcity and drought. </p>
                                        <Button className="game-button block">Minister of Energy, {(this.props.CurrentPlayer.Nation as INation).Name}</Button>
                                    </Col>
                                </Row>

                                
                                <Row type="flex" justify="center">
                                    <Col xs={22}>
                                        <IndustryIcon height={400}/>
                                        <p>The CEO of Vanguard Life, the region's largest health care and insurance provider, who is anxious of increased exposure to climate-sensitive diseases and mental health impacts from severe weather-related events</p>
                                        <Button className="game-button block">{(this.props.CurrentPlayer.Nation as INation).Name}Bank</Button>
                                    </Col>
                                </Row>

                               
                                    <div>
                                        <Button></Button>
                                    </div>
                                
                            </Col> 
                        </Row>                      
                    }

                    {this.props.CurrentPlayer.GameState == "4B" &&
                        <Row className="form-wrapper">
                            <Col sm={23} md={16} lg={12}>
                                
                            </Col> 
                        </Row>                      
                    }

                    {this.props.CurrentPlayer.GameState == "4C" &&
                        <Row className="form-wrapper">
                            <Col sm={23} md={16} lg={12}>
                                
                            </Col> 
                        </Row>                      
                    }

               </GameWrapper>
            )
               
    }
}