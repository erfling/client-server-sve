import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;

import { SelectWrapper, SliderWrapper} from './AntdFormWrappers'

interface FormProps extends InjectedFormProps{
    name:string;
    handleSubmit: (stuff:any) => {};
    PlayerId: string;
    submitting: boolean
}
class AppForm extends React.Component<FormProps> {
    render(){
        return <div>
                <h1>{this.props.name}</h1>
                <form ref="form" id={this.props.name}>
                    <FormItem>
                        <label>People On Board</label>
                        <Field
                            name="PeopleOnBoard"
                            component={SliderWrapper}
                            min={1}
                            max={5}
                        />
                       
                    </FormItem>

                    <FormItem>
                        <label>Launch Date</label>
                        <Field name="LaunchDate" component={SelectWrapper}>
                            <option>--Select Launch Date--</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </Field>
                    </FormItem>

                    <FormItem>
                        <label>Budget</label>
                        <Field name="Budget" component={SelectWrapper}>
                            <option>--Select Budget--</option>
                            <option value="$1 Billion">$1 Billion</option>
                            <option value="$2 Billion">$2 Billion</option>
                            <option value="$3 Billion">$3 Billion</option>
                        </Field>
                    </FormItem>
                    
                    <FormItem>
                        <label>Recruiting Budget</label>
                        <Field name="RecruitingBudget" component={SelectWrapper}>
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
                    </FormItem>
                    <Button onClick={e => this.props.handleSubmit(e)}>Submit {this.props.submitting && <Icon type="loading"/>}</Button>
                </form>
            </div>
    }
}

const BaseForm = reduxForm({
    destroyOnUnmount:false,
})(AppForm);

export default BaseForm;