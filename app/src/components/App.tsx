import * as React from 'react';
import Root from "../containers/Root";
import TeamDetailContainer from '../containers/TeamDetailContainer';
import AdminRoot from '../components/AdminRoot'
import { Route, Switch } from 'react-router';
import LoginContainer from '../containers/LoginContainer'
import State1Container from '../containers/State1Container'

// Icon = require('-!svg-react-loader?name=Icon!../img/si-glyph-leaf.svg');
import Routes from '../routes/Routes';

export class App extends React.Component<{}> {

  render() {
    //console.log("image element",<Icon/>);

    return (
      <div>
        <Switch>
          <Route exact={true} path="/admin" component={AdminRoot}/>
          <Route exact={true} path="/login" component={LoginContainer}/>
          <Route exact={true} path="/" component={Root} key={1}/>
          <Route exact={true} path="/who-gets-the-water" component={State1Container} key={1}/>
          <Route exact={false} component={TeamDetailContainer} path="/team-detail/:id" key={2}/>
        </Switch>
      </div>
    );
  }

}
/* <Route exact={true} path="/" component={Root} key={1}/>
        <Route exact={false} component={TeamDetailContainer} path="/team-detail/:id" key={2}/>       
  {Object.keys(routes).map((route) => {
          return <Route {...routes[route]} key={routes[route].sequence} />;
        })}
 */


