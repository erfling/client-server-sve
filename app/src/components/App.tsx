import * as React from 'react';
import State0Container from "../containers/State0Container";
import TeamDetailContainer from '../containers/TeamDetailContainer';
import AdminRoot from '../components/AdminRoot'
import { Route, Switch } from 'react-router';
import LoginContainer from '../containers/LoginContainer'
import State1Container from '../containers/State1Container'
import State2Container from '../containers/State2Container'
import State3Container from '../containers/State3Container'

// Icon = require('-!svg-react-loader?name=Icon!../img/si-glyph-leaf.svg');
import Routes from '../routes/Routes';

export class App extends React.Component<{}> {

  componentWillMount(){
      console.log("component is mounting")
  }

  render() {
    //console.log("image element",<Icon/>);
    return (
      <div>
        <Switch>
          <Route exact={false} path="/admin" component={AdminRoot}/>
          <Route exact={true} path="/login" component={LoginContainer}/>
          <Route exact={true} path="/" component={State0Container} key={1}/>
          <Route exact={true} path="/who-gets-the-water" component={State1Container} key={1}/>
          <Route exact={true} path="/make-the-trade" component={State2Container} key={2}/>
          <Route exact={true} path="/war-of-the-worlds" component={State3Container} key={2}/>
          <Route exact={false} component={TeamDetailContainer} path="/team-detail/:id" key={3}/>
        </Switch>
      </div>
    );
  }

}
