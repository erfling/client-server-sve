import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import ApplicationStore from './stores/Store';

import { App } from './components/App';
import { createStore } from 'redux';
import reducer from './reducers/RootReducer';


const history  = createBrowserHistory();
const store = createStore(reducer);
console.log("Store in index", reducer, store, store.getState());

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

