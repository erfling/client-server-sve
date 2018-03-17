import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal, Button, Icon } from 'antd';
//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import { ACTION_TYPES } from '../actions/Actions';

interface AdminMessageProps {
    NeedsReconnect: boolean;
}

export class ReconnectModal extends React.Component<AdminMessageProps, {}> {
    render() {
        if (!this.props.NeedsReconnect) return null

        return <Modal
                    title={<span>You've been disconnected.</span>}
                    visible={true}
                    width="80%"
                    footer={<Button 
                        type="primary" 
                        size="large"
                        onClick={e => location.reload()}
                    >
                        OK
                    </Button>}
                >
                    <p>It looks like we've lost our connection to your device. Do you want to re-connect?</p>
                </Modal>                    
    }
}

interface DispatchProps {
}
export interface State1Props{
    NeedsReconnect:boolean
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
        NeedsReconnect: state.Application.NeedsReconnect
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
    }
}

const ReconnectModalContainer = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(ReconnectModal);
export default ReconnectModalContainer;
//onClick={e => this.props.acknowledgeDealRejection()}