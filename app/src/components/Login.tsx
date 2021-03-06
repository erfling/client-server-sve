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
import INation from '../../../shared/models/INation';
import IPlayer from '../../../shared/models/IPlayer';
import IGame from '../../../shared/models/IGame';
import Role from '../../../shared/models/IPlayer';
import RoleDetail from './RoleDetail'
import { Link, Route } from "react-router-dom";
import {RoleName} from '../../../shared/models/RoleName';
import * as _ from "lodash";

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
    SelectedTeam: ITeam;
    SelectedPlayer: IPlayer;
    CurrentTeam:  ITeam & {CurrentRole: string}
}
export default class LoginFormComponent extends React.Component<FormProps, {TeamOptions:any[], SelectedGame: IGame}> {
    
    componentWillMount(){
        this.setState({TeamOptions:[], SelectedGame: null})
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
        console.log("SELECTED: ", value, this.props.Teams);
        let selectedTeam = (this.props.CurrentGame.Teams as ITeam[]).filter(t => t.Slug == value)[0] || null;
        if(selectedTeam){
            this.props.selectTeam(selectedTeam);
            console.log(this.props.SelectedTeam)
            this.props.joinGame(selectedTeam)
        }   
    }



    componentDidUpdate(){
        if(this.props.CurrentTeam){
            console.log("LOGIN PREPARING REDIRECT",this.props)
        }
    }
    
    sortTeams(array:any[], property:string){
        _.sortBy(array, [function(o:any) { return o[property]; }]);
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
                  
                    {this.props.CurrentTeam && <Redirect to="/who-gets-the-water"/>}

                    {this.props.CurrentGame && 
                        <Row type="flex" justify="center" style={{height:'100vh', justifyContent: 'center'}}>                                            
                            <Col xs={24} sm={16} lg={12} xl={12} style={{marginTop: '35vh'}}>
                                <div className="form-wrapper" style={{background: "rgba(255,255,255,.6)"}}>
                                    <p style={{margin: '10px', fontWeight: 'bold'}}>Select Your Team to Join</p>
                                    <Select style={{width:'100%'}} onChange={val => this.onChangeSelectTeam(val)} placeholder="--Select Team--">
                                        {_.sortBy(this.props.CurrentGame.Teams as ITeam[], [(team:ITeam) =>  (team.Nation as INation).Name ]).map(( t, i) => {
                                            console.log(i, (t.Nation as INation).Name);
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