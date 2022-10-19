import React, { useState } from 'react';
import { TextField, Button, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider';
import * as userApi from '../../Firebase/user';
import styles from './sign-up-page.module.scss';


const defaultInput = {
  email: '',
  userId: '',
  password: '',
  passwordConfirm: ''
};

const SignUpPage = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState();
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp, setUserId } = useAuth();
  
  const onSignUp = async () => {
    const { email, userId, password, passwordConfirm } = itemInput;
    let validated = true;
    const newErrorText = { ...errorText };

    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);  
    if(!emailValid) {
      validated = false;
      newErrorText.email = 'email is invalid!';
    } else {
      newErrorText.email = '';
    }

    // check if the userId already exists in db
    const userExist = await userApi.checkUserExist(userId);
    if(userExist) {
      validated = false;
      newErrorText.userId = 'User ID already exists.';
    } else {
      newErrorText.userId = '';
    }

    if(!password || password.length < 8) {
      validated = false;
      newErrorText.password = 'password should be at least 8 characters';
    } else {
      newErrorText.password = '';
    }

    if(password !== passwordConfirm) {
      validated = false;
      newErrorText.passwordConfirm = 'password mismatch';
    } else {
      newErrorText.passwordConfirm = '';
    }

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText(defaultInput);

    try {
      setError('');
      setLoading(true);
      await signUp(email, password);
      const userObj = {
        userId: userId,
        email: email,
        points: 0
      };
      await userApi.signUpUser(userObj);
      setUserId(userId);
      navigate('/');
    } catch (e) {
      setError(e.message);
    }
    
    setLoading(false);
  };

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  // create userId form. Next to the userId, create a button to check if the User Id is valid
  // meaning to check if the user exists or not.
  return (
    <div className={styles.signUpPageRoot}>
      <div className={styles.signUpWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Sign Up</div>
        </div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className={styles.inputField} id="email" name="email" label="email" 
          value={itemInput.email} onChange={onItemInputChange} helperText={errorText.email}/>
        <TextField className={styles.inputField} id="userId" name="userId" label="User ID" 
          value={itemInput.userId} onChange={onItemInputChange} helperText={errorText.userId}/>
        <TextField className={styles.inputField} id="password" name="password" label="Password" 
          type="password" value={itemInput.password} onChange={onItemInputChange} helperText={errorText.password} />
        <TextField className={styles.inputField} id="passwordConfirm" name="passwordConfirm" label="Password" 
          type="password" value={itemInput.passwordConfirm} onChange={onItemInputChange} helperText={errorText.passwordConfirm} />
        <Button variant="contained" color="primary" onClick={onSignUp}>Sign Up</Button>
      </div>
      <div>
        Already have an account? <Link to='/signin'>Sign In</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
