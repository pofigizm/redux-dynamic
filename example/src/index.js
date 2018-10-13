import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createInstance } from 'redux-dynamic'
import Loadable from 'react-loadable';
import * as moduleOne from './module-one';

const dynamicStore = createInstance();
const store = dynamicStore.getStore();

// sync module
const ModuleOneContainer = moduleOne.Container;
dynamicStore.attach(moduleOne);
store.dispatch(moduleOne.actions.init());

// async module
const ModuleTwoContainer = Loadable({
  loader: () => import('./module-two'),
  loading: () => <div> module-two loading... </div>,
  render: (loaded, props) => {
      const { Container, ...moduleTwo} = loaded;
      dynamicStore.attach(moduleTwo);
      store.dispatch(moduleTwo.actions.init());

      return <Container {...props} />;
  }
});

ReactDOM.render(
    <Provider store={store} >
        <div> 
            <ModuleOneContainer />
            <ModuleTwoContainer />
            <App />
        </div>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
