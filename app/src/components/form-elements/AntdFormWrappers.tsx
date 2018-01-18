import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import * as React from 'react';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider } from "antd";

export class SliderWrapper extends React.Component<WrappedFieldProps & GenericFieldHTMLAttributes & {min:number, max:number, marks:"hi"}> {
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

export class SelectWrapper extends React.Component<WrappedFieldProps & GenericFieldHTMLAttributes>{
    render() {
        var children: {props:{children:string}}[] = this.props.children as {props:{children:string}}[];
        var placeholder:{props:{children:string}} = children[0] as { props:{children:string}};
        return  <Select 
                    onChange={(e) => {console.log(e); this.props.input.onChange(e)}}
                    placeholder={placeholder.props.children}>
                        {children.map((child,i) => {
                            return <Select.Option value={child.props.children} key={i}>{child.valueOf()}</Select.Option>
                        })}
                </Select>
    }
}