import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/form'
import TeamList from './TeamList'
import { Row, Col, Icon } from 'antd';
import {Layout} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import Menu from "antd/lib/menu";
import { Link } from "react-router-dom";


export interface GamesList {
    Game: IGame[];
    Team: ITeam[];
    Application: {Loading:boolean}
    fetchGames: () => {},
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class Games extends React.Component<GamesList, any> {
    componentDidMount() {
        console.log("MONOUT")
        this.props.fetchGames();
    }

    componentWillMount(){
        console.log("GAME PROPS", this.props)
    }

    //onClick={this.props.testUpdate}
    render() {
        return  this.props.Application.Loading ?  <h1>Loading..<Icon type="loading" /></h1> :
        this.props.Game && <Layout>
                                <Menu
                                    mode="horizontal"
                                    theme="dark"
                                >
                                    <Menu.Item>
                                        <Link to="/admin/games"><Icon type="bars" />Games List</Link>
                                    </Menu.Item>
                                </Menu>
                                <Content>
                                    <Row type="flex" justify="center">
                                        <Col xs={24} sm={24} lg={20}>
                                            <h2>Games</h2>
                                            {this.props.Game.map((g, i) =>
                                                <div key={i}>
                                                    <h1>Hello from {g.Location || g.Slug} at {g.idx}!</h1>
                                                    <TeamList Game={g} Location={window.location}/>
                                                </div>
                                            )} 
                                        </Col>                                       
                                    </Row>
                                </Content>
                            </Layout>
    }
}

