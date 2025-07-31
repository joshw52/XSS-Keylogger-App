import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { AuthContext } from '../authContext';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const onAuthCheck = () =>
    axios
      .get('/api/auth', { withCredentials: true })
      .then(res => setLoggedIn(res.data.isAuthenticated));

  useEffect(() => {
    onAuthCheck();
  }, []);

  const onLogin = ({ password, username }, setLoginResponse) =>
    axios
      .post('/api/login', {
        password,
        username,
      })
      .then(res => {
        setLoggedIn(res.status <= 400);
        setLoginResponse(res.data);
      }).catch(error => {
        setLoggedIn(false);
        if (error.response && error.response.data) {
          setLoginResponse({
            ...error.response.data,
          });
        } else {
          setLoginResponse({
            loginMsg: 'Network error. Please try again.',
          });
        }
      });

  const onLogout = () =>
    axios.post('/api/logout', { withCredentials: true }).then(() => setLoggedIn(false));

  const loggedInContextValues = {
    loggedIn,
    onAuthCheck,
    onLogin,
    onLogout,
  };

  return <AuthContext.Provider value={loggedInContextValues}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
