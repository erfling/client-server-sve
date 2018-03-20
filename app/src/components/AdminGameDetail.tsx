import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import INation from '../../../shared/models/INation';
import AdminGameForm from "../components/form-elements/AdminGameForm";
import Collapse  from "antd/lib/collapse"
import { Button, Input, Menu, Layout, Col, Row, Card, Icon, Modal } from "antd/";
const Panel = Collapse.Panel;
const { Header, Footer, Sider, Content } = Layout;
import { Link } from "react-router-dom";

class SapienButton extends Button{

}

interface AdminGameDetailProps{
    Game:IGame;
    Loading:boolean;
    selectGame:(slug: string)=>{}
    addGame: () => {}
    resetGame: (game: IGame) => {}
    setGameState : (game:IGame, newState: number | string) => {}
    match:any;
    //sendMessageFromAdmin : (gameId:string, message:string) => {}
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class AdminGameDetail extends React.Component<AdminGameDetailProps, {addingGame:boolean, adminMessage:string, sendMessage:boolean, sending: boolean}> {

    componentDidMount() {
        console.log("ADMIN GAME DETAIL PROPS", this.props);
    }
    componentWillMount(){
        this.setState({ addingGame: false, adminMessage: null })
        this.props.selectGame(this.props.match.params.id);
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

    requestConfirmReset(){
        console.log(this.props.Game);
        if (window.confirm("Do you really reset this game? This action cannot be undone")) { 
           this.props.resetGame(this.props.Game)
        }
    }

    sendMessageFromAdmin(gameId:string, message:string) {

        this.setState(Object.assign(this.state, {sending: true}))

        const protocol = !window.location.host.includes('local') ? "https:" : "http:";
        const port = !window.location.host.includes('local') ? ":8443" : ":4000";
        const URL = protocol +  "//" + window.location.hostname + port + "/sapien/api/adminmessage";
        
        return fetch(
                URL, 
                {
                    method: "POST",
                    body: JSON.stringify({GameId:gameId, Message:message}),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }
            )
            .then(( res:Response ) => {
                this.setState(
                    Object.assign(
                        this.state, 
                        {
                            sending: false, 
                            sendMessage: false, 
                            adminMessage: null
                        }
                    )
                )

                this.clearAdminMessage()

                return res.json()
            })
            .catch( ( reason ) => { 
                console.log(reason);
            })
    }

    clearAdminMessage() {
        var input:HTMLInputElement = document.querySelector(".message-input")
        if(input)input.value = null;
    }

    // "3A", "3B", "3C","INTERMISSION"
    states = ["1A", "1B", "1C", "2", "4A", "4B", "5"];

    render() {
          
          return <Col xs={24} sm={24} lg={16}>
                        {this.props.Loading && <Card loading title="Loading Game">Loading</Card>}
                        {this.props.Game && <Card title={this.props.Game.Name}
                            extra={
                                <div>
                                    <em style={{marginRight:'10px'}}>Set Game State:</em>
                                    {this.states.map(state => <Button
                                                                className="small-button"
                                                                type={this.stateIsSelected(state) ? 'primary' : 'dashed'}
                                                                onClick={e => this.props.setGameState(this.props.Game, state)}
                                                                shape={state.length < 3 ? 'circle' : null}>{state}
                                                             </Button>
                                                )}
                                    <Button 
                                        className="small-button"
                                        type="danger" 
                                        shape="circle"
                                        onClick={e => this.requestConfirmReset()}>
                                        <Icon type="poweroff" />
                                    </Button>

                                    <Button 
                                        className="small-button"
                                        type="primary"
                                        shape="circle"
 
                                        onClick={e => this.setState(Object.assign(this.state, {sendMessage: true}))}>
                                        <Icon type="message" />
                                    </Button>

                                    <br/>
                                    
                                </div>
                            }
                        >
                            <Collapse accordion defaultActiveKey={['0']}>
                                { this.props.Game && this.getTeams(this.props.Game).map(( t, i ) => {
                                    return <Panel header={t.Name || (t.Nation as INation).Name} key={i.toString()}>
                                                {JSON.stringify(t, null, 2)}
                                           </Panel>
                                })} 
                            </Collapse>
                        </Card>}
                        <Modal
                            title={<span>Message from the game.</span>}
                            visible={this.state.sendMessage}
                            width="80%"
                            footer={[<Button 
                                        type="primary"
                                        onClick={e => this.sendMessageFromAdmin(this.props.Game._id, this.state.adminMessage)}>
                                        Send {this.state.sending ? <Icon type="loading" /> : <Icon type="message"/>}
                                    </Button>,
                                    <Button 
                                        type="danger"
                                        onClick={e => {
                                            this.setState(Object.assign(this.state, {sendMessage: false, adminMessage: false}));
                                            this.clearAdminMessage()
                                        }}>
                                        Cancel <Icon type="close" />
                                    </Button>
                                    ]}
                        >
                            <Input.TextArea
                                className="message-input"
                                placeholder="Message to all players..."
                                onChange={e => this.setState(Object.assign(this.state, {adminMessage: e.target.value}))}
                            />  
                        </Modal>     
                    </Col>          
    }
}