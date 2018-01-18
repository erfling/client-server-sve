import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';

import { ReactChild } from 'react';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider } from "antd";
const FormItem = Form.Item;

interface FormProps extends InjectedFormProps{
    name:string;
    handleSubmit: (stuff:any) => {};
    PlayerId: string;
}


type TextInputProps = {
    label: string,
    className?: string
} //& WrappedFieldProps

class SliderWrapper extends React.Component<WrappedFieldProps & GenericFieldHTMLAttributes & {min:number, max:number, marks:"hi"}> {
    render() {
        console.log(this.props);
        //const { input: { value, onChange } } = this.props
        const getMarks = (min:number, max:number):{[index: string]:number} => {
        var marks:{[index: string]:number} = {}
        while(max > min-1){
            marks[max] = max;
            max--;
        }
        return marks;
        }
        console.log(getMarks(this.props.min, this.props.max))

        return (
        <div>
            <h3>{this.props.input.value}</h3>
            <Slider 
                onChange={(e) => {console.log(e); this.props.input.onChange(e)}}
                min={this.props.min}
                max={this.props.max}
                marks={getMarks(this.props.min, this.props.max)}
            />
        </div>
        )
    }
}

class SelectWrapper extends React.Component<WrappedFieldProps & GenericFieldHTMLAttributes>{
    render() {
        var children: {props:{children:string}}[] = this.props.children as {props:{children:string}}[];
        var placeholder:{props:{children:string}} = children[0] as { props:{children:string}};
        console.log(placeholder.props)
        return  <Select 
                    onChange={(e) => {console.log(e); this.props.input.onChange(e)}}
                    placeholder={placeholder.props.children}>
                        {children.map((child,i) => {
                            return <Select.Option value={child.props.children} key={i}>{child.valueOf()}</Select.Option>
                        })}
                </Select>
    }
}
/**
 * {this.props.children.map((child) => {
                        
                    })}
 */

interface LabelFieldProps extends Field{
    label:string;
    validateStates: boolean;
}
class LabelField extends Field<LabelFieldProps>{

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
                    <Button onClick={e => this.props.handleSubmit(e)}>Submit</Button>
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
                    />*/ /*
                        <Field name="PeopleOnBoard" component="select">
                            <option>--Select People--</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Field>
                        */