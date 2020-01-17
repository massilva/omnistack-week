import React from 'react';
import { StatusBar, YellowBox } from 'react-native';

import Routes from './src/routes';
import Constants from './src/constants';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

export default function App() {
  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={Constants.BACKGROUND_COLOR}/>
      <Routes />
    </>
  );
}
