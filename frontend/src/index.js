import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { saveState } from './helpers/localStorage';
import './index.css';
import Routes from './router';

// update localStorage whenever state changes
store.subscribe(() => {
  saveState(store.getState());
});

ReactDOM.render(
  <Provider store={store}>
      <Routes />
  </Provider>,
  document.getElementById('root')
);
