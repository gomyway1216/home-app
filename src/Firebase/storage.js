import * as fbConnect from './firebaseConnect';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import * as util from '../util/util';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getLocationList = async (userId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'user', userId, 'storageLocation'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const locationDoc = querySnapshot.docs[i];
    response.push(locationDoc.data().name);
  }
  return response;
};

export const createLocation = async (userId, location) => {
  const docRef = await addDoc(collection(getDbAccess(), 'user', userId, 'storageLocation'), { name: location });
  return docRef.id;
};

export const getOwnerList = async (userId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'user', userId, 'storageOwner'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const ownerDoc = querySnapshot.docs[i];
    response.push(ownerDoc.data().name);
  }
  return response;
};

export const createOwner = async (userId, owner) => {
  const docRef = await addDoc(collection(getDbAccess(), 'user', userId, 'storageOwner'), { name: owner });
  return docRef.id;
};

export const getTypeList = async (userId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'user', userId, 'storageType'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const typeDoc = querySnapshot.docs[i];
    response.push(typeDoc.data().name);
  }
  return response;
};

export const createType = async (userId, type) => {
  const docRef = await addDoc(collection(getDbAccess(), 'user', userId, 'storageType'), { name: type });
  return docRef.id;
};

export const getItemList = async (userId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'user', userId, 'storage'));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const itemDoc = querySnapshot.docs[i];
    const item = {
      id: itemDoc.id,
      location: itemDoc.data().location, // where the item is stored
      owner: itemDoc.data().owner, // who owns it
      type: itemDoc.data().type, // foods/condiments/drinks
      purchaseDate: util.convertFbTimeToDate(itemDoc.data().purchaseDate), // date of purchasing the item
      expiryDate: util.convertFbTimeToDate(itemDoc.data().expiryDate), // expiry date of the item
      name: itemDoc.data().name, // item name
      isAvailable: itemDoc.data().isAvailable // if the item is still available to take
    };
    response.push(item);
  }
  return response;
};

export const createItem = async (userId, item) => {
  const docRef = await addDoc(collection(getDbAccess(), 'user', userId, 'storage'), item);
  return docRef.id;
};

export const updateItem = async (userId, item) => {
  try {
    await updateDoc(doc(getDbAccess(), 'user', userId, 'storage', item.id), {
      location: item.location,
      owner: item.owner,
      type: item.type,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      name: item.name,
      isAvailable: item.isAvailable
    });
  } catch (err) {
    console.log('err for update: ', err);
    return err;
  }
};

export const consumeItem = async (userId, itemId) => {
  try {
    await updateDoc(doc(getDbAccess(), 'user', userId, 'storage', itemId), {
      isAvailable: false
    });
  } catch (err) {
    console.log('err for consuming item: ', err);
    return err;
  }
};