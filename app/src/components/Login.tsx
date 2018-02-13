import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import {Layout, Row, Col} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import { InputWrapper } from './form-elements/AntdFormWrappers';
import LoginForm from './form-elements/LoginForm';
import formValues from '../../../shared/models/FormValues';
import { loadavg } from 'os';
import ITeam from '../../../shared/models/ITeam';
import Role from '../../../shared/models/IPlayer';

const Logo = require('../img/logo.png');



interface FormProps{
    login: (loginInfo:any) => {}
    getTeams: () => {}
    Teams: ITeam[];
    LoggingIn: boolean;
    Loading: boolean;
    selectTeam: (team: any) => {}
    selectRole: (role:string) => {}
    SelectedTeam: ITeam;
    SelectedRole: string;
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

    onChangeSelectRole(){
        let selectEl:HTMLSelectElement = document.querySelector('.selectedRole');
        if(selectEl)this.props.selectRole(selectEl.value)
    }

    componentDidUpdate(){
        if(this.props.CurrentTeam){
            console.log("LOGIN PREPARING REDIRECT",this.props)
        }
    }

    prepareJoinGame(){
        if(this.props.SelectedTeam && this.props.SelectedRole){
            let joinPackage = {
                SelectedTeam: this.props.SelectedTeam,
                SelectedRole: this.props.SelectedRole
            }
            this.props.login(joinPackage)
        }
    }

    render(){

        return <Layout>
                <Content>
                    <Row type="flex" justify="center" className="loginForm">
                        <Col xs={16} sm={12} lg={8}>
                        {this.props.CurrentTeam && <Redirect to={this.props.CurrentTeam.CurrentRole}/>}
                        {this.props.Teams ? <div>
                                                <img src={Logo} style={{width:'252px'}}/>
                                                <label>Join a Team
                                                    <select ref="selectedTeam" className="selectedTeam" onChange={e => this.onChangeSelectTeam()}>
                                                        <option> -- Select Your Team -- </option>
                                                        {this.props.Teams.map(( t, i) => {
                                                            return <option key={i} value={t.Slug}>Team {i + 1}</option>
                                                        })                                
                                                        }
                                                    </select>
                                                </label>
                                                {this.props.SelectedTeam && 
                                                    <div>
                                                        <label>Join a Team
                                                            <select ref="selectedRole" className="selectedRole" onChange={e => this.onChangeSelectRole()}>
                                                                <option> -- Select Your Role -- </option>
                                                                <option value="Cape Banking">Cape Banking</option>
                                                                <option value="Warburton">Warburton</option>
                                                                <option value="Vanguard">Vanguard</option>
                                                                <option value="Demeter">Demeter</option>
                                                            </select>
                                                        </label>
                                                        {this.props.SelectedRole && 
                                                            <div>
                                                                <Button onClick={e => this.prepareJoinGame()}>Join {this.props.LoggingIn && <Icon type="loading"/>}</Button>
                                                            </div>
                                                        }
                                                    </div>
                                                    
                                                
                                                }
                                            </div>
                                            :
                                            <h1>Getting Teams</h1>                                            

                            }

                            
                        </Col>  
                    </Row>
                </Content>                
            </Layout>
    }
}
//<Button>Join</Button>