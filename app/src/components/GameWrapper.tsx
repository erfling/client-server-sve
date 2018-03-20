import * as React from "react";
import ITeam from '../../../shared/models/ITeam';
import { Game } from "../../../api/src/models/Game";
import { Row, Col } from 'antd/lib/grid';
import { Icon } from 'antd/lib';
import {Layout} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import Menu from "antd/lib/menu";
import { Link, Route } from "react-router-dom";
import {Parallax, Background} from 'react-parallax'; 
import LoginContainer from '../containers/LoginContainer';
import {StyleHTMLAttributes} from 'react';
import {Redirect} from 'react-router-dom';
import BottomBar from './BottomBar';
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import { ACTION_TYPES } from '../actions/Actions';
import ValidSubmissionsContainer from './ValidSubmissions';

export interface GamesList {
    CurrentPlayer?:ITeam;
    ParallaxImg: any;
    HeaderText: string;
    FormComponent?: any;
    ImageStyles?: any;
    Style?: any;
    match?: any;
    HideImage?: boolean;
    BottomBarVisible:boolean;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class GameWrapper extends React.Component<GamesList, any> {

    scrollDown(e:any){        
        document.querySelector('.home-content').scrollIntoView({ behavior: 'smooth' ,block: 'start' });
    }

    componentDidUpdate(oldState:any, newState:any){
        console.log("GAME WRAPPER DID UPDATE", oldState, newState);
        if(this.props.BottomBarVisible && !oldState.BottomBarVisible){
            var x = 1; //y-axis pixel displacement
            var y = 25; //delay in milliseconds

            var scrollInterval = setInterval(function() {
                window.scrollBy(0, x);
                x += 1; //if you want to increase speed simply increase increment interval
                if(x >= 100){
                    clearInterval(scrollInterval);
                }
            }, y);
        }

    }

    //onClick={this.props.testUpdate}
    render() {
        if(this.props.CurrentPlayer){

            switch (this.props.CurrentPlayer.GameState) {
                case "1A":
                    if(this.props.match.path.indexOf('who-gets-the-water') == -1)return <div><Redirect to="/who-gets-the-water"/></div>
                    break;
                case "1B":
                    if(this.props.match.path.indexOf('who-gets-the-water') == -1)return <div><Redirect to="/who-gets-the-water"/></div>
                    break;
                case "1C":
                    if(this.props.match.path.indexOf('who-gets-the-water') == -1)return <div><Redirect to="/who-gets-the-water"/></div>
                    break;
                case "2":
                    if(this.props.match.path.indexOf('make-the-trade') == -1)return <div><Redirect to="/make-the-trade"/></div>
                    break;
                case "3A":
                    if(this.props.match.path.indexOf('war-of-the-worlds') == -1)return <div><Redirect to="/war-of-the-worlds"/></div>
                    break;
                case "3B":
                    if(this.props.match.path.indexOf('war-of-the-worlds') == -1)return <div><Redirect to="/war-of-the-worlds"/></div>
                    break;                
                case "3C":
                    if(this.props.match.path.indexOf('war-of-the-worlds') == -1)return <div><Redirect to="/war-of-the-worlds"/></div>
                    break;
                case "4A":
                    if(this.props.match.path.indexOf('international-trade') == -1)return <div><Redirect to="/international-trade"/></div>
                    break;
                case "4B":
                    if(this.props.match.path.indexOf('international-trade') == -1)return <div><Redirect to="/international-trade"/></div>
                    break;
                case "4C":
                    if(this.props.match.path.indexOf('international-trade') == -1)return <div><Redirect to="/international-trade"/></div>
                    break;
                case "5":
                    if(this.props.match.path.indexOf('experiment') == -1)return <div><Redirect to="/experiment"/></div>
                    break;
            
                default:
                    break;
            } 

        }

        return  <Layout style={{minHeight:'100vh'}} className={this.props.BottomBarVisible ? "big-bottom" : null}>
                    <Content className="game-wrapper">
                        {this.props.ParallaxImg && 
                        <Parallax  
                            className="banner-bg"                              
                            bgImage={this.props.ParallaxImg}
                            bgImageAlt="this blows"
                            strength={500}
                            bgStyle={ this.props.ImageStyles ? this.props.ImageStyles : {
                                marginTop: '-250px',
                                maxWidth: '250%',
                                minWidth:'110%',
                                maxHeight: '130vh',
                                height: this.props.HideImage ? "0" : "auto"
                            }}
                        >  
                            <Row type="flex" justify="center" className="banner">
                                <Col xs={24}>
                                    <h1>{this.props.HeaderText}</h1>
                                </Col>
                                <a className="bottom-arrow" onClick={e => this.scrollDown(e)}><Icon type="down" /></a>
                            </Row>
                            {this.props.children && <Row type="flex" justify="center" className="home-content">
                                <Col xs={24}>
                                    {this.props.children}
                                </Col>  
                            </Row> }
                            {this.props.FormComponent && <Row type="flex" justify="center" className="home-content">
                                <Col xs={24}>
                                    <Route component={this.props.FormComponent}/>
                                </Col>  
                            </Row> }                    
                        </Parallax>}
                    </Content>
                    <BottomBar
                        Visible={this.props.BottomBarVisible}
                    >
                        <ValidSubmissionsContainer/>
                    </BottomBar>
                </Layout>
    }
}


interface DispatchProps {
    dismissAdminMessage: () => {}
}
export interface GameProps{
    BottomBarVisible:boolean;
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): GameProps => {
    return {
        BottomBarVisible: state.GameData.BottomBarVisible
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        hideBottomBar: () => {
            dispatch( Actions.dismissAdminMessage() )
        }
    }
}

const GameWrapperContainer = connect<GameProps, {}>(mapStateToProps, mapDispatchToProps)(GameWrapper);
export default GameWrapperContainer;