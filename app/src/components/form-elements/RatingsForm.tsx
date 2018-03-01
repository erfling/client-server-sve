import * as React from 'react';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ReactNode } from 'react-redux';
import { Form, Input, Radio, Select, Button, Slider, Icon, Alert } from "antd";
const FormItem = Form.Item;
import ApplicationStore from '../../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/Actions';
import { SliderWrapper } from './AntdFormWrappers';
import ITeam from '../../../../shared/models/ITeam';
import INation from '../../../../shared/models/INation';
import ITradeOption from '../../../../shared/models/ITradeOption';
import GoogleSheets from '../../../../api/src/models/GoogleSheets';
import IDeal from '../../../../shared/models/IDeal';

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

class RatingsFormWrapper extends React.Component<DealFormProps, { warning:string, Criteria:string[] }>
{

    getCriteria() {
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/getCriteria";

        fetch(URL)
        .then( r => r.json() )
        .then(r => {
            console.log("DIG!!!:", r, typeof r, Array.isArray(r));
            this.setState(Object.assign({}, this.state, {Criteria: r}));
        })
    }

    getOptionsByTeam():{value: string, text: string}[] {
        var options = [
            "Australia",
            "Bangladesh",
            "China",
            "India",
            "Japan",
            "Vietnam"
        ].filter(s => s != (this.props.CurrentPlayer.Nation as INation).Name)
         .map(s => {
             return {
                        text:"Invest $" + (this.props.CurrentPlayer.DealsProposedTo.length ? ((((this.props.CurrentPlayer.DealsProposedTo[0]) as IDeal).Value + 1) * 10) : "10") + " billion in " + s,
                        value:s
                    }
        })
         return options;
    }

    componentWillMount(){
        console.log("MOUNTED")
        this.setState(Object.assign({}, this.state, {warning:""}));
        this.getCriteria();
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
                   {this.props.CurrentPlayer && this.state.Criteria ? this.getOptionsByTeam().map(o => {
                       return <div><label>How did {o.value} do?</label>

                       {this.state.Criteria.map(c => {
                           return <FormItem>
                                        <label>{c}</label>
                                        <Field
                                            name={o.value+'_'+c}
                                            component={SliderWrapper}
                                            validate={this.selectChanged}
                                            min={1}
                                            max={10}
                                        >                                        
                                        </Field>
                                          
                                </FormItem>
                            })}
                            </div>
                       })
                :
                null
                }
                    
                </div>
               
                <div className="form-wrapper" style={{backgroundColor: 'transparent'}}>
                    {this.props.FormData && <Button className="game-button block" onClick={e => this.props.handleSubmit(e)} disabled={!this.props.FormData.values}>Submit Ratings {this.props.Submitting && <Icon type="loading"/>}</Button>}
                    {this.props.CurrentPlayer.Ratings && <Alert message="Your ratings have been submitted." type="success" />}
                </div>
            </form>
                       
    }
}

const mapStateToProps = (state: ApplicationStore, ownProps:DealFormProps): {} => {
    return {
        Submitting: state.Application.Loading,
        FormData: state.form.ratingsForm,
        CurrentPlayer: state.GameData.CurrentPlayer,
        //Options: (state.GameData.CurrentPlayer.Nation as INation).TradeOptions as ITradeOption[]
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
