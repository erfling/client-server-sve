import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/form'
import './app.scss';

export interface TeamDetailProps {
    Team: ITeam;
    fetchTeam:(slug:string)=>{};
    match:any;
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class TeamDetail extends React.Component<TeamDetailProps, {}> {
    componentDidMount() {
        console.log("DETAIL PROPS", this.props.match)
        this.props.fetchTeam(this.props.match.params.slug);
    }
    componentWillMount(){

    }
    render() {
        return  this.props.Team ? 
                    <div key={this.props.Team._id}>
                        <h3>{this.props.Team.Name || this.props.Team.Slug || this.props.Team._id}</h3>
                        <BaseForm form={this.props.Team.Slug}/>
                    </div> 
                : 
                    <p>no team, yo</p>  
    }
}

