import * as React from "react";
import * as DOM from 'react-dom'

import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/Form'
import './app.scss';
import TeamList from './TeamList'
import { Row, Col, Icon, Slider } from 'antd';
import {Layout} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import Menu from "antd/lib/menu";
import { Link } from "react-router-dom";
import PlayerDetail from './PlayerDetail';
import PlayerContainer from '../containers/PlayerContainer';
import { SliderWrapper} from './form-elements/AntdFormWrappers'

import {Parallax, Background} from 'react-parallax'; 

import Leaf from '-!svg-react-loader?name=Icon!../img/si-glyph-leaf.svg';
import { Sunburst } from 'react-vis';

//mport Hurricane from  '../img/hurricane-space-earth-horizontal.jpg';
const Hurricane = require('../img/hurricane-space-earth-horizontal.jpg');
export interface TeamDetailProps {
    Team: ITeam;
    Dashboard:any;
    DashboardUpdating:boolean;
    fetchTeam:(slug:string)=>{};
    selectPlayer:(e: React.MouseEvent<HTMLAnchorElement>, player: IPlayer)=>{}
    submitForm: () => {}
    subscribeToDashboard:() => {}
    match:any;
    submitting:boolean;
    EnvironmentalHealth:number;
    setEnvirontmentalHealth: (value:number) => {}
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class TeamDetail extends React.Component<TeamDetailProps, {}> {

    componentDidMount() {
        this.props.fetchTeam(this.props.match.params.id);
        this.props.subscribeToDashboard();
    }

    componentDidUpdate(){
        console.log(this.props.Dashboard);
        const  percentColors = [
            { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
            { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
            { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

        const setLeafColor = (value: number) => {
                let pct = value/100
                for (var i = 1; i < percentColors.length - 1; i++) {
                    if (pct < percentColors[i].pct) {
                        break;
                    }
                }
                var lower = percentColors[i - 1];
                var upper = percentColors[i];
                var range = upper.pct - lower.pct;
                var rangePct = (pct - lower.pct) / range;
                var pctLower = 1 - rangePct;
                var pctUpper = rangePct;
                var color = {
                    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                };
                return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
          }

          if(this.refs.leaf){
              let fillTarget = DOM.findDOMNode(this.refs.leaf).querySelector("svg").querySelectorAll('g')[1];
              if(fillTarget){
                  fillTarget.setAttribute("fill", setLeafColor(this.props.EnvironmentalHealth))
              }
          }

    }
    render() {
        const pivotArray = (arr:any[]):any[] => {
            let output:any[] = [];
            return output;
        }
        const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00'];

        /**{"title": "BetweennessCentrality", "color": "#12939A", "size": 3534}, */
        const mapDataForSunburst = (data:string[][]) => {
            if(!data)return;
            let input = data.slice(1,5).concat(data.slice(8,10));
            let burstData = input.map((row,i) => {
                return {
                    title: "test",
                    size: row[1],
                    color:DIVERGING_COLOR_SCALE[i]
                }
            })
            console.log('INPUT',input);

            let final =  {
                title: "Sunburst Test",
                color:"blue",
                children: burstData
            }
            console.log(final)
            return final;
          }

          const randomLeaf = ():any => {
              console.log(Math.round(Math.random()) + 2, this.props.Dashboard[9])
            return {
              //title: this.props.Dashboard[Math.round(Math.random()) + 8][0].substring(0,6) + "...",
              size:  this.props.Dashboard[9][Math.round(Math.random()) + 2] * 1000,
             //size:1000,
              color: Math.random()
            };
          }
           function updateData() {
            const totalLeaves = Math.random() * 20;
            const leaves = [];
            for (let i = 0; i < totalLeaves; i++) {
              const leaf = randomLeaf();
              if (Math.random() > 0.8) {
                leaf.children = [...new Array(3)].map(() => randomLeaf());
              }
              leaves.push(leaf);
            }
            
            
            return {
              title: '',
              color: 1,
              children: leaves
            };
          }

          if(this.props.Team){ 
                let players:IPlayer[] = this.props.Team.Players as IPlayer[];
                var data = this.props.Dashboard;
                return <Layout>
                        <Menu
                            mode="horizontal"
                            theme="dark"
                        >
                            <Menu.Item>
                                <Link to="/admin/games"><Icon type="bars" />Games List</Link>
                            </Menu.Item>
                        </Menu>
                        <Content>
                            <Parallax                                
                                bgImage={Hurricane}
                                bgImageAlt="this blows"
                                strength={1000}
                            >                                
                                <Row type="flex" justify="center" style={{ height:'1500px'}}>
                                    <Col xs={24} sm={23} lg={20} style={{backround:'rgba(255,255,255,.6)'}}>
                                        <h3>{this.props.Team.Name || this.props.Team.Slug || this.props.Team._id}</h3>
                                        <h4>Players: ({players.length})</h4>
                                        <div ref="leaf">
                                            <Slider 
                                                min={0}
                                                max={100}
                                                onChange={(e:number) => this.props.setEnvirontmentalHealth(e)}
                                            />
                                            <Leaf className="leaf-thing" height={30}/>
                                            <span className="leaf-value">{this.props.EnvironmentalHealth}</span>
                                            {data && <Sunburst
                                                        animation={{damping: 20, stiffness: 300}}
                                                        data={ updateData() }
                                                        colorType={'category'}
                                                        colorRange={DIVERGING_COLOR_SCALE}
                                                        style={{stroke: '#ccc'}}                                                
                                                        height={300}
                                                        width={350}
                                                        hideRootNode
                                                        title="hey"
                                                        getLabel={(d:any) => d.title}

                                                    />
                                            }
                                        </div>
                                        <PlayerContainer 
                                            Players={players} 
                                            selectPlayer={this.props.selectPlayer} 
                                            sumbmitForm={this.props.submitForm}
                                            submitting={this.props.submitting}
                                        />
                                        <h1>{data && data[6][1]} {this.props.DashboardUpdating ? "Dashboard updating..." : "" }</h1>
                                        <div>
                                            <table style={{width:'60%'}}>
                                                <tbody>
                                                    {data && data.slice(0,5).concat(data.slice(8,10)).map((d:any[], i:number)=>{
                                                        return <tr key={i}>{d.map((datum, j:number )=> <td key={i+j}>{datum}</td>)}</tr>
                                                })}
                                                </tbody>                                    
                                            </table>
                                        </div>
                                    </Col>
                                </Row>
                            </Parallax>

                        </Content> 
                    </Layout>    
            }else{
                return <p>no team, yo</p>  
            }
    }
}
//<BaseForm form={this.props.Team.Slug}/>                                       <tr><td></td><td></td><td></td><td></td><td></td></tr>
                             //<PlayerDetail Players={players} selectPlayer={this.props.selectPlayer}/>



/*<Paralax
                                blur={10}
                                bgImage={require('../img/hurricane-space-earth-horizontal.jpg')}
                                bgImageAlt="This blows"
                                strength={200}
                            />*/