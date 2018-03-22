import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import ApplicationStore from './stores/Store';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, compose  } from 'redux';
import reducer from './reducers/RootReducer';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { App } from './components/App'
import {Layout} from 'antd';
import { Row, Col } from 'antd/lib/grid';
import './style/app.scss';
const history  = createBrowserHistory();
export const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(thunk)
  // other store enhancers if any
));

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        <Row type="flex" justify="center">
          <Col xs={24}>
            <App />
          </Col >
        </Row>
      </Layout>
    </ConnectedRouter>
  </Provider>,
  app
);

