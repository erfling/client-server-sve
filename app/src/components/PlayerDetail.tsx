import * as React from "react";
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/form'
import './app.scss';

export interface TeamDetailProps {
    Players: IPlayer[];
    //fetchTeam:(slug:string)=>{};
    selectPlayer:(e: React.MouseEvent<HTMLAnchorElement>, player:IPlayer)=>{}
    sumbmitForm:()=>{}
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class TeamDetail extends React.Component<TeamDetailProps, {}> {
    componentDidMount() {
//        this.props.fetchTeam(this.props.match.params.slug);
    }
    componentWillMount(){
    }
    render() {
        if( this.props.Players ){
            return this.props.Players.map((p) => {
                console.log(p);
                if(p.IsSelected){ 
                    return <div key={p._id}>
                                {p.Name}
                                <BaseForm form={p._id} initialValues={{PlayerId: p._id}} onSubmit={this.props.sumbmitForm}/>
                            </div> 
                }
                return <div key={p._id}>
                            <a onClick = { e => this.props.selectPlayer(e, p) }>{p.Name || p.Role || p._id}</a>
                        </div>

            })
        } else {
            return <h1>ain't got none</h1>
        } 
    }
}
