import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Radio, Select, Button, Slider, Icon, Modal } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import {Layout, Row, Col} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import { InputWrapper, SelectWrapper } from './form-elements/AntdFormWrappers';
import LoginForm from './form-elements/LoginForm';
import formValues from '../../../shared/models/FormValues';
import { loadavg } from 'os';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import IGame from '../../../shared/models/IGame';
import Role from '../../../shared/models/IPlayer';
import RoleDetail from './RoleDetail'
import { Link, Route } from "react-router-dom";
import {RoleName} from '../../../shared/models/RoleName';

const Logo = require('../img/logo.png');
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');

interface FormProps{
    joinGame: (player:IPlayer) => {}
    getTeams: () => {}
    getGames: () => {}
    Teams: ITeam[];
    CurrentGame: IGame;
    LoggingIn: boolean;
    Loading: boolean;
    selectTeam: (team: any) => {}
    selectRole: (role:string) => {}
    SelectedTeam: ITeam;
    SelectedRole: string;
    SelectedPlayer: IPlayer;
    CurrentTeam:  ITeam & {CurrentRole: string}
}
export default class LoginFormComponent extends React.Component<FormProps, {TeamOptions:any[], SelectedGame: IGame}> {
    
    componentWillMount(){
        this.setState({TeamOptions:[], SelectedGame: null})
        this.props.getTeams();
        this.props.getGames();
    }
    
    componentDidMount(){
    }

    getOptions(){
        this.setState({TeamOptions: this.props.Teams.map((t, i) => {
            return <option key={i} value={t.Slug}>Team {i + 1}</option>
        })})
    }

    onChangeSelectTeam(value: any){
        console.log("SELECTED: ", value)
        let selectedTeam = this.props.Teams.filter(t => t.Slug == value)[0] || null;
        if(selectedTeam){
            this.props.selectTeam(selectedTeam);
            console.log(this.props.SelectedTeam)
            this.props.joinGame(selectedTeam)
        }
        /*
        setTimeout(() => {
            var scrollTarget = document.querySelector(".role-selection")
            if(scrollTarget)scrollTarget.scrollIntoView({ behavior: 'smooth' ,block: 'start' });
        },200);
        */        
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

        return <div style={{background: `url(${Hurricane})`, backgroundSize:'cover'}}>                        
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

                    {this.props.CurrentGame && 
                        <Row type="flex" justify="center" style={{height:'100vh', justifyContent: 'center'}}>                                            
                            <Col xs={24} sm={16} lg={12} xl={12} style={{marginTop: '35vh'}}>
                                <div className="form-wrapper" style={{background: "rgba(255,255,255,.6)"}}>
                                    <p style={{margin: '10px', fontWeight: 'bold'}}>Select Your Team to Join</p>
                                    <Select style={{width:'100%'}} onChange={val => this.onChangeSelectTeam(val)} placeholder="--Select Team--">
                                        {(this.props.CurrentGame.Teams as ITeam[]).map(( t, i) => {
                                            return <Select.Option key={i+1} value={t.Slug}>Team {i + 1}</Select.Option>
                                        })}                                                   
                                    </Select>
                                </div>
                            </Col>                                                   
                        </Row>

                    } 
                    
                </div>
    }
}