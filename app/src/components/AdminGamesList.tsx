import * as React from "react";
import IGame from '../../../shared/models/IGame';
import { Icon } from 'antd/lib';
import  Card  from 'antd/lib/card';
import { Col, Row } from "antd/lib/grid";
import {Layout} from "antd/lib";
import AdminGameForm from "../components/form-elements/AdminGameForm";
const { Header, Footer, Sider, Content } = Layout;

import Collapse  from "antd/lib/collapse"
import Menu from "antd/lib/menu"
import { Button, Tooltip } from "antd/";
import { Link } from "react-router-dom";

const Panel = Collapse.Panel;

export interface GameListProps {
    Games:IGame[];
    Loading:boolean;
    isSelected:boolean;
    getGames: () => {}
    editGame: (game:IGame) => {}
    selectGame: (game:IGame) => {}
    cancelEditGame: (game:IGame) => {}
    saveGame: () => {}
    addGame: () => {}
    setGameCurrent : (game:IGame) => {}
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class AdminGamesList extends React.Component<GameListProps, {addingGame:boolean}> {
    componentDidMount() {
        console.log("DETAIL PROPS", this.props)
        this.props.getGames()
    }
    componentWillMount(){
    }
    render() {
          const getName = (name:string = null) => {
            return name ? name : "Create New Game";
          }

          return(          
                <Col xs={24} sm={24} lg={16}>
                    <h1>Games <Button className="small-button" type="primary" shape="circle" onClick={e => this.props.addGame()}><Icon type="plus" /></Button></h1>
                    {this.props.Loading ?  <Card loading title="Loading Games">testing</Card> :
                    this.props.Games &&
                        this.props.Games.map((g,i) => {
                            if(!g.IsSelected){
                                return <Card key={i} title={g.Name} className="has-button"
                                        extra={ <div>
                                                    {g.IsCurrentGame ? 
                                                        <Tooltip placement="topLeft" title="This is the current game" arrowPointAtCenter>
                                                            <Button type={"primary"} 
                                                                className="small-button"
                                                                shape="circle">
                                                                <Icon type="star" />                                                       
                                                            </Button>                                                  
                                                        </Tooltip>
                                                        
                                                    : 
                                                        <Tooltip placement="topLeft" title="Make this the current game" arrowPointAtCenter>
                                                            <Button 
                                                                type={"dashed"} 
                                                                shape="circle" 
                                                                className="small-button"
                                                                onClick={e => this.props.setGameCurrent(g)}>
                                                                <Icon type="star-o" />                                                       
                                                            </Button>                                                  
                                                        </Tooltip>
                                                    }
                                                    
                                                    <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
                                                        <Button 
                                                            type="dashed" 
                                                            shape="circle" 
                                                            className="small-button"
                                                            onClick={e => this.props.editGame(g)}
                                                        >
                                                            <Icon type="edit" />
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip placement="topLeft" title="View details" arrowPointAtCenter>
                                                        <Button 
                                                            className="small-button"
                                                            type="dashed" 
                                                            shape="circle"
                                                        >
                                                            <Link to={'/admin/games/'+g._id}><Icon type="info" /></Link>
                                                        </Button>                                                    
                                                    </Tooltip>

                                                    
                                                </div>}> 
                                            <p>Location: {g.Location}</p>
                                            <p>Game URL: <a href="#">https://someurl.com{g.Slug}</a></p>
                                    </Card>
                            } else {
                                return  <Card key={i} title={g.Name || "Create New Game"} className="has-button"
                                            extra={<div>
                                                        <Button type="danger" shape="circle" onClick={e => this.props.cancelEditGame(g)}>X</Button>
                                                    </div>}> 
                                                <AdminGameForm 
                                                    form="admin-game"
                                                    onSubmit={this.props.saveGame}
                                                    initialValues={g}
                                                />
                                        </Card>
                            }
                        })      
                    }
                </Col>
          )
    }
}
/** <Collapse accordion defaultActiveKey={['0']}>
                                    {this.props.Games.map((g,i) => {
                                        return <Panel header={"Location: " + g.Location || g._id} key={i.toString()}>
                                                    <pre>{JSON.stringify(g, null, 2)}</pre>
                                                </Panel>
                                    })}
                                </Collapse> */

