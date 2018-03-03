import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { RadioButtonWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import RatingsForm from './form-elements/RatingsForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Button, Icon, Radio} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import HealthIcon from '-!svg-react-loader?name=Icon!../img/health-icon.svg';
import IndustryIcon from '-!svg-react-loader?name=Icon!../img/industry-icon.svg';
import GovernmentIcon from '-!svg-react-loader?name=Icon!../img/government-icon.svg';
import AgriIcon from '-!svg-react-loader?name=Icon!../img/agri-icon.svg';
import INation from '../../../shared/models/INation';
import IRole from '../../../shared/models/IRole';
import { RoleName } from '../../../shared/models/RoleName';
import { RoleRatingCategories } from '../../../shared/models/RoleRatingCategories';
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');

interface State3Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   submitValues: (formValues: any) => {}
   getContent: (team: ITeam) => {}
   selectRole: (role: string, teamSlug: string) => {}
   submitRoleRating: (roleName: string, teamSlug: string, rating: any) => {} 

   match:any;
   StateContent: any;
   SelectedRole: IRole;
   SocketConnected: boolean;
}
export default class State4 extends React.Component<State3Props, {PlayerNotFound:boolean}> {

    componentWillMount(){
        
    }

    componentDidMount(){
        this.setState({PlayerNotFound: false})
        if(!this.props.CurrentPlayer){
            if(localStorage.getItem("SVE_PLAYER")){
                console.log("HEY YOU")
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
        console.log("UPDATED")
        if(this.props.CurrentPlayer && this.props.SocketConnected && !this.props.SelectedRole){
            console.log("SOCKET CONNECTED")
            if(localStorage.getItem("SELECTED_ROLE")){
                var role = JSON.parse(localStorage.getItem("SELECTED_ROLE")) as IRole;
                console.log("ALREADY HAD ROLE: ", role)
                this.props.selectRole(role.Name, this.props.CurrentPlayer.Slug);
            }
        }
    }

    render(){
        
        if(!this.props.CurrentPlayer)return <div>loading</div>
        return (
                this.props.CurrentPlayer && <GameWrapper
                    ParallaxImg={Hurricane}
                    HeaderText="State 4 Title"
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                >   
                    {this.props.SocketConnected && this.props.SocketConnected}
                    {this.props.CurrentPlayer.GameState == "4A" && !this.props.SelectedRole ? 
                        <Row className="role-selection">
                            <Col sm={24} md={24} lg={24}>                                                        
                                <Row  type="flex" justify="center" style={{paddingTop:'20px'}}>
                                    <h1>Role Selection</h1>                                                            
                                </Row>
                                <Row type="flex" justify="center">
                                    <Col xs={22}>
                                        <GovernmentIcon height={400}/>
                                        <p>The CEO of Warburton, the region's largest agrichemical business faced with growing food production for an escalating population in a time of water scarcity and drought. </p>
                                        <Button onClick={e => this.props.selectRole(RoleName.MINISTER_OF_ENERGY, this.props.CurrentPlayer.Slug)} className="game-button block">Minister of Energy, {(this.props.CurrentPlayer.Nation as INation).Name}</Button>
                                    </Col>
                                </Row>

                                
                                <Row type="flex" justify="center">
                                    <Col xs={22}>
                                        <IndustryIcon height={400}/>
                                        <p>The CEO of Vanguard Life, the region's largest health care and insurance provider, who is anxious of increased exposure to climate-sensitive diseases and mental health impacts from severe weather-related events</p>
                                        <Button onClick={e => this.props.selectRole(RoleName.BANK, this.props.CurrentPlayer.Slug)} className="game-button block">{(this.props.CurrentPlayer.Nation as INation).Name}Bank</Button>
                                    </Col>
                                </Row>
                                
                            </Col> 
                        </Row>
                        :   <pre>TODO: replace with content.{JSON.stringify(this.props.SelectedRole, null, 2)}</pre>
               
                    }

                    {this.props.CurrentPlayer.GameState == "4B" && this.props.SelectedRole ? 
                        <Row className="form-wrapper">
                            <Col sm={23} md={16} lg={12}>
                                TODO: replace with content.
                                <pre>{JSON.stringify(this.props.SelectedRole, null, 2)}</pre>
                            </Col> 
                        </Row> : null                  
                    }

                    {this.props.CurrentPlayer.GameState == "4C" && this.props.SelectedRole ? 
                        <Row className="form-wrapper" type="flex" justify="center" >
                            <Col sm={23} md={23} lg={20}>
                                {Object.keys(this.props.SelectedRole.RoleTradeRatings).sort((a,b) => {return a > b ? 1 : 0}).map((rating, i) => {
                                    return (
                                        <Row className="form-wrapper role-trades"  type="flex" justify="center" >
                                            <label>
                                                {(RoleRatingCategories as any)[rating]} MARKET
                                                {(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus == -1 && 
                                                    <span>
                                                        <Icon  type="hourglass" />Waiting...
                                                    </span>
                                                }
                                                {(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus == 0 && 
                                                    <span>
                                                        <Icon type="close-circle-o" style={{color:"red"}} />
                                                    </span>
                                                }
                                                {(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus == 1 && 
                                                    <span>
                                                        <Icon type="check-circle-o" style={{color:"green"}}/>
                                                    </span>
                                                }
                                            </label>
                                            <RadioGroup 
                                                defaultValue={(this.props.SelectedRole.RoleTradeRatings as any)[rating].Value} 
                                                size="large"
                                                onChange={e => this.props.submitRoleRating(this.props.SelectedRole.Name, this.props.CurrentPlayer.Slug, {[rating]: {Value: e.target.value, AgreementStatus:(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus }})}
                                            >
                                                <RadioButton value={1}>Country First</RadioButton>
                                                <RadioButton value={2}>Region First</RadioButton>
                                                <RadioButton value={3}>Planet First</RadioButton>
                                            </RadioGroup>
                                        </Row>
                                    )
                                })}
                            </Col> 
                        </Row> : null                
                    }

               </GameWrapper>
            )
               
    }
}