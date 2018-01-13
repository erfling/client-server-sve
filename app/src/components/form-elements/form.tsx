import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps } from 'redux-form';
import { ReactChild } from 'react';
import { ReactNode } from 'react-redux';

type FormProps = {
    name:string;
}
interface MyField extends Field{
}
class AppForm extends React.Component<InjectedFormProps & FormProps> {
    render(){
        return <div>
                <h1>Form Exists</h1>
                <form id={this.props.name}>
                    <Field
                        name="testField"
                        type="text"
                        component="input"
                    />
                </form>
            </div>
    }
}

const BaseForm = reduxForm({
    destroyOnUnmount:false,
})(AppForm);

export default BaseForm;



