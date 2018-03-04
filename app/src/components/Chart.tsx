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
                    colors={["red", "orange", "#3366cc"]}
                    orientation="horizontal"
                    items={["Paris Accord", "Preindustrial Level", "Adjusted Temp Increase"]}
                />

                <XYPlot
                    height={400}
                    width={window.innerWidth - 30}
                    margin={{ left: 60, right: 60, top: 60 }}
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
                        strokeWidth={3}
                        color="red"
                        label="test"
                        className="first-series"
                        style={{
                            strokeDasharray: '10 2'
                        }}
                        data={this.getParsedData(2)}
                    />

                    <LineSeries
                        strokeWidth={3}
                        color="orange"
                        className="second-series"
                        style={{
                            strokeDasharray: '10 2'
                        }}
                        data={this.getParsedData(0)}
                    />

                    <LineSeries
                        strokeWidth={3}
                        color="rgba(0,0,0,0)"
                        className="second-series"
                        data={this.getParsedData(4)}
                    />

                    <LineSeries
                        className="third-series"
                        color="#3366cc"
                        style={{
                            //strokeDasharray: '10 2'
                        }}
                        strokeWidth={3}
                        data={this.getParsedData(this.props.Dashboard)}
                    />


                </XYPlot>

        </Row> : null}

}