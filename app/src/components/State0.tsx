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
import GameWrapper from './GameWrapper';

require('smoothscroll-polyfill').polyfill();

export interface GamesList {
    Team: ITeam[];
    Application: {Loading:boolean}
    fetchGames: () => {},
}
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class State0 extends React.Component<GamesList, any> {

    scrollDown(e:any){        
        document.querySelector('.home-content').scrollIntoView({ behavior: 'smooth' ,block: 'start' });
    }

    //onClick={this.props.testUpdate}
    render() {
        return  <GameWrapper
                    ParallaxImg={Hurricane}
                    HeaderText="Planet Sapien"
                    FormComponent={LoginContainer}
                >
                    <p style={{paddingTop:'25px'}}>
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
                </GameWrapper>                
    }
}

