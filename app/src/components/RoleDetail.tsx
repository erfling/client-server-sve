import * as React from "react";
import { Row, Col } from 'antd/lib/grid';
import { Icon } from 'antd/lib';
import { Link, Route } from "react-router-dom";
import {Parallax, Background} from 'react-parallax'; 
import ApplicationStore from '../stores/Store';
import {connect} from 'react-redux';

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class RoleDetailComponent extends React.Component<RoleDetailProps, any> {
    componentDidMount() {
        console.log("role detail PROPS", this.props)
        //this.props.fetchGames();
    }

    componentWillMount(){
    }

    componentWillUnmount(){
        
    }

    getContent(){
        switch(this.props.Role.toLocaleUpperCase()){
            case "WARBURTON":
                return `Population growth increases food production demand to over 80% of available water
                        Diverted water leads to sourcing shifts from surface water to groundwater
                        Groundwater recovery is expensive and requires >20 times the energy to divert 
                        Fertilisers and pesticides which require intense water usage cannot be used
                        Irrigation is unsustainable
                        Yields drop
                        Crops fail as drought increases
                        Food production stops on previously arable land`
            case "VANGUARD":
                return `Growing populations place increased demand on the healthcare services

                Clean water supply failure leads to the use of rainwater and other ‘dirty’ water sources
                
                Sanitation failures lead to massive spikes in infection for those in hospital
                
                Water borne disease increases
                
                Newborns are particularly susceptible to infection and sepsis
                
                Infant mortality significantly increases
                
                Women stop coming to the hospital to give birth
                
                Increases in mortality caused by other birth complications hospitals can treat
                
                Adult populations at greater risk of infections which originate in the hospital like cholera outbreaks
                
                Hospitals are no longer safe and incubate disease`
            case "BENNUCI":
                return `Larger populations increase demand for water intensive production
                        As water becomes scarce degraded water is used impacting product quality
                        Production and output fall as costs escalate
                        Financial pressure leads to headcount decrease
                        Debt spirals and banks refuse to lend as revenues fall
                        Companies collapse infecting the banking system which has unsustainable debt levels across multiple industries`
            case "GOVERNMENT":
                return `Growing populations require water delivered by local government in regional areas
                        Water supply shortages lead to imposed restrictions on personal use to below 25 litres per day
                        Restrictions are insufficient and impact rural areas dramatically stopping supply completely in some areas
                        Mass migration begins as millions head for cities which have more reliable source water
                        Refugee crisis and civil unrest lead to mass anti-government demonstrations
                        Military occupies streets
                        Governments are toppled after a state of emergency is introduced`
            default:
                return null
        }
    }

    //onClick={this.props.testUpdate}
    render() {
        return  <Row type="flex" justify="center" className="banner">
                    <Col xs={24}>
                        {this.getContent()}
                    </Col>
                </Row>
                           
    }
}
export interface RoleDetailProps {
    Role: string
}

const mapStateToProps = (state: ApplicationStore, props: RoleDetailProps): {} => {
    return {
       Role: state.GameData.SelectedRole
    };
};

const mapDispatchToProps = () => {
    return {
    }
}

const RoleDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(RoleDetailComponent);

export default RoleDetail;

