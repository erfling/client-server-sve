import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
import ApplicationStore from '../../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/Actions';
import { SliderWrapper } from './AntdFormWrappers';
import ITeam from '../../../../shared/models/ITeam';
import INation from '../../../../shared/models/INation';
import ITradeOption from '../../../../shared/models/ITradeOption';
import { Alert } from 'antd';

interface DealFormProps extends InjectedFormProps{
    Submitting: boolean;
    FormData:any;
    handleSubmit: (formValues:any) => {};
    setWaterValues: () => {}
    CurrentPlayer: ITeam;
    Options: ITradeOption[]
}

class SliderWrapperField extends Field<{increment:number}>{

}

class RatingsFormWrapper extends React.Component<DealFormProps, { warning:string }> {

    componentWillMount(){
        console.log("MOUNTED")
        this.setState(Object.assign({}, this.state, {warning:""}));
    }

    componentDidUpdate(){
       
    }
   
    selectChanged(e:any, allValues:any){
        console.log(e);
        console.log(allValues);  
    }
    
    hasErrors(){
        if(!this.props.FormData){
            return false;
        }
        console.log(this.props.FormData.synchErrors, this.props.FormData)
        return this.props.FormData.synchErrors != undefined;
    }

    render(){
        
        return <form ref="ratingsFrom" id="ratingsForm">
                <h3>Rate the other teams.</h3>
                <div className="form-wrapper">
                   {this.props.Options && this.props.Options.map(o => {
                       return <FormItem>
                                    <label>How did {o.ToNationId} do?</label>
                                    <Field
                                        name={o.ToNationId}
                                        component={SliderWrapper}
                                        validate={this.selectChanged}
                                        min={1}
                                        max={10}
                                    >                                        
                                    </Field>
                                      
                            </FormItem>
                   })}
                    
                </div>
               
                <div className="form-wrapper" style={{backgroundColor: 'transparent'}}>
                    {this.props.FormData && <Button className="game-button block" onClick={e => this.props.handleSubmit(e)} disabled={!this.props.FormData.values}>Submit Ratings {this.props.Submitting && <Icon type="loading"/>}</Button>}
                </div>
            </form>
                       
    }
}

const mapStateToProps = (state: ApplicationStore, ownProps:DealFormProps): {} => {
    return {
        Submitting: state.Application.Loading,
        FormData: state.form.ratingsForm,
        CurrentPlayer: state.GameData.CurrentPlayer,
        Options: (state.GameData.CurrentPlayer.Nation as INation).TradeOptions as ITradeOption[]
    };
};

const mapDispatchToProps = () => {
    return {
    }
}

const ConnectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(RatingsFormWrapper);

const RatingsForm = reduxForm({
    destroyOnUnmount:false,
    form: "ratingsForm"
})(ConnectedForm);

export default RatingsForm;
