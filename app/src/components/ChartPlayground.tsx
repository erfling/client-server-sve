import * as React from "react";
import * as DOM from 'react-dom'

import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Game } from "../../../api/src/models/Game";
import BaseForm from './form-elements/Form'
import '../style/app.scss';
import TeamList from './TeamList'


import {Layout} from "antd/lib";
const { Header, Footer, Sider, Content } = Layout;
import Menu from "antd/lib/menu";
import { Link } from "react-router-dom";
import PlayerDetail from './PlayerDetail';
import PlayerContainer from '../containers/PlayerContainer';
import {Parallax, Background} from 'react-parallax'; 
import {curveCatmullRom} from 'd3-shape';
import { Sunburst,
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    DiscreteColorLegend,
    DiscreteColorLegendItem } from 'react-vis';
import Leaf from '-!svg-react-loader?name=Icon!../img/si-glyph-leaf.svg';
import { SliderWrapper } from './form-elements/AntdFormWrappers'
import { Row, Col, Icon, Slider, Form, Input } from 'antd';
const FormItem = Form.Item;
interface ChartPlaygroundProps {
    Dashboard: any[];
    EnvironmentalHealth:number;
}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class ChartPlayground extends React.Component<ChartPlaygroundProps, {LandImpact: number, WaterImpact: number, AtmosphereImpact: number   }> {

    componentWillMount() {
        this.setState(Object.assign({}, {LandImpact: 1, WaterImpact: 1, AtmosphereImpact: 1}))
    }

    componentDidUpdate(){
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

        const setLandImpact = (val: number): void =>{
            this.setState(Object.assign(this.state, {LandImpact: val || 1}))
        }

        const setWaterImpact = (val: number): void =>{
            this.setState(Object.assign(this.state, {WaterImpact: val || 1}))
            console.log(val, this.state);
        }

        const setAtmosphereImpact = (val: number): void =>{
            this.setState(Object.assign(this.state, {AtmosphereImpact: val || 1}))
        }

        const getParsedData = (data: any, state: number) => {
            console.log(data);
            return data
                    .slice(0, data.length - 2)
                    .filter((d: number) => !isNaN(d))
                    .map((d:string, i: number) => {
                        return {
                            x: i,
                            y: parseInt(d) * state/100
                        }
                    })
        }

        const pivotArray = (arr:any[]):any[] => {
            let output:any[] = [];
            return output;
        }
        const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00', '#00939C', '#85C4C8', '#EC9370', '#C22E00', '#00939C', '#85C4C8', '#EC9370', '#C22E00'];

        const mapDataForSunburst = (data:Array<Array<string>>) => {
            var colorIterator = 0;
            let burstData = data.map((row,i) => {
                return {
                    title: row[0],
                    size: parseInt(row[5]) * 1000,
                    color:DIVERGING_COLOR_SCALE[i],
                    children: [{
                        size: parseInt(row[1]) * 1000,
                        color: DIVERGING_COLOR_SCALE[i + 1],
                        children: [{
                            size: parseInt(row[2]) * 1000,
                            color: DIVERGING_COLOR_SCALE[i + 2],
                        }]
                    }]
                }
            })

            let final =  {
                title: "Sunburst Test",
                color:1,
                children: burstData
            }

            return final;
        }
          

        const randomLeaf = ():any => {
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

        if(this.props.Dashboard){   
            var data = this.props.Dashboard; 
            return data && <div>
                                <Sunburst
                                    animation={{damping: 20, stiffness: 300}}
                                    data={ mapDataForSunburst(data) }
                                    colorType={'category'}
                                    colorRange={DIVERGING_COLOR_SCALE}
                                    style={{stroke: '#ccc'}}                                                
                                    height={400}
                                    width={400}
                                    margin={{left:50, top: 50, right: 50, bottom: 50}}
                                    hideRootNode
                                    title="Environtmental Health"
                                    getLabel={(d:any) => d.title}
                                />
                                
                                <XYPlot
                                    height={300}
                                    width={500}
                                    className="line-chart"
                                >
                                    <HorizontalGridLines />
                                    <VerticalGridLines/>      
                                    
                                    <XAxis title="Year" />
                                    <YAxis title="Impact" />
                                    {this.state.LandImpact && data && <LineSeries
                                                                            strokeWidth={3}
                                                                            color={DIVERGING_COLOR_SCALE[0]}
                                                                            label="test"
                                                                            className="first-series"
                                                                            data={getParsedData(data[0], this.state.LandImpact)}                                                                           
                                                                        />
                                    }

                                    {this.state.WaterImpact && data && <LineSeries
                                                                            strokeWidth={3}
                                                                            color={DIVERGING_COLOR_SCALE[1]}
                                                                            className="second-series"
                                                                            data={getParsedData(data[1], this.state.WaterImpact)}
                                                                        />
                                        
                                    }

                                    {this.state.AtmosphereImpact && data && <LineSeries
                                                                                className="third-series"
                                                                                color={DIVERGING_COLOR_SCALE[2]}
                                                                                style={{
                                                                                    //strokeDasharray: '10 2'
                                                                                }}
                                                                                strokeWidth={3}
                                                                                data={getParsedData(data[3], this.state.AtmosphereImpact)}
                                                                            />
                                        
                                    }
                                    <DiscreteColorLegend
                                        className="impact-chart"
                                        colors={[DIVERGING_COLOR_SCALE[0],DIVERGING_COLOR_SCALE[1],DIVERGING_COLOR_SCALE[2]]}
                                        orientation="horizontal"
                                        items={["Land Impact", "Water Impact", "Atmosphere Impact"]}
                                    />
                                </XYPlot>
                                
                                <label>Land Impact</label>
                                <Slider 
                                    min={0}
                                    max={100}
                                    onChange={(e:number) => setLandImpact(e)}
                                />

                                <label>Water Impact</label>
                                <Slider 
                                    min={0}
                                    max={100}
                                    onChange={(e:number) => setWaterImpact(e)}
                                />

                                <label>Atmosphere Impact</label>
                                <Slider 
                                    min={0}
                                    max={100}
                                    onChange={(e:number) => setWaterImpact(e)}
                                />
                            </div>
        } else {
            return <p>No Data provided for charts</p>  
        }
    }
}
/*
<LineSeries
                                        className="third-series"
                                        curve={'curveMonotoneX'}
                                        style={{
                                            strokeDasharray: '2 2'
                                        }}
                                        data={[
                                            {x: 1, y: 10},
                                            {x: 2, y: 4},
                                            {x: 3, y: 2},
                                            {x: 4, y: 15}
                                        ]}
                                        strokeDasharray="7, 3"
                                    />
                                    <LineSeries
                                        className="fourth-series"
                                        curve={curveCatmullRom.alpha(0.5)}
                                        data={[
                                            {x: 1, y: 7},
                                            {x: 2, y: 11},
                                            {x: 3, y: 9},
                                            {x: 4, y: 2}
                                        ]}
                                    />
*/