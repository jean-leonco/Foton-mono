import 'react-native-gesture-handler';
import React, { Suspense } from 'react';
import { StatusBar } from 'react-native';
import { RelayEnvironmentProvider } from 'relay-hooks';
import FlashMessage from 'react-native-flash-message';

import Routes from './routes';
import environment from './relay/Environment';

import LoadingScreen from './modules/common/LoadingScreen';
import ErrorBoundary from './modules/common/ErrorBoundary';

const App = () => {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlashMessage position="bottom" floating />
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
};

export default App;
