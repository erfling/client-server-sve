import * as React from 'react';
import { Row, Col } from 'antd';

interface ScrollyContainerProps {
    Active: boolean;
    BackgroundColor?: string;
}

export default class ScrollyContainer extends React.Component<ScrollyContainerProps, {WasActive: boolean}> {

    componentDidUpdate(prevProps: any){
        if(prevProps && prevProps.Active && !this.props.Active){
            this.setState(Object.assign({}, this.state, {WasActive: true}))
        }
    }

    render() {

        const getClassName = () => {
            var className = "scrolly-container";
            if(this.props.Active) className += " active";
            if(this.state && this.state.WasActive)className += " was-active";
            return className;
        }

        return (
            <Row 
                type="flex" 
                justify="center"
                align="middle"          
                style={{                    
                    background: this.props.BackgroundColor ? this.props.BackgroundColor : 'purple'
                }}
                className={getClassName()}
            >
                {this.props.children}
            </Row>
        )

    }
}