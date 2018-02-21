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

require('smoothscroll-polyfill').polyfill();

export interface GamesList {
    CurrentPlayer?:ITeam;
    ParallaxImg: any;
    HeaderText: string;
    FormComponent?: any;
    Style?: any
    match?: any
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class GameWrapper extends React.Component<GamesList, any> {

    scrollDown(e:any){        
        document.querySelector('.home-content').scrollIntoView({ behavior: 'smooth' ,block: 'start' });
    }

    goToState(){

    }
    

    //onClick={this.props.testUpdate}
    render() {
        console.log("PLAYER ACCORDING TO GAMEWRAPPER",this.props.CurrentPlayer)
        if(this.props.CurrentPlayer){
            console.log("STATE ACCORDING TO GAMEWRAPPER",this.props.CurrentPlayer.GameState);

            switch (this.props.CurrentPlayer.GameState) {
                case 1:
                    if(this.props.match.path.indexOf('who-gets-the-water') == -1)return <div><Redirect to="/who-gets-the-water"/></div>
                    break;
                case 2:
                    console.log("SHOULD GO TO STATE 2")
                    if(this.props.match.path.indexOf('make-the-trade') == -1)return <div><Redirect to="/make-the-trade"/></div>
                    break;
            
                default:
                    break;
            }

        }

        return  <Layout style={{minHeight:'100vh'}}>
                    <Menu
                        mode="horizontal"
                        theme="dark"
                    >
                        <Menu.Item>
                            <Link to="/admin/games"><Icon type="bars" />Games List</Link>
                        </Menu.Item>
                    </Menu>
                    <Content className="game-wrapper">
                        
                        <Parallax  
                            className="banner-bg"                              
                            bgImage={this.props.ParallaxImg}
                            bgImageAlt="this blows"
                            strength={500}
                            bgStyle={{
                                marginTop: '-250px',
                                maxWidth: '250%',
                                minWidth:'110%',
                                maxHeight: '130vh'
                            }}
                        >  
                            <Row type="flex" justify="center" className="banner">
                                <Col xs={24}>
                                    <h1>{this.props.HeaderText}</h1>
                                </Col>
                                <a className="bottom-arrow" onClick={e => this.scrollDown(e)}><Icon type="down" /></a>
                            </Row>
                            {this.props.children && <Row type="flex" justify="center" className="home-content">
                                <Col xs={20}>
                                    {this.props.children}
                                </Col>  
                            </Row> }
                            {this.props.FormComponent && <Row type="flex" justify="center" className="home-content">
                                <Col xs={20}>
                                    <Route component={this.props.FormComponent}/>
                                </Col>  
                            </Row> }                    
                        </Parallax>
                    </Content>
                </Layout>
    }
}

