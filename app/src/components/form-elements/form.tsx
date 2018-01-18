import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps } from 'redux-form';

import { ReactChild } from 'react';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider } from "antd";
const FormItem = Form.Item;

interface FormProps extends InjectedFormProps{
    name:string;
    handleSubmit: (stuff:any) => {};
    PlayerId: string;
}
interface MyField extends Field{
    lable:string;
    validateStates: boolean;
}

type TextInputProps = {
    label: string,
    className?: string
} //& WrappedFieldProps

/*
const TextInput: React.StatelessComponent<TextInputProps> = ({ className, input, label, meta: { touched, error, warning }, ...otherProps }) => {
    return (
        <label className={className} {...otherProps}>
            {label}
            <input {...input} placeholder={label} type="text" />
            {touched && ((error && <div>{error}</div>) || (warning && <div>{warning}</div>))}
            <Slider></Slider>
        </label>
    )
}
  */
  //TODO: figure out on change
  class MyCustomInput extends React.Component<WrappedFieldProps> {
    render() {
      //const { input: { value, onChange } } = this.props
      return (
        <div>
          <h3>I exist</h3>
          <Slider/>
        </div>
      )
    }
  }
class CustomField extends Field{
}
class AppForm extends React.Component<FormProps> {
    render(){
        return <div>
                <h1>{this.props.name}</h1>
                <form id={this.props.name} onSubmit={e => {this.props.handleSubmit(e)}}>
                    <div>
                        <label>People On Board</label>
                        <Field
                            name="test"
                            component={MyCustomInput}
                        />
                        <Field name="PeopleOnBoard" component="select">
                            <option>--Select People--</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Field>
                    </div>
                        <Field name="Testing" component="select">
                            <option>--Select People--</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Field>

                    <div>
                        <label>Launch Date</label>
                        <Field name="LaunchDate" component="select">
                            <option>--Select Launch Date--</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </Field>
                    </div>

                    <div>
                        <label>Budget</label>
                        <Field name="Budget" component="select">
                            <option>--Select Budget--</option>
                            <option value="$1 Billion">$1 Billion</option>
                            <option value="$2 Billion">$2 Billion</option>
                            <option value="$3 Billion">$3 Billion</option>
                        </Field>
                    </div>
                    
                    <div>
                        <label>Recruiting Budget</label>
                        <Field name="RecruitingBudget" component="select">
                            <option>--Select Recruiting Budget--</option>
                            <option value="$1,000,000">$1,000,000</option>
                            <option value="$2,000,000">$2,000,000</option>
                            <option value="$3,000,000">$3,000,000</option>
                            <option value="$4,000,000">$4,000,000</option>
                            <option value="$5,000,000">$5,000,000</option>
                            <option value="$6,000,000">$6,000,000</option>
                            <option value="$7,000,000">$7,000,000</option>
                            <option value="$8,000,000">$8,000,000</option>
                            <option value="$9,000,000">$9,000,000</option>
                            <option value="$10,000,000">$10,000,000</option>
                        </Field>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
    }
}

const BaseForm = reduxForm({
    destroyOnUnmount:false,
})(AppForm);

export default BaseForm;
/*           <Field
                        name="testField"
                        type="text"
                        component="input"
                    />*/