import React from 'react';
import { Provider } from 'react-redux';

import MainNavigator from "./src/navigators/MainNavigator"
import GlobalModule from "./src/component/GlobalModule"

import Store from "./src/store/Store"

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <GlobalModule >
          <MainNavigator />
        </GlobalModule>
      </Provider >
    );
  }
}