import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon } from "antd";
const FormItem = Form.Item;
import ApplicationStore from '../../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/Actions';
import { RadioWrapper } from './AntdFormWrappers';
import ITeam from '../../../../shared/models/ITeam';
import { Alert } from 'antd';

interface DealFormProps extends InjectedFormProps{
    Submitting: boolean;
    FormData:any;
    handleSubmit: (formValues:any) => {};
    setWaterValues: () => {}
    CurrentPlayer: ITeam;
}

class SliderWrapperField extends Field<{increment:number}>{

}

class DealFormWrapper extends React.Component<DealFormProps, { warning:string }> {

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

    getOptionsByTeam():string[]{
        return [
            "China: to get preferential rice import treatment",
            "Japan: to get tech expertise for hydropower",
            "Australia: to get preferential treatment on iron ore exports",
            "Bangladesh: to prevent climate change and not destabilize the region",
            "India: to get BECCs expertise to develop BECCS locally"
        ]
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
                                name="to"
                                component={RadioWrapper}
                                validate={this.selectChanged}
                            > 
                                {this.props.CurrentPlayer.Nation.TradeOptions.map((o:string, i:number) => <option key={i}>{o}</option>)}
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
        CurrentPlayer: state.GameData.CurrentPlayer
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
