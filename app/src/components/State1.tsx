import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import {Layout, Row, Col} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import LoginForm from './form-elements/LoginForm';
import formValues from '../../../shared/models/FormValues';
import { loadavg } from 'os';
import ITeam from '../../../shared/models/ITeam';
import Role from '../../../shared/models/IPlayer';
import WaterForm from './form-elements/WaterForm'
interface State1Props{
   CurrentTeam: ITeam & {CurrentRole: string}
}
export default class State1 extends React.Component<State1Props> {    


    render(){

        return <Layout>
                <Content>
                    <Row type="flex" justify="center">
                        <Col xs={24} sm={24} lg={16}>
                            <h3>Welcome to Planet Sapien</h3>
                            {this.props.CurrentTeam && <h4>
                                                            You are the CEO of {this.props.CurrentTeam.CurrentRole}.
                                                       </h4>
                            }
                        </Col> 
                    </Row>
                    <Row>
                        <WaterForm
                            form='waterForm'
                        />
                    </Row>
                </Content>                
            </Layout>
    }
}
//<Button>Join</Button>
//                    <Button onClick={e => this.props.handleSubmit(e)}>Join {this.props.Submitting && <Icon type="loading"/>}</Button>