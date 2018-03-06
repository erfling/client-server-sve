import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Row, Col, Modal, Icon, Button, Select, Spin } from 'antd';
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
export default class Chart extends React.Component<ChartProps, {}> {


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

   

    render() {
        if (!this.props.Dashboard) return <div />

        return this.props.Dashboard && this.props.Dashboard.length > 100 ? <Row className="main-chart">                
                <label>{this.props.children || 'Simulated Global Warming Data'}</label>
                <DiscreteColorLegend
                    className="impact-chart"
                    colors={["#ffa400", "#16591f", "#3366cc"]}
                    orientation="horizontal"
                    items={["Paris Accord", "Preindustrial Level", "Adjusted Temp Increase"]}
                    onItemMouseEnter={(item: any, index: number, event: any) => {
                        // does something on mouse enter
                        // you can access the value of the event
                        console.log(item, index, event)
                    }}

                    onItemMouseLeave={(item: any, index: number, event: any) => {
                        // does something on mouse enter
                        // you can access the value of the event
                        console.log(item, index, event);
                    }}
                />

                <XYPlot
                    height={600}
                    width={window.innerWidth}
                    margin={{ left: 60, right: 40, top: 60 }}
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
                        style={{ stroke: '#ddd' }}
                    />

 
                    <LineSeries
                        strokeWidth={5}
                        color="#ffa400"
                        label="test"
                        className="paris-accord"
                        data={this.getParsedData(2)}
                    />

                    <LineSeries
                        strokeWidth={5}
                        color="#16591f"
                        className="pre-industrial"
                        data={this.getParsedData(0)}
                    />


                    <LineSeries
                        className="value"
                        color="#3366cc"
                        style={{
                            //strokeDasharray: '10 2'
                        }}
                        strokeWidth={7}
                        data={this.getParsedData(this.props.Dashboard)}
                    />

                    <LineSeries
                        strokeWidth={1}
                        color="rgba(0,0,0,0)"
                        className="second-series"
                        data={this.getParsedData(4)}
                    />


                </XYPlot>

        </Row> : null}

}