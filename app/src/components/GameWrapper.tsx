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

require('smoothscroll-polyfill').polyfill();

export interface GamesList {
    Team: ITeam[];
    Application: {Loading:boolean}
    fetchGames: () => {},
}
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class GameWrapper extends React.Component<GamesList, any> {
    componentDidMount() {
        console.log("MONOUT")
        //this.props.fetchGames();
    }

    componentWillMount(){
        console.log("GAME PROPS", this.props)
    }

    componentWillUnmount(){
        
    }

    scrollDown(e:any){        
        document.querySelector('.home-content').scrollIntoView({ behavior: 'smooth' ,block: 'start' });
    }

    //onClick={this.props.testUpdate}
    render() {
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
                            bgImage={Hurricane}
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
                                    <h1>Planet Sapien</h1>
                                </Col>
                                <a className="bottom-arrow" onClick={e => this.scrollDown(e)}><Icon type="down" /></a>
                            </Row>
                            <Row type="flex" justify="center" className="home-content">
                                <Col xs={20}>
                                    <Row>
                                        <p>
                                            <em>
                                                In a galaxy far, far away, a system of ten planets orbit a central star. 
                                                Nine of those planets spin lifelessly, too cold or too hot to support any living thing.
                                            </em>
                                        </p>
                                        <p>
                                            <em>
                                                But the fifth planet teems with flora and fauna, abundant and verdant. 
                                                For hundreds of thousands of years, creatures on this planet have thrived due to its perfect distance from its life-giving Star.
                                             </em>
                                        </p>
                                        <p>
                                            <em>
                                                Yet now this fortunate planet faces a threat created by its own inhabitants, and they need your help. 
                                                Act boldly and decisively, and you may be able to save this delicate haven. 
                                                If you fail, the only home hospitatable to life in this distant galaxy may join its sister planets, destined to spin in an infinite, silent and dark rotation. 
                                            </em>
                                        </p>
                                    </Row>
                                </Col>  
                                <Route component={LoginContainer}/>
                            </Row>                      
                        </Parallax>
                    </Content>
                </Layout>
    }
}

