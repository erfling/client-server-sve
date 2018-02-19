import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form } from "antd";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
const FormItem = Form.Item;
import IGame from '../../../../shared/models/IGame';
import { SelectWrapper, InputWrapper, DateWrapper } from './AntdFormWrappers'
import { connect } from 'react-redux';
import  ApplicationStore from '../../stores/Store';

const mapStateToProps = (state: ApplicationStore, ownProps: {}): {Submitting: boolean} => {
    return {
        Submitting: state.Application.Submitting
    };
};

const mapDispatchToProps = () => {
    return {
       
    }
}

interface FormProps extends InjectedFormProps{
    name:string;
    handleSubmit: (formValues:any) => {};
    PlayerId: string;
    Submitting: boolean;
    Game:IGame;
    IsSubmitting:boolean;
    initialValues: IGame
}
class AdminGameForm extends React.Component<FormProps> {
    render(){
        console.log(this.props);
        return <div>
                <form ref="form" id="game-form">

                    <FormItem>
                        <label>Name</label>
                        <Field
                            name="Name"
                            component={InputWrapper}
                            defaultValue={this.props.initialValues.Name}
                        />                       
                    </FormItem>

                    <FormItem>
                        <label>Location</label>
                        <Field
                            name="Location"
                            component={InputWrapper}
                            defaultValue={this.props.initialValues.Location}
                        />                       
                    </FormItem> 

                    <FormItem>
                        <label>Game Date</label>
                        <Field
                            name="DatePlayed"
                            component={DateWrapper}
                            defaultValue={this.props.initialValues.DatePlayed}
                        />                       
                    </FormItem>

                    <FormItem>
                        <label>URL Segment</label>
                        <Field
                            name="Slug"
                            component={InputWrapper}
                            defaultValue={this.props.initialValues.Slug}
                        />                       
                    </FormItem>

                    <FormItem>
                        <label>Source Spreadsheet (will be copied for each team)</label>
                        <Field
                            name="SourceSheetId"
                            component={InputWrapper}
                            defaultValue={this.props.initialValues.SourceSheetId || "1R5Od_XTcwDyOKsLHaABHL8o9cl7Qg7P3zlYyBUUWds8"}
                        />                       
                    </FormItem>

                    <Button onClick={e => this.props.handleSubmit(e)}>Save {this.props.Submitting && <Icon type="loading"/>}</Button>
                </form>
            </div>
    }
}

const ConnectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminGameForm);

const AdminForm = reduxForm({
    destroyOnUnmount:false,
})(ConnectedForm);

export default AdminForm;