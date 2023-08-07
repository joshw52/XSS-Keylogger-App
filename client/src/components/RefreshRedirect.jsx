import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../authContext';

const RefreshRedirect = ({ children }) => {
  const { loggedIn } = useContext(AuthContext);
  const location = useLocation();
  return loggedIn ? (
    <Navigate replace state={{ from: location }} to="/dashboard" />
  ) : (
    children
  );
};

export default RefreshRedirect;
