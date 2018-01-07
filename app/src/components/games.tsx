import * as React from "react";
import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';
import { Game } from "../../../api/src/models/Game";

import './app.scss';

export interface GamesList { 
    Game:IGame[];
    Team:ITeam[];
    fetchGames:()=>{}
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class Games extends React.Component<GamesList, any> {
    componentDidMount(){
        this.props.fetchGames();
        
    }
    //onClick={this.props.testUpdate}
    render() {
        console.log("GAME PROPS",this.props)
        return this.props.Game && this.props.Game.map( (g,i) => 
            <div key={i}>
                <h1>Hello from {g.Location || g.Slug} at {g.idx}!</h1>
            </div>
        );
    }
}