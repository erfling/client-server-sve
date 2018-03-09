import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import { reduxForm, Field, WrappedFieldProps, InjectedFormProps, GenericFieldHTMLAttributes } from 'redux-form';
import { InputWrapper, SliderWrapper } from './form-elements/AntdFormWrappers';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import IPlatformExperiment from '../../../shared/models/IPlatformExperiment';
import DealFormWrapper from './form-elements/DealForm'
import GameWrapper from './GameWrapper';
import { Redirect } from 'react-router-dom';
import { Row, Col, Modal, Icon, Button, Select, Spin, List, Form, Input, Alert } from 'antd';
const FormItem = Form.Item;

import INation from '../../../shared/models/INation';


interface State5Props {
    CurrentPlayer: ITeam;
    getPlayer: () => {}
    match: any
}

const Beach = require("../img/Bangladesh_beach.jpeg")
export default class State2 extends React.Component<State5Props, { submitting: boolean, submitted: boolean, PlayerNotFound: boolean, FormValues: IPlatformExperiment }> {

    componentWillMount() {
        this.setState({
            submitted: false,
            submitting: false,
            PlayerNotFound: false,
            FormValues: {
                SystemicPoint: null,
                Decision: null,
                Hypothesis: null,
                Experiment: null,
                GameId: null
            }
        })
        if (!this.props.CurrentPlayer) {
            if (localStorage.getItem("SVE_PLAYER")) {
                this.props.getPlayer()
            } else {
                this.setState({ PlayerNotFound: true })
            }
        }
        window.scrollTo(0, 0);
    }

    componentDidUpdate() {

    }

    handleSubmit(values: any) {
        values.preventDefault();
        this.setState(Object.assign({}, this.state, {
            FormValues: Object.assign(this.state.FormValues, { GameId: this.props.CurrentPlayer.GameId })
        }));
        console.log(this.state.FormValues)
        const protocol = window.location.host.includes('sapien') ? "https:" : "http:";
        const port = window.location.host.includes('sapien') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/games/saveexperiment";

        this.setState(Object.assign({}, this.state, {
            submitting: true, submitted: false
        }))

        fetch(
            URL,
            {
                method: "POST",
                body: JSON.stringify(this.state.FormValues),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
        .then( r => r.json() )
        .then(r => {
            console.log("RATINGS RETURNED", r)
            this.setState(Object.assign({}, this.state, {
                submitting: false, submitted: true
            }))
        })
    }


    /**1. 
    2. 
    3. 
    4.  */
    render() {
        if (!this.props.CurrentPlayer) return <div />

        return this.props.CurrentPlayer &&
            this.props.CurrentPlayer.Nation ?
            <GameWrapper
                ParallaxImg={Beach}
                HeaderText="Planet Sapien Experiment Platform"
                match={this.props.match}
                CurrentPlayer={this.props.CurrentPlayer}
            >


                <Row type="flex" justify="center">
                    <Col xs={24} style={{ paddingLeft: '13px' }}>
                        <h1 style={{ marginTop: "50px", textAlign: "center" }}>{(this.props.CurrentPlayer.Nation as INation).Name}</h1>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col xs={22}>
                        <Form onSubmit={this.handleSubmit.bind(this)}>

                            <FormItem
                            >
                                <label>What systemic point of leverage will you address?</label>
                                <Input onChange={e => {
                                    this.setState(Object.assign({}, this.state, {
                                        FormValues: Object.assign(this.state.FormValues, { SystemicPoint: e.target.value })
                                    }))
                                }} />
                            </FormItem>

                            <FormItem
                            >
                                <label>As relates to your point of leverage, what is your decision of consequence?</label>
                                <Input onChange={e => {
                                    this.setState(Object.assign({}, this.state, {
                                        FormValues: Object.assign(this.state.FormValues, { Decision: e.target.value })
                                    }))
                                }} />
                            </FormItem>

                            <FormItem
                            >
                                <label>What hypothesis will you test?</label>
                                <Input onChange={e => {
                                    this.setState(Object.assign({}, this.state, {
                                        FormValues: Object.assign(this.state.FormValues, { Hypothesis: e.target.value })
                                    }))
                                }} />
                            </FormItem>

                            <FormItem

                            >
                                <label>Describe your experiment.</label>
                                <Input.TextArea rows={4} onChange={e => {
                                    this.setState(Object.assign({}, this.state, {
                                        FormValues: Object.assign(this.state.FormValues, { Experiment: e.target.value })
                                    }))
                                }} />

                            </FormItem>
                            <FormItem>
                                
                                <Button
                                    disabled={
                                        !this.state.FormValues 
                                        || !this.state.FormValues.Experiment
                                        || !this.state.FormValues.Hypothesis
                                        || !this.state.FormValues.SystemicPoint
                                        || !this.state.FormValues.Decision
                                        || this.state.submitted
                                    }
                                    className="game-button block"
                                    htmlType="submit"
                                >
                                    Submit Experiment
                                    {this.state.submitting && <Icon type="loading"/>}
                                </Button>
                                {this.state.submitted && 
                                <Alert style={{marginTop:'15px'}} 
                                    message="Your experiment has been submitted." 
                                    type="success">
                                </Alert>}

                            </FormItem>
                        </Form>
                    </Col>
                </Row>




            </GameWrapper>
            :
            null
    }

}
