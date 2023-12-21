import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';      // Used for showing children components, referring to Profile component

function PrivateRoute() {

  const { currentUser } = useSelector((state) => state.user);

  return (
    currentUser ? ( <Outlet /> ) : (<Navigate to={'/sign-in'} />)
  );
};

export default PrivateRoute;