import * as React from "react";
import IGame from '../../../shared/models/Game';

export interface GamesList { 
    Games:IGame[];
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class Games extends React.Component<GamesList, {}> {
    render() {
        return this.props.Games.map(g => <h1>Hello from {g.Location}! {g.Teams.length}</h1>);
    }
}