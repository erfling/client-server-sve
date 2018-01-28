import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/Form'
import Games from './Games'
import './app.scss';

export interface MasterState {
    Game: IGame[];
    Team: ITeam[];
    Application: {Loading:boolean}
    fetchGames: () => {},
    handleSubmit: () => {}
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class RootComponent extends React.Component<MasterState, any> {
    componentDidMount() {
        this.props.fetchGames();
    }

    //onClick={this.props.testUpdate}
    render() {
        return  this.props.Application.Loading ?  <h1>Loading..</h1> :
        <div className="container">
        </div>
    }
}

