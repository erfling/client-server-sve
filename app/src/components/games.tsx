import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/form'
import TeamList from './TeamList'
import './app.scss';

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
        return  this.props.Application.Loading ?  <h1>Loading..</h1> :
        this.props.Game && <div className="container">
                                {this.props.Game.map((g, i) =>
                                    <div key={i}>
                                        <h1>Hello from {g.Location || g.Slug} at {g.idx}!</h1>
                                        <TeamList Game={g} Location={window.location}/>
                                    </div>
                                )}
                            </div>
    }
}

