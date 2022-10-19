import React, { createContext,useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { auth, signUpWithEmail, signInWithEmail, signOutUser } from '../Firebase/firebaseConnect';
import * as userApi from '../Firebase/user';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);

  const signUp = (email, password) => {
    return signUpWithEmail(email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmail(email, password);
  };

  const signOut = () => {
    signOutUser();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const updateEmail = (email) => {
    return currentUser.updateEmail(email);
  };

  const updatePassword = (password) => {
    return currentUser.updatePassword(password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setCurrentUser(user);
      if(user) {
        const u = await userApi.getUserByEmail(user.email);
        if(u) {
          setUserId(u.userId);
        }
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userId,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateEmail,
    updatePassword,
    setUserId
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any
};