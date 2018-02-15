import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
import ApplicationStore from '../../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/Actions';
import { SelectWrapper } from './AntdFormWrappers';
import ITeam from '../../../../shared/models/ITeam';
import { Alert } from 'antd';
interface WaterFormProps extends InjectedFormProps{
    Submitting: boolean;
    FormData:any;
    handleSubmit: (formValues:any) => {};
}

class SliderWrapperField extends Field<{increment:number}>{

}

class WaterFormWrapper extends React.Component<WaterFormProps, { warning:string }> {

    componentWillMount(){
        this.setState(Object.assign({}, this.state, {warning:""}));
    }
   
    selectChanged(e:any, allValues:any){
        console.log(e);
        let distributionCount = 0;
        console.log(allValues);
        for (let prop in allValues){
            if(allValues[prop] == "ALL"){
                distributionCount += 2
            } else if (allValues[prop] == ["SOME"]){
                distributionCount += 1
            }
        }
        return distributionCount > 2;       
    }
    
    hasErrors(){
        if(!this.props.FormData){
            return false;
        }
        console.log(this.props.FormData.synchErrors, this.props.FormData)
        return this.props.FormData.synchErrors != undefined;
    }

    render(){
        return <form ref="waterForm" id="waterForm">
                <h2>Who Gets the Water?</h2>
                <FormItem>
                    <label>Agriculture</label>
                    <Field
                        name="agriculture"
                        component={SelectWrapper}
                        validate={this.selectChanged}
                    > 
                        <option>No Water</option>
                        <option value="SOME">Some Water</option>
                        <option value="ALL">All Water</option>
                    </Field>      
                </FormItem>
                <FormItem>
                    <label>Healthcare</label>
                    <Field
                        name="healthcare"
                        component={SelectWrapper}
                        validate={this.selectChanged}
                    > 
                            <option>No Water</option>
                            <option value="SOME">Some Water</option>
                            <option value="ALL">All Water</option>
                    </Field>
                </FormItem>
                <FormItem>
                    <label>Industry</label>
                    <Field
                        name="industry"
                        component={SelectWrapper}
                    > 
                            <option>No Water</option>
                            <option value="SOME">Some Water</option>
                            <option value="ALL">All Water</option>
                    </Field>    
                </FormItem>
                <FormItem>
                    <label>Government</label>
                    <Field
                        name="government"
                        component={SelectWrapper}
                    > 
                            <option>No Water</option>
                            <option value="SOME">Some Water</option>
                            <option value="ALL">All Water</option>
                    </Field>      
                </FormItem>
                <Button className="game-button" onClick={e => this.props.handleSubmit(e)} disabled={this.props.invalid}>Distrubute Water {this.props.Submitting && <Icon type="loading"/>}</Button>
                {this.props.invalid && <Alert message="There is only enough water to give some to give all of it to one sector, or some of it to two sectors." type="error"></Alert>}
            </form>
                       
    }
}

const mapStateToProps = (state: ApplicationStore, ownProps:WaterFormProps): {} => {
    return {
        Submitting: state.Application.Submitting,
        FormData: state.form.waterForm
    };
};

const mapDispatchToProps = () => {
    return {
    }
}

const ConnectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(WaterFormWrapper);

const WaterForm = reduxForm({
    destroyOnUnmount:false,
})(ConnectedForm);

export default WaterForm;
