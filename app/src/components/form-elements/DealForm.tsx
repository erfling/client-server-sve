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
import INation from '../../../../shared/models/INation';
import ITradeOption from '../../../../shared/models/ITradeOption';
import { Alert } from 'antd';

interface DealFormProps extends InjectedFormProps{
    Submitting: boolean;
    FormData:any;
    handleSubmit: (formValues:any) => {};
    setWaterValues: () => {}
    CurrentPlayer: ITeam;
    Options: any
}

class SliderWrapperField extends Field<{increment:number}>{

}

class DealFormWrapper extends React.Component<DealFormProps, { warning:string }> {

    componentWillMount(){
        console.log("MOUNTED")
        this.setState(Object.assign({}, this.state, {warning:""}));
    }

    componentDidUpdate(){
       
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

    getOptionsByTeam():string[]{
        return [
            "Australia",
            "Bangladesh",
            "China",
            "India",
            "Japan",
            "Vietnam"
        ].filter(s => s != (this.props.CurrentPlayer.Nation as INation).Name)
        /*
         
 

 
 */
    }
    
    hasErrors(){
        if(!this.props.FormData){
            return false;
        }
        console.log(this.props.FormData.synchErrors, this.props.FormData)
        return this.props.FormData.synchErrors != undefined;
    }

    render(){
        
        return <form ref="dealForm" id="dealForm">
                <div className="form-wrapper">
                     <FormItem>
                        {this.props.CurrentPlayer && 
                            <Field
                                name="chosenDeal"
                                component={SelectWrapper}
                                placeholder="Select A Nation"
                            > 
                                <option value={null}>Select a Nation</option>
                                {this.getOptionsByTeam().map((o:string, i:number) => <option key={i} value={o}>{o}</option>)}
                            </Field>
                        }      
                    </FormItem>
                </div>
               
                <div className="form-wrapper" style={{backgroundColor: 'transparent'}}>
                    {this.props.FormData && <Button className="game-button block" onClick={e => this.props.handleSubmit(e)} disabled={!this.props.FormData.values}>Propose Deal {this.props.Submitting && <Icon type="loading"/>}</Button>}
                </div>
            </form>
                       
    }
}

const mapStateToProps = (state: ApplicationStore, ownProps:DealFormProps): {} => {
    return {
        Submitting: state.Application.Loading,
        FormData: state.form.dealForm,
        CurrentPlayer: state.GameData.CurrentPlayer,
        Options: (state.GameData.CurrentPlayer.Nation as INation).Content[0]
    };
};

const mapDispatchToProps = () => {
    return {
    }
}

const ConnectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(DealFormWrapper);

const DealForm = reduxForm({
    destroyOnUnmount:false,
})(ConnectedForm);

export default DealForm;
/**                   
                     */