import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
import ApplicationStore from '../../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/Actions';
import { InputWrapper, SelectWrapper } from './AntdFormWrappers';
import ITeam from '../../../../shared/models/ITeam';

interface FormProps extends InjectedFormProps{
    name:string;
    PlayerId: string;
    Submitting: boolean
    handleSubmit: (formValues:any) => {};
    Teams: ITeam[]
}


class LoginFormWrapper extends React.Component<FormProps> {    
    render(){
        console.log(this);
        return <form ref="login-form" id="login-form">
                    <h2>Join Game</h2>
                    {this.props.Teams && this.props.Teams.length}
                    {this.props.Teams && <FormItem>
                        <label>Select Team</label>
                        <Field name="team" component={SelectWrapper}>   
                            <option>-- Select Your Team --</option>
                            {this.props.Teams.map((t) => {
                                console.log("TEAM IN SELECT",t);
                                return <option value={t.Slug}>{t.Slug}</option>
                            })}
                        </Field>
                    
   
                    </FormItem>}    
                    <Button onClick={e => this.props.handleSubmit(e)}>Join {this.props.Submitting && <Icon type="loading"/>}</Button>
                </form>
                       
    }
}

/**                     <label>Select Your Role:</label>
                        <Field name="role" component={SelectWrapper}>

                        </Field> */


interface DispatchProps {
    login: (pin:string) => {}
    getTeams: () => {}
}

const mapStateToProps = (state: ApplicationStore, ownProps: {}): {} => {
    return {
        Submitting: state.Application.Submitting,
        Teams: state.GameData.Team
    };
};

const mapDispatchToProps = () => {
    return {
    }
}

const ConnectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginFormWrapper);

const LoginForm = reduxForm({
    destroyOnUnmount:false,
})(ConnectedForm);

export default LoginForm;