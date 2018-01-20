import * as React from "react";
import IGame from '../../../shared/models/IGame';
import { Icon } from 'antd/lib';
import { Col, Row } from "antd/lib/grid";
import {Layout} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;

import Collapse  from "antd/lib/collapse"
import Menu from "antd/lib/menu"

const Panel = Collapse.Panel;

export interface GameListProps {
    Games:IGame[];
    Loading:boolean;

    getGames: () => {}
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class AdminGamesList extends React.Component<GameListProps, {}> {
    componentDidMount() {
        console.log("DETAIL PROPS", this.props)
        this.props.getGames()
    }
    componentWillMount(){

    }
    render() {
          return(
            <Layout>
                <Header>
                    <Menu
                        mode="horizontal"
                        theme="dark"
                    >
                        <Menu.Item key="mail">
                            <Icon type="mail" />Navigation One
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Col>
                        {this.props.Loading ?  <h1>Loading..<Icon type="loading" /></h1> :
                        this.props.Games && 
                            <Collapse accordion defaultActiveKey={['0']}>
                                {this.props.Games.map((g,i) => {
                                    return <Panel header={"Location: " + g.Location || g._id} key={i.toString()}>
                                                <pre>{JSON.stringify(g, null, 2)}</pre>
                                            </Panel>
                                })}
                            </Collapse>
                        }
                    </Col>
                </Content>
                
            </Layout>
          )
    }
}


