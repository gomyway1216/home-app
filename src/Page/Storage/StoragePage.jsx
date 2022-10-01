import React, { useEffect, useState } from 'react';
import * as storageApi from '../../Firebase/storage';
import { Button } from '@mui/material';
import StorageTable from './StorageTable';
import AddValueModal from './AddValueModal';
import ItemModal from './ItemModal';
import { useAuth } from '../../Provider/AuthProvider';
import MobileAddOptions from './MobileAddOptions';
import useMobileQuery from '../../Hook/useMobileQuery';
import styles from './storage-page.module.scss';


const StoragePage = () => {
  const [locationList, setLocationList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [modalMode, setModalMode] = useState('');
  const [valueDialogOpen, setValueDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { matches } = useMobileQuery();

  const getLocationList = async () => {
    const locations = await storageApi.getLocationList(userId);
    setLocationList(locations);
  };

  const getOwnerList = async () => {
    const owners = await storageApi.getOwnerList(userId);
    setOwnerList(owners);
  };

  const getTypeList = async () => {
    const types = await storageApi.getTypeList(userId);
    setTypeList(types);
  };

  const getItemList = async () => {
    const items = await storageApi.getItemList(userId);
    setItemList(items);
  };
  

  const handleAddValue = (dataType) => {
    setModalMode(dataType);
    if(dataType === 'item') {
      setItemDialogOpen(true);
    } else {
      setValueDialogOpen(true);
    }
  };

  const handleValueDialogClose = () => {
    setValueDialogOpen(false);
  };

  const handleItemDialogClose = () => {
    setItemDialogOpen(false);
  };

  const fetchValueList = () => {
    if(modalMode === 'item') {
      getItemList();
    } else if (modalMode === 'location') {
      getLocationList();
    } else if (modalMode === 'owner') {
      getOwnerList();
    } else if (modalMode === 'type') {
      getTypeList();
    }
  };

  const getValueList = () => {
    if (modalMode === 'location') {
      return locationList;
    } else if (modalMode === 'owner') {
      return ownerList;
    } else if (modalMode === 'type') {
      return typeList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    getLocationList();
    getOwnerList();
    getTypeList();
    getItemList();
  }, []);

  return (
    <div className={styles.root}>
      <div>
        {matches.width && <div className={styles.actionButtons}>
          <Button onClick={() => handleAddValue('item')}>Add Item</Button>
          <Button onClick={() => handleAddValue('location')}>Add Location</Button>
          <Button onClick={() => handleAddValue('owner')}>Add Owner</Button>
          <Button onClick={() => handleAddValue('type')}>Add Type</Button>
        </div>
        }
        <StorageTable itemList={itemList} getItemList={getItemList} locationList={locationList} ownerList={ownerList} typeList={typeList} />
        <AddValueModal open={valueDialogOpen} onClose={handleValueDialogClose} callback={fetchValueList} valueList={getValueList()} modalMode={modalMode} />
        <ItemModal open={itemDialogOpen} onClose={handleItemDialogClose} callback={fetchValueList} 
          locationList={locationList} ownerList={ownerList} typeList={typeList} />
      </div>
      {!matches.width && <MobileAddOptions handleAddValue={handleAddValue}/>
      }
    </div>
  );
};

export default StoragePage;