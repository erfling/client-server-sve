import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import ApplicationStore from './stores/Store';
import thunk from 'redux-thunk'

import { App } from './components/App';
import { createStore } from 'redux';
import reducer from './reducers/RootReducer';
import { applyMiddleware } from 'redux';


const history  = createBrowserHistory();
const store = createStore(reducer, applyMiddleware(thunk));

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  app
);

