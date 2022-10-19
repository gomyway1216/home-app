import * as fbConnect from './firebaseConnect';
import { addDoc, collection, getDocs, doc, query, 
  updateDoc, where, increment } from 'firebase/firestore'; 

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const checkUserExist = async (userId) => {
  const q = query(collection(getDbAccess(), 'user'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty) {
    return false;
  } else {
    return true;
  }
};

export const signUpUser = async (user) => {
  const docRef = await addDoc(collection(getDbAccess(), 'user'), user);
  return docRef.id;
};

export const getUserByEmail = async (email) => {
  const q = query(collection(getDbAccess(), 'user'), where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if(!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const user = {
      id: doc.id,
      userId: doc.data().userId,
      email: doc.data().email,
      points: doc.data().points,
    };
    return user;
  } else {
    return null;
  }
};

export const getUserByUserId = async (userId) => {
  const q = query(collection(getDbAccess(), 'user'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if(!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const user = {
      id: doc.id,
      userId: doc.data().userId,
      email: doc.data().email,
      points: doc.data().points,
    };
    return user;
  } else {
    return null;
  }
};

export const incrementPoint = async (userId) => {
  try {
    const user = await getUserByUserId(userId);
    await updateDoc(doc(getDbAccess(), 'user', user.id), {
      points: increment(1)
    });
  } catch (err) {
    console.log('error when incrementing user point: ', err);
    return err;
  }
};