import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './src/routes';
import Constants from './src/constants';

export default function App() {
  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={Constants.BACKGROUND_COLOR}/>
      <Routes />
    </>
  );
}
