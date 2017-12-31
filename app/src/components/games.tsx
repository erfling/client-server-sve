import * as React from "react";
import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';
import { Game } from "../../../api/src/models/Game";

export interface GamesList { 
    Game:IGame[];
    Team:ITeam[];
    testUpdate:()=>{}

}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class Games extends React.Component<GamesList, any> {
    render() {
        console.log("GAME PROPS",this.props)
        return this.props.Game && this.props.Game.map( (g,i) => 
            <div key={i}>
                <h1 onClick={this.props.testUpdate}>Hello from {g._id}!</h1>
            </div>
        );
    }
}