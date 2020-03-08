import React from 'react';

import ErrorScreen from './ErrorScreen';

interface Error {
  name: string;
  message: string;
  stack?: string;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component {
  state: State = { error: null };

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorScreen error={error.message} />;
    }

    return children;
  }
}

export default ErrorBoundary;
