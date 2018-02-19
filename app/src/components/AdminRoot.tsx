import * as React from "react";
import { Icon } from 'antd/lib';
import  Card  from 'antd/lib/card';
import {  Row } from "antd/lib/grid";
import {Layout} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import Menu from "antd/lib/menu"
import { Button } from "antd/";
import { Link } from "react-router-dom";
import { Route, Switch, Router } from 'react-router';
import AdminGamesListContainer from '../containers/AdminGamesListContainer';
import AdminGamesDetailContainer from '../containers/AdminGameDetailContainer';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createBrowserHistory from "history/createBrowserHistory";

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class AdminRoot extends React.Component<{}, {addingGame:boolean}> {
    componentWillMount(){
        console.log("ADMIN COMPONENT WILL MOUNT")
    }
    render() {
          return(            
            <Layout>
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
                        <Switch>
                            <Route path="/admin/games" exact={true} component={AdminGamesListContainer}/>
                            <Route path="/admin/games/:id" component={AdminGamesDetailContainer}/>    
                        </Switch>
                    </Row>
                </Content>
                
            </Layout>
          )
    }
}