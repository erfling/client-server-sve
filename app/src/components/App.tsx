import * as React from 'react';
import State0Container from "../containers/State0Container";
import AdminRoot from '../components/AdminRoot'
import { Route, Switch } from 'react-router';
import LoginContainer from '../containers/LoginContainer'
import State1Container from '../components/State1'
import State2Container from '../containers/State2Container'
import State3Container from '../containers/State3Container'
import State4Container from '../containers/State4Container'
import State5Container from '../containers/State5Container'
import AdminMessageContainer from '../components/AdminMessageModal';
import ReconnectModal from '../components/ReconnectModal';

export class App extends React.Component<{}> {

  render() {
    return (
      <div>

        <Switch>
          <Route exact={false} path="/admin" component={AdminRoot}/>
          <Route exact={true} path="/login" component={LoginContainer}/>
          <Route exact={true} path="/" component={LoginContainer} key={1}/>
          <Route exact={true} path="/who-gets-the-water" component={State1Container} key={1}/>
          <Route exact={true} path="/make-the-trade" component={State2Container} key={2}/>
          <Route exact={true} path="/war-of-the-worlds" component={State3Container} key={2}/>
          <Route exact={true} path="/international-trade" component={State4Container} key={2}/>
          <Route exact={true} path="/experiment" component={State5Container} key={2}/>
        </Switch>

        <Route component={AdminMessageContainer}/>
        <Route component={ReconnectModal}/>

      </div>
    );
  }

}
