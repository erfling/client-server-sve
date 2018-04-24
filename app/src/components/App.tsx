
import * as React from 'react';
import { Route, Switch } from 'react-router';
import LoginContainer from '../containers/LoginContainer'


interface ImportState{
  AdminRoot:any;
  State1Container: any;
  State2Container: any;
  State3Container: any;
  Intermission: any;
  AdminMessageContainer: any;
  ReconnectModal: any;
}


export class App extends React.Component<{}, ImportState> {
  componentDidMount(){
    this.setState({});
    import('../components/State1')
      .then(module => module.default)
      .then(State1Container => this.setState(Object.assign({}, this.state, {State1Container})));

    import('../containers/State2Container')
      .then(module => module.default)
      .then(State2Container => this.setState(Object.assign({}, this.state, {State2Container})));

    import('../containers/State3Container')
      .then(module => module.default)
      .then(State3Container => this.setState(Object.assign({}, this.state, {State3Container})));

    import('../components/Intermission')
      .then(module => module.default)
      .then(Intermission => this.setState(Object.assign({}, this.state, {Intermission})));

    import('../components/AdminMessageModal')
      .then(module => module.default)
      .then(AdminMessageContainer => this.setState(Object.assign({}, this.state, {AdminMessageContainer})));

    import('../components/ReconnectModal')
      .then(module => module.default)
      .then(ReconnectModal => this.setState(Object.assign({}, this.state, {ReconnectModal})));
     
    import('../components/AdminRoot')
     .then(module => module.default)
     .then(AdminRoot => this.setState(Object.assign({}, this.state, {AdminRoot})));


  }
  render() {
    if(!this.state)return <div></div>
    return (
      <div style={{width:'100vw'}}>

        <Switch>
          {this.state.AdminRoot && <Route exact={false} path="/admin" component={this.state.AdminRoot}/>}
          <Route exact={true} path="/login" component={LoginContainer}/>
          <Route exact={true} path="/" component={LoginContainer} key={1}/>
          {this.state.State1Container && <Route exact={true} path="/who-gets-the-water" component={this.state.State1Container} key={1}/>}          
          {this.state.State2Container && <Route exact={true} path="/make-the-trade" component={this.state.State2Container} key={2}/>}
          <Route exact={true} path="/intermission" component={this.state.Intermission} key={2}/>

          {this.state.State3Container && <Route exact={true} path="/solve-the-puzzles" component={this.state.State3Container} key={2}/>}
          {this.state.Intermission && <Route exact={true} path="/Intermission" component={this.state.Intermission} key={2}/>}
        </Switch>
        
        {this.state.AdminMessageContainer && <Route component={this.state.AdminMessageContainer} key={2}/>}
        {this.state.ReconnectModal && <Route component={this.state.ReconnectModal} key={2}/>}        
      </div>

    );
  }

}

