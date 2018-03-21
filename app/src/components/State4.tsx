import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { RadioButtonWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import RatingsForm from './form-elements/RatingsForm'
import GameWrapper from './GameWrapper';
import TopBarContainer from '../containers/TopBarContainer';
import { Redirect } from 'react-router-dom'; 
import {Row, Col, Button, Icon, Radio, Modal} from 'antd';
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
import ChartContainer from '../containers/ChartContainer';
import * as _ from "lodash";

const PlanetSapien = require('../img/sapien-from-moon.jpg');

interface State3Props{
   CurrentPlayer: ITeam
   getPlayer: () => {}
   submitValues: (formValues: any) => {}
   getContent: (team: ITeam) => {}
   selectRole: (role: string, teamSlug: string) => {}
   submitRoleRating: (roleName: string, teamSlug: string, rating: any) => {} 
   getDaysAbove: (team: ITeam) => {}

   match:any;
   StateContent: any;
   SelectedRole: IRole;
   SocketConnected: boolean;
   DaysAbove2: number;
}
export default class State4 extends React.Component<State3Props, {PlayerNotFound:boolean, GenericContent: any[], RoleContent: string, showVictoryModal: boolean, victoryModalShown: boolean}> {

    componentWillMount(){
        this.setState({PlayerNotFound: false})
    }

    componentDidMount(){
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
        this.getData();

        if(this.props.CurrentPlayer && this.props.SocketConnected && !this.props.SelectedRole){
            console.log("SOCKET CONNECTED")
            if(localStorage.getItem("SELECTED_ROLE")){
                var role = JSON.parse(localStorage.getItem("SELECTED_ROLE")) as IRole;
                console.log("ALREADY HAD ROLE: ", role)
                if(role.hasOwnProperty("Name"))this.props.selectRole(role.Name, this.props.CurrentPlayer.Slug);
            }

            if(!this.state.GenericContent){
                this.getGenericContent();
            }
            
        }

        if(this.props.CurrentPlayer && this.props.CurrentPlayer.GameState == "4B"){
            var elem = document.querySelector('.scroll-target');
            console.log(elem);
            if(elem)elem.scrollIntoView( { behavior:'smooth', block:'end' } )
        }

        if(this.props.SelectedRole && !this.state.RoleContent){
            this.getRoleContent();
        }

        if(this.props.DaysAbove2 && this.props.DaysAbove2 == 0 && !this.state.showVictoryModal && !this.state.victoryModalShown){
            this.setState(Object.assign({}, this.state, {
                showVictoryModal: true,
                victoryModalShown: true
            }));
        }

        
    }
    
    getGenericContent() {
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/sheets/content/" + (this.props.CurrentPlayer.Nation as INation).Name + "/" + this.props.CurrentPlayer.SheetId;
        fetch(
            URL
        )
        .then( r => r.json() )
        .then(r => {
            this.setState(Object.assign({}, this.state, {GenericContent: r}))
        })
    }

    getRoleContent() {
        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/sheets/content/rolecontent/role/" + this.props.SelectedRole.Name

        fetch(
            URL
        )
        .then( r => r.json() )
        .then(r => {
            this.setState(Object.assign({}, this.state, {RoleContent: r}))
        })
    }

    getData() {
        if(this.props.SocketConnected && !this.props.DaysAbove2){
            this.props.getDaysAbove(this.props.CurrentPlayer);
        }
    }

    render(){
        
        if(!this.props.CurrentPlayer)return <div>loading</div>
        return (
                this.props.CurrentPlayer && <GameWrapper
                    ParallaxImg={PlanetSapien}
                    HeaderText="The Endeavor Accord"
                    match={this.props.match}
                    CurrentPlayer={this.props.CurrentPlayer}
                        ImageStyles={{marginTop: '-100px',
                        minWidth:'110%',
                        maxHeight: '130vh',
                        marginLeft: '-110px'
                    }}
                >   
                    {this.props.DaysAbove2 && this.props.SocketConnected ? 
                        <TopBarContainer /> : null
                    }
                    <Col xs={24} style={{paddingLeft:'13px'}}>
                        <h1 style={{ marginTop: "50px", textAlign:"center" }}>{(this.props.CurrentPlayer.Nation as INation).Name}</h1>
                        <ChartContainer/>
                    </Col>
                    {this.props.CurrentPlayer.GameState == "4A" && !this.props.SelectedRole ? 
                        <Row className="role-selection">
                            
                            {this.state && this.state.GenericContent && 
                                <Col sm={24} md={24} lg={18}>

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
                        <div>
                            <div style={{margin: '75px auto 20px', width: '92%'}}>
                                {this.state.RoleContent && <p><p>{this.state.RoleContent.split("\n")[0]}</p></p>}
                                {this.state.RoleContent && this.state.RoleContent.split("\n").slice(1).map(c => {
                                    return c == c.toUpperCase() ? <h3>{c}</h3> : <p><p>{c}</p></p>
                                })}
                            </div>
                        </div>
                    }
                    {this.props.CurrentPlayer.GameState == "4B" && this.props.SelectedRole ? 
                        <Row className="form-wrapper" type="flex" justify="center" style={{paddingLeft: "0", paddingRight:"0"}}>
                            <Col sm={24} md={24} lg={24}>
                                <label style={{ textAlign:'center', width: '100%', display:'block', marginBottom: '20px' }}>{(this.props.CurrentPlayer.Nation as INation).Name } Platform</label>
                                {_.sortBy(Object.keys(this.props.SelectedRole.RoleTradeRatings), [(o:any) => o ]).map((rating:any, i) => {
                                    return (
                                        <Row className="form-wrapper">
                                            <label>
                                                {rating} MARKET
                                                {(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus == -1 && 
                                                    <span>
                                                        <Icon type="hourglass" style={{marginLeft:"18px"}} />Waiting...
                                                    </span>
                                                }
                                                {(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus == 0 && 
                                                    <span style={{color:"red"}}>
                                                        <Icon type="close-circle-o" style={{marginLeft:"18px"}} /> No Agreement
                                                    </span>
                                                }
                                                {(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus == 1 && 
                                                    <span style={{color:"green"}}>
                                                        <Icon type="check-circle-o" style={{marginLeft:"18px"}}/> Agreement Reached
                                                    </span>
                                                }
                                            </label>
                                            <RadioGroup 
                                                defaultValue={(this.props.SelectedRole.RoleTradeRatings as any)[rating].Value} 
                                                size="large"
                                                ref={rating}
                                            >
                                                <Radio value={1}>Country First</Radio>
                                                <Radio value={2}>Region First</Radio>
                                                <Radio value={3}>Planet First</Radio>
                                            </RadioGroup>
                                            <Button 
                                                type="primary" 
                                                size="large"
                                                disabled={!(this.refs[rating] as any) || !(this.refs[rating] as any).state || !(this.refs[rating] as any).state.value}
                                                onClick={e =>  this.props.submitRoleRating(this.props.SelectedRole.Name, this.props.CurrentPlayer.Slug, {[rating]: {Value: (this.refs[rating] as any).state.value, AgreementStatus:(this.props.SelectedRole.RoleTradeRatings as any)[rating].AgreementStatus }})}
                                            >
                                                Submit {rating.slice(0,1).toUpperCase() + rating.slice(1).toLowerCase()} Selections 
                                            </Button>
                                        </Row>
                                    )
                                })}
                                <span className="scroll-target"/>
                            </Col> 
                        </Row> : null                
                    }
                {this.props.DaysAbove2 && this.props.DaysAbove2 == 0 ? 
                <Modal
                    className="victory-modal"
                    visible={ this.props.DaysAbove2 == 0 && this.state.showVictoryModal }
                    width={"95%"}
                    footer={[<Button onClick={e => this.setState(Object.assign({}, this.state, {
                        showVictoryModal: false
                    }))}>OK</Button>]}
                >
                    <Icon type="trophy" style={{color:"green"}} />
                    <p>Congratulations. You have prevented the temperature on Planet Sapien from ever exceeding 2&#176;C above preindustrial levels.</p>
                </Modal> : null}
               </GameWrapper>
            )
               
    }
}

/** 
 * {this.state.PendingChoice != null && <Icon type="loading"/>}
 * 
 * disabled={!this.state.Selection || this.props.CurrentPlayer.ChosenHorse != null}
                                                onClick={e => this.setDecisionState(this.state.Selection)} */