import React from 'react';
import { UserDataProvider } from './context/UserContext';
import Contact from './pages/contact';
import UserSignup from './pages/UserSignup';

const App = () => {
  return (
    <UserDataProvider>
      <UserSignup />
      <Contact />
    </UserDataProvider>
  );
};

export default App;