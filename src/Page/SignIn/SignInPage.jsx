import React, { useState } from 'react';
import { TextField, Button, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider';
import styles from './sign-in-page.module.scss';


const defaultInput = {
  email: '',
  password: ''
};

const SignInPage = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState();
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const onSignIn = async () => {
    const { email, password } = itemInput;
    let validated = true;
    const newErrorText = { ...errorText };

    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if(!emailValid) {
      validated = false;
      newErrorText.email = 'email is invalid!';
    } else {
      newErrorText.email = '';
    }

    if(!password || password.length < 8) {
      validated = false;
      newErrorText.password = 'password should be at least 8 characters';
    } else {
      newErrorText.password = '';
    }

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText(defaultInput);

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
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

  return (
    <div className={styles.signInPageRoot}>
      <div className={styles.signInWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Sign In</div>
        </div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className={styles.inputField} id="email" name="email" label="email" 
          value={itemInput.email} onChange={onItemInputChange} helperText={errorText.email}/>
        <TextField className={styles.inputField} id="password" name="password" label="Password" 
          type="password" value={itemInput.password} onChange={onItemInputChange} helperText={errorText.password} />
        <Button variant="contained" color="primary" onClick={onSignIn}>Sign In</ Button>
        <div className={styles.forgotPasswordWrapper}>
          Forgot password? <Link to='/forgot-password'>Forgot password?</Link>
        </div>
      </div>
      <div>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
};

export default SignInPage;
