import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Radio, Select, Button, Slider, Icon, Modal } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import {Layout, Row, Col} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import { InputWrapper } from './form-elements/AntdFormWrappers';
import LoginForm from './form-elements/LoginForm';
import formValues from '../../../shared/models/FormValues';
import { loadavg } from 'os';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import Role from '../../../shared/models/IPlayer';
import RoleDetail from './RoleDetail'
import { Link, Route } from "react-router-dom";

const Logo = require('../img/logo.png');
import HealthIcon from '-!svg-react-loader?name=Icon!../img/health-icon.svg';
import IndustryIcon from '-!svg-react-loader?name=Icon!../img/industry-icon.svg';
import GonvernmentIcon from '-!svg-react-loader?name=Icon!../img/government-icon.svg';
import AgriIcon from '-!svg-react-loader?name=Icon!../img/agri-icon.svg';



interface FormProps{
    joinGame: (player:IPlayer) => {}
    getTeams: () => {}
    Teams: ITeam[];
    LoggingIn: boolean;
    Loading: boolean;
    selectTeam: (team: any) => {}
    selectRole: (role:string) => {}
    SelectedTeam: ITeam;
    SelectedRole: string;
    SelectedPlayer: IPlayer;
    CurrentTeam:  ITeam & {CurrentRole: string}
}
export default class LoginFormComponent extends React.Component<FormProps> {    
    componentDidMount(){
        console.log(this.props);
        this.props.getTeams()
    }

    onChangeSelectTeam(){
        let selectEl:HTMLSelectElement = document.querySelector('.selectedTeam')
        let selectedTeam = this.props.Teams.filter(t => t.Slug == selectEl.value)[0] || null;
        if(selectedTeam)this.props.selectTeam(selectedTeam);
    }

    handleCancel(){
       console.log(this);
       this.props.selectRole(null)
    }

    componentDidUpdate(){
        if(this.props.CurrentTeam){
            console.log("LOGIN PREPARING REDIRECT",this.props)
        }
    }
    

    prepareJoinGame(){
        if(this.props.SelectedTeam && this.props.SelectedRole){
            let joinPackage:IPlayer = {
                TeamId: this.props.SelectedTeam.Slug,
                SelectedRole: this.props.SelectedRole
            }
            this.props.joinGame(joinPackage)
        }
    }

    getTitle(role:string){
        role = role.toLocaleUpperCase();
        switch(role){
            case "WARBURTON":
                return "Agriculture"
            case "VANGUARD":
                return "Healthcare"
            case "BENNUCI":
                return "Industry"
            case "GOVERNMENT":
                return "Government"
            default:
                return null
        }
    }

    render(){

        return <Row type="flex" justify="center" className="loginForm">
                        {this.props.SelectedRole && <Modal
                            title={"The Case for " + this.getTitle(this.props.SelectedRole)}
                            visible={"undefined" != typeof this.props.SelectedRole && this.props.SelectedRole.length > 0}
                            footer={[
                                <Button key="back" className="game-button" onClick={e => this.props.selectRole(undefined)}>Close</Button>,
                                <Button key="go" className="game-button go" onClick={e => this.prepareJoinGame()}>Play as {this.props.SelectedRole}</Button>,
                              ]}
                        >
                            <Route component={RoleDetail}/>
                        </Modal>    }
                        {this.props.CurrentTeam && <Redirect to="/who-gets-the-water"/>}
                        {this.props.Teams ? <Row type="flex" justify="center">
                                                <Row>Join a Team
                                                    <select ref="selectedTeam" className="selectedTeam" onChange={e => this.onChangeSelectTeam()}>
                                                        <option> -- Select Your Team -- </option>
                                                        {this.props.Teams.map(( t, i) => {
                                                            return <option key={i} value={t.Slug}>Team {i + 1}</option>
                                                        })                                
                                                        }
                                                    </select>
                                                </Row>
                                                {this.props.SelectedTeam &&
                                                <Row className="role-selection">
                                                    <Col xs={24}>
                                                        
                                                        <Row  type="flex" justify="center">
                                                            <h1>Role Selection</h1>                                                            
                                                        </Row>

                                                        <Row type="flex" justify="center">
                                                            <Col xs={16}>
                                                                <AgriIcon height={400}/>
                                                                <p>The CEO of Warburton, the region's largest agrichemical business faced with growing food production for an escalating population in a time of water scarcity and drought. </p>
                                                                <Button className="game-button block" onClick={e => this.props.selectRole("Warburton")}>Agriculture</Button>
                                                            </Col>
                                                        </Row>

                                                        
                                                        <Row type="flex" justify="center">
                                                            <Col xs={16}>
                                                                <HealthIcon height={400}/>
                                                                <p>The CEO of Vanguard Life, the region's largest health care and insurance provider, who is anxious of increased exposure to climate-sensitive diseases and mental health impacts from severe weather-related events</p>
                                                                <Button className="game-button block" onClick={e => this.props.selectRole("Vanguard")}>Healthcare</Button>
                                                            </Col>
                                                        </Row>

                                                        
                                                        <Row type="flex" justify="center">
                                                            <Col xs={16}>
                                                                <IndustryIcon height={400}/>
                                                                <p>The CEO of Bennuci, the region's largest food and drink company who believes consumer demand will determine their response to climate change mitigation.</p>
                                                                <Button className="game-button block" onClick={e => this.props.selectRole("Bennuci")}>Industry</Button>
                                                            </Col>
                                                        </Row>

                                                        
                                                        <Row type="flex" justify="center">
                                                            <Col xs={16}>
                                                                <GonvernmentIcon height={400}/>
                                                                <p>The Minister for Environment, representing the region's union of country members who are already exposed to the impact of climate change on their communities.</p>
                                                                <Button className="game-button block" onClick={e => this.props.selectRole("Government")}>Government</Button>
                                                            </Col>
                                                        </Row>

                                                        {this.props.SelectedRole && 
                                                            <div>
                                                                <Button onClick={e => this.prepareJoinGame()}>Join {this.props.LoggingIn && <Icon type="loading"/>}</Button>
                                                            </div>
                                                        }
                                                    </Col>                                       
                                                </Row>
                                                }
                                            </Row>
                                            :
                                            <h1>Getting Teams</h1>                                            

                            }  
                    </Row>
    }
}
//<Button>Join</Button>
/*
<select ref="selectedRole" className="selectedRole" onChange={e => this.onChangeSelectRole()}>
                                                                <option> -- Select Your Role -- </option>
                                                                <option value="Cape Banking">Cape Banking</option>
                                                                <option value="Warburton">Warburton</option>
                                                                <option value="Vanguard">Vanguard</option>
                                                                <option value="Demeter">Demeter</option>
                                                            </select>*/