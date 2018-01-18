import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/form'
import './app.scss';

import PlayerDetail from './PlayerDetail';
import PlayerContainer from '../containers/PlayerContainer';
export interface TeamDetailProps {
    Team: ITeam;
    Dashboard:any;
    DashboardUpdating:boolean;
    fetchTeam:(slug:string)=>{};
    selectPlayer:(e: React.MouseEvent<HTMLAnchorElement>, player: IPlayer)=>{}
    submitForm: () => {}
    subscribeToDashboard:() => {}
    match:any;
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class TeamDetail extends React.Component<TeamDetailProps, {}> {
    componentDidMount() {
        console.log("DETAIL PROPS", this.props.match)
        this.props.fetchTeam(this.props.match.params.slug);
        this.props.subscribeToDashboard();
    }
    componentWillMount(){

    }
    render() {
          if(this.props.Team){ 
                let players:IPlayer[] = this.props.Team.Players as IPlayer[];
                var data = this.props.Dashboard;
                return <div key={this.props.Team._id}>
                            <h3>{this.props.Team.Name || this.props.Team.Slug || this.props.Team._id}</h3>
                                <h4>Players: ({players.length})</h4>
                                <PlayerContainer 
                                    Players={players} 
                                    selectPlayer={this.props.selectPlayer} 
                                    sumbmitForm={this.props.submitForm}
                                />
                                <h1>{data && data[6][1]} {this.props.DashboardUpdating ? "Dashboard updating..." : "" }</h1>
                                <table style={{width:'60%'}}>
                                    <tbody>
                                        {data && data.slice(0,5).concat(data.slice(8,10)).map((d:any[], i:number)=>{
                                            return <tr key={i}>{d.map((datum, j:number )=> <td key={i+j}>{datum}</td>)}</tr>
                                    })}
                                    </tbody>                                    
                                </table>
                        </div> 
            }else{
                return <p>no team, yo</p>  
            }
    }
}
//<BaseForm form={this.props.Team.Slug}/>                                       <tr><td></td><td></td><td></td><td></td><td></td></tr>
                             //<PlayerDetail Players={players} selectPlayer={this.props.selectPlayer}/>



