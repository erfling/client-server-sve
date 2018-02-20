import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
import ApplicationStore from '../../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/Actions';
import { RadioButtonWrapper } from './AntdFormWrappers';
import ITeam from '../../../../shared/models/ITeam';
import { Alert } from 'antd';

interface WaterFormProps extends InjectedFormProps{
    Submitting: boolean;
    FormData:any;
    handleSubmit: (formValues:any) => {};
    setWaterValues: () => {}
}

class SliderWrapperField extends Field<{increment:number}>{

}

class WaterFormWrapper extends React.Component<WaterFormProps, { warning:string }> {

    componentWillMount(){
        console.log("MOUNTED")
        this.setState(Object.assign({}, this.state, {warning:""}));
    }

    componentDidUpdate(){
        console.log("Water form updated")
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
                <div className="form-wrapper">
                    <FormItem>
                        <h3>The Case for Agriculture</h3>
                        <div>
                            <p>Population growth increases food production demand to over 80% of available water</p>
                            <p>Diverted water leads to sourcing shifts from surface water to groundwater</p>
                            <p>Groundwater recovery is expensive and requires &gt;20 times the energy to divert</p>
                            <p>Fertilisers and pesticides which require intense water usage cannot be used</p>
                            <p>Irrigation is unsustainable</p>
                            <p>Yields drop</p>
                            <p>Crops fail as drought increases</p>
                            <p>Food production stops on previously arable land</p>
                        </div>
                        <label>Assign Water to Agriculture</label>
                        <Field
                            name="agriculture"
                            component={RadioButtonWrapper}
                            validate={this.selectChanged}
                        > 
                            <option>No Water</option>
                            <option value="SOME">Some Water</option>
                            <option value="ALL">All Water</option>
                        </Field>      
                    </FormItem>
                </div>
                <div className="form-wrapper">
                    <FormItem>
                        <h3>The Case for Healthcare</h3>
                        <div className="form-info">
                            <p>Growing populations place increased demand on the healthcare services</p>
                            <p>Clean water supply failure leads to the use of rainwater and other 'dirty' water sources</p>
                            <p>Sanitation failures lead to massive spikes in infection for those in hospital</p>
                            <p>Water borne disease increases</p><p>Newborns are particularly susceptible to infection and sepsis</p>
                            <p>Infant mortality significantly increases</p><p>Women stop coming to the hospital to give birth</p>
                            <p>Increases in mortality caused by other birth complications hospitals can treat</p>
                            <p>Adult populations at greater risk of infections which originate in the hospital like cholera outbreaks</p>
                            <p>Hospitals are no longer safe and incubate disease</p>
                        </div>
                        <label>Assign Water to Healthcare</label>
                        <Field
                            name="healthcare"
                            component={RadioButtonWrapper}
                            validate={this.selectChanged}
                        > 
                                <option>No Water</option>
                                <option value="SOME">Some Water</option>
                                <option value="ALL">All Water</option>
                        </Field>
                    </FormItem>
                </div>
                <div className="form-wrapper">
                    <FormItem>
                        <h3>The Case for Industry</h3>
                        <div>
                            <p>Larger populations increase demand for water intensive production</p>
                            <p>As water becomes scarce degraded water is used impacting product quality</p>
                            <p>Production and output fall as costs escalate</p>
                            <p>Financial pressure leads to headcount decrease</p>
                            <p>Debt spirals and banks refuse to lend as revenues fall</p>
                            <p>Companies collapse infecting the banking system which has unsustainable debt levels across multiple industries</p>
                        </div>
                        <label>Assign Water to Industry</label>
                        <Field
                            name="industry"
                            component={RadioButtonWrapper}
                            validate={this.selectChanged}
                        > 
                                <option>No Water</option>
                                <option value="SOME">Some Water</option>
                                <option value="ALL">All Water</option>
                        </Field>    
                    </FormItem>
                </div>

                <div className="form-wrapper">
                    <FormItem>
                        <h3>The Case for Government</h3>
                        <div>
                            <p>Growing populations require water delivered by local government in regional areas</p>
                            <p>Water supply shortages lead to imposed restrictions on personal use to below 25 litres per day</p>
                            <p>Restrictions are insufficient and impact rural areas dramatically stopping supply completely in some areas</p>
                            <p>Mass migration begins as millions head for cities which have more reliable source water</p>
                            <p>Refugee crisis and civil unrest lead to mass anti-government demonstrations</p>
                            <p>Military occupies streets</p><p>Governments are toppled after a state of emergency is introduced</p>
                        </div>
                        <label>Assign Water to Government</label>
                        <Field
                            name="government"
                            component={RadioButtonWrapper}
                            validate={this.selectChanged}
                        > 
                                <option>No Water</option>
                                <option value="SOME">Some Water</option>
                                <option value="ALL">All Water</option>
                        </Field>      
                    </FormItem>
                </div>
                <div className="form-wrapper">
                    {this.props.invalid && <Alert style={{marginTop:'15px'}} message="There is only enough water to give some to give all of it to one sector, or some of it to two sectors." type="error"></Alert>}
                    <Button className="game-button block" onClick={e => this.props.handleSubmit(e)} disabled={this.props.invalid}>Distribute Water {this.props.Submitting && <Icon type="loading"/>}</Button>
                </div>
            </form>
                       
    }
}

const mapStateToProps = (state: ApplicationStore, ownProps:WaterFormProps): {} => {
    return {
        Submitting: state.Application.Loading,
        FormData: state.form.waterForm,
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
