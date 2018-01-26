import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { Icon } from 'antd/lib';
import  Card  from 'antd/lib/card';
import { Col, Row } from "antd/lib/grid";
import {Layout} from "antd/lib";
import AdminGameForm from "../components/form-elements/AdminGameForm";
const { Header, Footer, Sider, Content } = Layout;
import Collapse  from "antd/lib/collapse"
import Menu from "antd/lib/menu"
import { Button } from "antd/";
import { Link } from "react-router-dom";

const Panel = Collapse.Panel;

class SapienButton extends Button{

}

interface AdminGameDetailProps{
    Game:IGame;
    Loading:boolean;
    selectGame:(slug: string)=>{}
    addGame: () => {}
    match:any;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class AdminGameDetail extends React.Component<AdminGameDetailProps, {addingGame:boolean}> {
    componentDidMount() {
        console.log("ADMIN GAME DETAIL PROPS", this.props)
        this.props.selectGame(this.props.match.params.id);
    }
    componentWillMount(){

    }
    render() {
          const getName = (name:string = null) => {
            return name ? name : "Create New Game";
          }         
          const getTeams = (game: IGame = null) => {
            if(game && game.Teams)return game.Teams as ITeam[];
          }       
          return (
                    <Col xs={24} sm={24} lg={16}>
                        {this.props.Loading && <Card loading title="Loading Game">testing</Card>}
                        {this.props.Game && <Card title={this.props.Game.Name}>
                            <Collapse accordion defaultActiveKey={['0']}>
                                { this.props.Game && getTeams(this.props.Game).map(( t, i ) => {
                                    return <Panel header={t.Name} key={i.toString()}>
                                                {JSON.stringify(t, null, 2)}
                                           </Panel>
                                })} 
                            </Collapse>

                        </Card>}                            
                    </Col>
          )
          
    }
}
/*
this.props.Game &&
                                //var teams:ITeam[] = this.props.Game.Teams;
                                this.props.Game.Teams.map((g,i) => {
                                    if(!g.IsSelected){
                                        return <Card key={i} title={g.Name} className="has-button"
                                                extra={ <div>
                                                            <Button type="dashed" shape="circle" onClick={e => this.props.editGame(g)}><Icon type="edit" /></Button>
                                                            <Button type="dashed" shape="circle" onClick={e => this.props.selectGame(g)}>
                                                                <Link to={'admin-games/'+g.Slug}><Icon type="info" /></Link>
                                                            </Button>
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
                                    }*/