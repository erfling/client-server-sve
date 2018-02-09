import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/Form'
import '../style/app.scss';
import { Link } from 'react-router-dom';
import TeamDetail from './TeamDetail'

export interface TeamsList {
    Game: IGame;
    Location:any;
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class TeamList extends React.Component<TeamsList, any> {
    componentDidMount() {
        //this.props.fetchGames();
    }

    //onClick={this.props.testUpdate}
    render() {
        //return <div>BUTT {this.props.Game.Teams.length}</div>
        
        var teams:ITeam[] = this.props.Game.Teams as ITeam[];
        return teams && teams.map((t, i) =>
            <div key={t.Slug}>
                <Link to={"/team-detail/" + t.Slug}>{t.Name || t.Slug}</Link>
            </div>
        );      
       
    }
}

