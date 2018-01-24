import * as React from 'react';
import Root from "../containers/Root";
import TeamDetailContainer from '../containers/TeamDetailContainer';
import { Route, Switch } from 'react-router';

import routes from '../routes/routes';
export class App extends React.Component<{}> {

  render() {
    return (
      <Switch>
        {Object.keys(routes).map((route) => {
          return <Route {...routes[route]} key={routes[route].sequence} />;
        })}
        
      </Switch>
    );
  }

}
/* <Route exact={true} path="/" component={Root} key={1}/>
        <Route exact={false} component={TeamDetailContainer} path="/team-detail/:id" key={2}/>       
 
 */