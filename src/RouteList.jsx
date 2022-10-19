import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import HomePage from './Page/Home/HomePage';
import StoragePage from './Page/Storage/StoragePage';
import SignInPage from './Page/SignIn/SignInPage';
import SignUpPage from './Page/SignUp/SignUpPage';
import ForgotPasswordPage from './Page/ForgotPassword/ForgotPasswordPage';
import UserPage from './Page/UserPage/UserPage';
import GroupPage from './Page/CreateGroup/GroupPage';


const RouteList = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/' element={<HomePage />} exact />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/storage' element={<PrivateRoute/>}>
          <Route exact path='/storage' element={<StoragePage/>}/>
        </Route>
        <Route exact path='/group' element={<PrivateRoute/>}>
          <Route exact path='/group' element={<GroupPage/>}/>
        </Route>
        <Route exact path='/user' element={<PrivateRoute/>}>
          <Route exact path='/user' element={<UserPage/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default RouteList;