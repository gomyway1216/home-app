import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouteList from './RouteList';
import { AuthProvider } from './Provider/AuthProvider';
import ApplicationBar from './NavBar/ApplicationBar';

const App = () => {
  return (
    <BrowserRouter >
      <AuthProvider>
        <ApplicationBar />
        <RouteList />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;