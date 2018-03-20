import * as React from 'react';
import {Row, Col} from 'antd';

interface BottomBarProps{
   Visible: boolean;
}
export default class BottomBar extends React.Component<BottomBarProps, {}> {

    render(){
        return <Row 
                    className={"bottom-bar " + (this.props.Visible ? "visible" : "hidden")}
                >
                    {this.props.children}
                </Row>               
    }
}