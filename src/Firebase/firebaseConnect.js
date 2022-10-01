import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

let firebaseApp;
let db;
let auth;

export const init = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  if(!db) {
    db = getFirestore(firebaseApp);
  }
  if(!auth) {
    auth = getAuth(firebaseApp);
  }
};
init();

export const exportDbAccess = () => {
  return db;
};

export const exportStorageAccess = () => {
  return getStorage(firebaseApp);
};

export { auth };

export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      console.log('errorCode: ', error.code);
      console.log('errorMessage: ', error.message);
      throw new Error('Sign up failed!');
    });
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    }).catch((error) => {
      console.log('errorCode: ', error.code);
      console.log('errorMessage: ', error.message);
      throw new Error('Sign in failed!');
    });
};

export const signOutUser = () => {
  signOut(auth).then(() => {
    console.log('sign out successful!');
  }).catch((error) => {
    console.log('sign out has some error', error);
  });
};