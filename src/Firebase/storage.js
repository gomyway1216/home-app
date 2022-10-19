import * as fbConnect from './firebaseConnect';
import { addDoc, collection, getDoc, getDocs, doc, query, updateDoc, where } from 'firebase/firestore'; 
import * as util from '../util/util';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

// the group should contain
// name, admin, users that contains the list of userId
export const getGroup = async (groupId) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'group', groupId));
  if(querySnapshot.exists()) {
    return querySnapshot.data();
  } else {
    console.log('No group with id: ' + groupId + ' exists');
    return null;
  }
};

export const getGroupList = async (userId) => {
  const response = [];
  const q = query(collection(getDbAccess(), 'group'), where('users', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const groupDoc = querySnapshot.docs[i];
    const item = {
      id: groupDoc.id,
      name: groupDoc.data().name,
      admin: groupDoc.data().admin,
      users: groupDoc.data().users
    };
    response.push(item);
  }
  return response;
};

export const createGroup = async (group) => {
  const docRef = await addDoc(collection(getDbAccess(), 'group'), group);
  return docRef.id;
};

export const updateGroup = async (groupId, group) => {
  try {
    await updateDoc(doc(getDbAccess(), 'group', groupId), {
      name: group.name,
      users: group.users
    });
  } catch (err) {
    console.log('error when updating group: ', err);
    return err;
  }
};

export const getLocationList = async (groupId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'group', groupId, 'storageLocation'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const locationDoc = querySnapshot.docs[i];
    response.push(locationDoc.data().name);
  }
  return response;
};

export const createLocation = async (groupId, location) => {
  const docRef = await addDoc(collection(getDbAccess(), 'group', groupId, 'storageLocation'), { name: location });
  return docRef.id;
};

export const getTypeList = async (groupId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'group', groupId, 'storageType'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const typeDoc = querySnapshot.docs[i];
    response.push(typeDoc.data().name);
  }
  return response;
};

export const createType = async (groupId, type) => {
  const docRef = await addDoc(collection(getDbAccess(), 'group', groupId, 'storageType'), { name: type });
  return docRef.id;
};

export const getItemList = async (groupId) => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'group', groupId, 'storage'));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const itemDoc = querySnapshot.docs[i];
    const item = {
      id: itemDoc.id,
      location: itemDoc.data().location, // where the item is stored
      owner: itemDoc.data().owner, // who owns it
      type: itemDoc.data().type, // foods/condiments/drinks
      purchaseDate: util.convertFbTimeToDate(itemDoc.data().purchaseDate), // date of purchasing the item
      expiryDate: itemDoc.data().expiryDate ? util.convertFbTimeToDate(itemDoc.data().expiryDate) : null, // expiry date of the item
      name: itemDoc.data().name, // item name
      isAvailable: itemDoc.data().isAvailable // if the item is still available to take
    };
    response.push(item);
  }
  return response;
};

export const createItem = async (groupId, item) => {
  const docRef = await addDoc(collection(getDbAccess(), 'group', groupId, 'storage'), item);
  return docRef.id;
};

export const updateItem = async (groupId, item) => {
  try {
    await updateDoc(doc(getDbAccess(), 'group', groupId, 'storage', item.id), {
      location: item.location,
      owner: item.owner,
      type: item.type,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      name: item.name,
      isAvailable: item.isAvailable
    });
  } catch (err) {
    console.log('error when updating item: ', err);
    return err;
  }
};

export const consumeItem = async (groupId, itemId) => {
  try {
    await updateDoc(doc(getDbAccess(), 'group', groupId, 'storage', itemId), {
      isAvailable: false
    });
  } catch (err) {
    console.log('error when consuming item: ', err);
    return err;
  }
};