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
import { SelectValue } from 'antd/lib/select';

const Logo = require('../img/logo.png');
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');

interface FormProps{
    joinGame: (player:IPlayer) => {}
    getTeams: () => {}
    getGames: () => {}
    Teams: ITeam[];
    CurrentGames: IGame[];
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
        this.props.getTeams();
        this.props.getGames();
    }
    
    getOptions(){
        this.setState({TeamOptions: this.props.Teams.map((t, i) => {
            return <option key={i} value={t.Slug}>Team {i + 1}</option>
        })})
    }

    componentDidUpdate(){
        if(this.props.CurrentTeam){
            console.log("LOGIN PREPARING REDIRECT",this.props)
        }
    }

    onChangeSelectGame(gameId: SelectValue){
        console.log("SELECTED: ", gameId);
        this.setState(Object.assign({} , this.state, {SelectedGame: this.props.CurrentGames.filter(g => g._id == gameId)[0] || null})) 
    }

    onChangeSelectTeam(value: any){
        console.log("SELECTED: ", value)
        let selectedTeam = this.props.Teams.filter(t => t.Slug == value)[0] || null;
        if(selectedTeam){
            this.props.selectTeam(selectedTeam);
            console.log(this.props.SelectedTeam)
            this.props.joinGame(selectedTeam)
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

        return <div style={{background: `url(${Hurricane})`, backgroundSize:'cover', minHeight:'100vh'}}>                        
                  
                    {this.props.CurrentTeam && <Redirect to="/who-gets-the-water"/>}

                    {this.props.CurrentGames && <Row type="flex" justify="center">                                            
                        <Col xs={24} sm={16} lg={12} xl={12} style={{marginTop: '35vh'}}>
                            <div className="form-wrapper" style={{background: "rgba(255,255,255,.6)"}}>                                       
                                <label>Join a Game</label>
                                <Select style={{width:'100%'}} onChange={val => this.onChangeSelectGame(val)} placeholder="--Select Game--">
                                    {this.props.CurrentGames.map(( g, i) => {
                                        return <Select.Option key={i+1} value={g._id}>{(g.Name + " " || null)}</Select.Option>
                                    })}                                                  
                                </Select>
                            </div>
                        </Col>                                                   
                    </Row>}   

                    {this.state.SelectedGame && 
                        <Row type="flex" justify="center">                                            
                            <Col xs={24} sm={16} lg={12} xl={12} style={{marginTop: '30px'}}>
                                <div className="form-wrapper" style={{background: "rgba(255,255,255,.6)"}}>
                                    <p style={{margin: '10px', fontWeight: 'bold'}}>Select Your Country</p>
                                    <Select style={{width:'100%'}} onChange={val => this.onChangeSelectTeam(val)} placeholder="--Select Team--">
                                        {(this.state.SelectedGame.Teams as ITeam[]).sort((a,b) => (a.Nation as INation).Name > (b.Nation as INation).Name ? 1 : 0).map(( t, i) => {
                                            return <Select.Option key={i+1} value={t.Slug}>{(t.Nation as INation).Name || "Team " + (i + 1)}</Select.Option>
                                        })}                                                   
                                    </Select>
                                </div>
                            </Col>                                                   
                        </Row>

                    }  
                    
                </div>
    }
}
/*                                            
                                        return <Select.Option key={i+1} value={g._id}>{(g.Name + " " || null) +  g.Location + " " + new Date(g.DatePlayed).toLocaleDateString()}</Select.Option>

return <Select.Option key={i+1} value={t.Slug}>Team {i + 1}</Select.Option>
 */