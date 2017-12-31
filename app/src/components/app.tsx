import * as React from 'react';
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