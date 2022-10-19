import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Provider/AuthProvider';
import * as userApi from '../../Firebase/user';


const defaultUser = {
  id: '',
  userId: '',
  userName: '',
  email: ''
};


const UserPage = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState(defaultUser);

  const getUserInfo = async () => {
    const userInf = await userApi.getUserByUserId(userId);
    setUser(userInf);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <div>UserPage</div>
      <div>
        <div>User info</div>
        <div>user Id: {user.userId}</div>
        <div>email: {user.email}</div>
        <div>points: {user.points}</div>
      </div>
    </div>
  );
};


export default UserPage;