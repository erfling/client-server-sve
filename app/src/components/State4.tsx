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

//import HealthIcon from '-!svg-react-loader?name=Icon!../img/health-icon.svg';
import MinisterIcon from '-!svg-react-loader?name=Icon!../img/industry-icon.svg';
import BankIcon from '-!svg-react-loader?name=Icon!../img/government-icon.svg';
//import AgriIcon from '-!svg-react-loader?name=Icon!../img/agri-icon.svg';
import INation from '../../../shared/models/INation';
import IRole from '../../../shared/models/IRole';
import { RoleName } from '../../../shared/models/RoleName';
import { RoleRatingCategories } from '../../../shared/models/RoleRatingCategories';
const PlanetSapien = require('../img/sapien-from-moon.jpg');

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
export default class State4 extends React.Component<State3Props, {PlayerNotFound:boolean, GenericContent: any[], RoleContent: string}> {

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

            if(!this.state.GenericContent){
                this.getGenericContent();
            }
        }

        if(this.props.SelectedRole && !this.state.RoleContent){
            this.getRoleContent();
        }
    }
    
    getGenericContent() {
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/sheets/content/" + (this.props.CurrentPlayer.Nation as INation).Name;
        fetch(
            URL
        )
        .then( r => r.json() )
        .then(r => {
            this.setState(Object.assign({}, this.state, {GenericContent: r}))
        })
    }

    getRoleContent() {
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/sheets/content/rolecontent/" + this.props.SelectedRole.Name

        fetch(
            URL
        )
        .then( r => r.json() )
        .then(r => {
            this.setState(Object.assign({}, this.state, {RoleContent: r}))
        })
    }

    render(){
        
        if(!this.props.CurrentPlayer)return <div>loading</div>
        return (
                this.props.CurrentPlayer && <GameWrapper
                    ParallaxImg={PlanetSapien}
                    HeaderText="The Endeavor Accord"
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                        ImageStyles={{marginTop: '-250px',
                        minWidth:'110%',
                        maxHeight: '130vh',
                        marginLeft: '-110px'
                    }}
                >   
                    {this.props.SocketConnected && this.props.SocketConnected}
                    {this.props.CurrentPlayer.GameState == "4A" && !this.props.SelectedRole ? 
                        <Row className="role-selection">
                            {this.state && this.state.GenericContent && 
                                <Col sm={24} md={24} lg={24}>

                                    <Row type="flex" justify="center">
                                        <Col sm={22} md={22} lg={22} style={{marginTop: '75px'}}>
                                            <p>{this.state.GenericContent[0]}</p>
                                        </Col>
                                        
                                    </Row>        

                                    <Row  type="flex" justify="center" style={{paddingTop:'20px'}}>
                                        <h1>Role Selection</h1>                                                            
                                    </Row>
                                                                    
                                    <Row type="flex" justify="center">
                                        <Col xs={22}>
                                            <BankIcon height={400}/>
                                            <p>{this.state.GenericContent[1]}</p>
                                            <Button onClick={e => this.props.selectRole(RoleName.BANK, this.props.CurrentPlayer.Slug)} className="game-button block title-case">Play As {(this.props.CurrentPlayer.Nation as INation).Name}Bank</Button>
                                        </Col>
                                    </Row>

                                    <Row type="flex" justify="center">
                                        <Col xs={22}>
                                            <MinisterIcon height={400}/>
                                            <p>{this.state.GenericContent[2]}</p>
                                            <Button onClick={e => this.props.selectRole(RoleName.MINISTER_OF_ENERGY, this.props.CurrentPlayer.Slug)} className="game-button block title-case">Play As Minister of Energy, {(this.props.CurrentPlayer.Nation as INation).Name}</Button>
                                        </Col>
                                    </Row>                                
                                </Col>
                            }
                        </Row>
                        :
                        <Row type="flex" justify="center">
                            <Col sm={22} md={22} lg={22} style={{marginTop: '75px'}}>
                                {this.state.RoleContent && this.state.RoleContent.split("\n").map(c => {
                                    return c == c.toUpperCase() ? <h3>{c}</h3> : <p>{c}</p>
                                })}
                            </Col>
                        </Row>
               
                    }

                    {this.props.CurrentPlayer.GameState == "4B" && this.props.SelectedRole ? 
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