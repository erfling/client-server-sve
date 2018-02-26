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
    setGameState : (game:IGame, newState: number | string) => {}
    match:any;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class AdminGameDetail extends React.Component<AdminGameDetailProps, {addingGame:boolean}> {

    componentDidMount() {
        console.log("ADMIN GAME DETAIL PROPS", this.props)
    }
    componentWillMount(){
        this.props.selectGame(this.props.match.params.id);

    }

    componentDidUpdate(newState:any, oldState:any){
        console.log("UPDATE",newState, oldState)
    }

    getName = (name:string = null) => {
        return name ? name : "Create New Game";
    }         
    getTeams = (game: IGame = null) => {
        if(game && game.Teams)return game.Teams as ITeam[];
    }   
      
    stateIsSelected = (buttonIdx: number | string) => {
        return this.props.Game.State ? buttonIdx == this.props.Game.State : buttonIdx == 1;
    }

    states = ["1A", "1B", "1C", "2", "3A", "3B", "4", "5"];

    render() {
          
          return <Col xs={24} sm={24} lg={16}>
                    {console.log("RENDERING")}
                        {this.props.Loading && <Card loading title="Loading Game">Loading</Card>}
                        {this.props.Game && <Card title={this.props.Game.Name + " " + this.props.Game.State}
                            extra={
                                <div>
                                    <em style={{marginRight:'10px'}}>Set Game State:</em>
                                    {this.states.map(state => <Button
                                                                type={this.stateIsSelected(state) ? 'primary' : 'dashed'}
                                                                onClick={e => this.props.setGameState(this.props.Game, state)}
                                                                shape="circle">{state}
                                                             </Button>
                                                )}
                                </div>
                            }
                        >
                            <Collapse accordion defaultActiveKey={['0']}>
                                { this.props.Game && this.getTeams(this.props.Game).map(( t, i ) => {
                                    return <Panel header={t.Name} key={i.toString()}>
                                                {JSON.stringify(t, null, 2)}
                                           </Panel>
                                })} 
                            </Collapse>
                        </Card>}     
                    </Col>          
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