import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Row, Icon, Button} from 'antd';
import ITradeOption from '../../../shared/models/ITradeOption';
import INation from '../../../shared/models/INation';

import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    DiscreteColorLegend,
    DiscreteColorLegendItem,
    Hint
} from 'react-vis';

interface ChartProps {
    Dashboard: any;
    ChartLabel?:string
}

const Beach = require("../img/Bangladesh_beach.jpeg")
export default class Chart extends React.Component<ChartProps, {Width: number}> {

    componentWillMount(){
        this.state = {Width: window.innerWidth}
    }
    /**
     * Add event listener
     */
    componentDidMount() {
        window.addEventListener("resize", this.updateChartDimensions.bind(this));
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateChartDimensions.bind(this));
    }

    
    componentDidUpdate(){
        var chartLabelParent = document.querySelector(".impact-chart");
        if(chartLabelParent){
            chartLabelParent.childNodes.forEach((n,i) => {
                if((n as Element).classList.contains("rv-discrete-color-legend-item")){
                    (n as Element).classList.remove("selected");
                    i == 2 ? (n as Element).classList.add("selected") : null;
                }
            })
        }        
    }

    updateChartDimensions(){
       this.setState(Object.assign({}, this.state, {Width: window.innerWidth}))
    }

    getParsedData(data: number[] | string[] | number) {
        var parsedData: any[] = [];

        for (var i = 2000; i < 2101; i++) {

            let value = typeof data == "number" ? data : data[i - 2000];
            parsedData.push({
                x: i,
                y: typeof value == "string" ? parseFloat(value) : value
            })
        }
        return parsedData;
    }

    private onChartItemClick(item: any, index:number):void {
        var chartLabelParent = document.querySelector(".impact-chart");
        console.log(item);
        chartLabelParent.childNodes.forEach((n,i) => {
            if((n as Element).classList.contains("rv-discrete-color-legend-item")){
                (n as Element).classList.remove("selected");
                i == index ? (n as Element).classList.add("selected") : null;
            }
        })

        document.querySelectorAll(".chart-line").forEach((el:Element) => {
            el.classList.remove("selected");
        });

        document.querySelector("." + item.props.children.toLowerCase().split(" ").join("-")).classList.add("selected");
    }

    render() {
        if (!this.props.Dashboard) return <div />

        return this.props.Dashboard  &&  this.props.Dashboard.length > 100 && this.state.Width ? <Row className="main-chart">                
                <label>{this.props.children || 'Simulated Global Warming Data'}</label>
                <DiscreteColorLegend
                    className="impact-chart"
                    colors={["#ffa400", "#16591f", "#3366cc"]}
                    orientation="horizontal"
                    items={["Paris Accord" , "Preindustrial", "Adjusted Temp Increase"].map((val, i) => {
                        return <a className="label-anchor">{val}</a>
                    })}
                    onItemClick={(item: any, index: number) => {
                        this.onChartItemClick(item, index);
                    }}
                />

                <XYPlot
                    height={600}
                    width={this.state.Width}
                    margin={{ left: 45, right: 52, top: 60 }}
                    className="line-chart"
                >
                    <HorizontalGridLines
                        style={{ stroke: '#B7E9ED' }}
                    />
                    <VerticalGridLines
                        tickValues={[2000, 2025, 2050, 2075, 2100]}
                        style={{ stroke: '#B7E9ED' }} />

                    <XAxis
                        tickValues={[2000, 2025, 2050, 2075, 2100]}
                        tickFormat={(tick: any) => tick.toString()}
                        style={{ stroke: '#ddd' }}
                    />
                    <YAxis
                        tickValues={[0, 1, 2, 3, 4]}
                        style={{ stroke: '#ddd' }}
                    />

 
                    <LineSeries
                        label="test"
                        className="paris-accord chart-line"
                        data={this.getParsedData(2)}
                    />

                    <LineSeries
                        className="preindustrial chart-line"
                        data={this.getParsedData(0)}
                    />

                    <LineSeries
                        className="adjusted-temp-increase chart-line selected"
                        style={{
                            //strokeDasharray: '10 2'
                        }}
                        data={this.getParsedData(this.props.Dashboard)}
                    />

                    <LineSeries
                        strokeWidth={1}
                        color="rgba(0,0,0,0)"
                        className="second-series"
                        data={this.getParsedData(4)}
                    />

                    <LineSeries
                        strokeWidth={5}
                        color="rgba(0,0,0,0)"
                        data={this.getParsedData(-0.5)}
                    />


                </XYPlot>

        </Row> : null}

}