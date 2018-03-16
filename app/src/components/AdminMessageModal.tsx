import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal, Button } from 'antd';
//import Games from "./games";
import ApplicationStore from '../stores/Store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import { ACTION_TYPES } from '../actions/Actions';

interface AdminMessageProps {
    AdminMessage: string;
    dismissAdminMessage: () => {}
}

export class AdminMessageModal extends React.Component<AdminMessageProps, {}> {
    render() {
        if (!this.props.AdminMessage) return null

        return <Modal
                    title={<span>Message from the game.</span>}
                    visible={true}
                    width="80%"
                    footer={<Button 
                                type="primary" 
                                size="large"
                                onClick={e => this.props.dismissAdminMessage()}
                            >
                                OK
                            </Button>}
                >
                    <p>{this.props.AdminMessage}</p>
                </Modal>                    
    }
}

interface DispatchProps {
    dismissAdminMessage: () => {}
}
export interface State1Props{
    AdminMessage:string
}
const mapStateToProps = (state: ApplicationStore, ownProps: {}): State1Props => {
    return {
        AdminMessage: state.Application.AdminMessage
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationStore & DispatchProps>, ownProps: any) => {
    return {
        dismissAdminMessage: () => {
            dispatch( Actions.dismissAdminMessage() )
        }
    }
}

const AdminMessageContainer = connect<State1Props, {}>(mapStateToProps, mapDispatchToProps)(AdminMessageModal);
export default AdminMessageContainer;
//onClick={e => this.props.acknowledgeDealRejection()}