import React, { useEffect, useState } from 'react';
import * as storageApi from '../../Firebase/storage';
import { Box, Button, CircularProgress, FormControl, InputLabel, 
  MenuItem, Select, IconButton, Tooltip } from '@mui/material';
import StorageTable from './StorageTable';
import AddValueDialog from './AddValueDialog';
import ItemDialog from './ItemDialog';
import { useAuth } from '../../Provider/AuthProvider';
import MobileAddOptions from './MobileAddOptions';
import useMobileQuery from '../../Hook/useMobileQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import InformationDialog from './InformationDialog';
import styles from './storage-page.module.scss';


const StoragePage = () => {
  const [loading, setLoading] = useState(true);
  const [groupList, setGroupList] = useState([]);
  const [group, setGroup] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [dialogMode, setDialogMode] = useState('');
  const [valueDialogOpen, setValueDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const { userId } = useAuth();
  const { matches } = useMobileQuery();
  const navigate = useNavigate();
  const { state } = useLocation();

  const getGroupList = async () => {
    const groups = await storageApi.getGroupList(userId);
    setGroupList(groups);
    if (state && state.groupId) {
      setGroup(state.groupId);
      getGroup(state.groupId);
    } else if(groups && groups.length > 0) {
      setGroup(groups[0].id);
      getGroup(groups[0].id);
    } else {
    // if no groups, redirect to group creation page.
      navigate('/group');
    }
    setLoading(false);
  };

  const getGroup = async (groupId) => {
    const group = await storageApi.getGroup(groupId);
    setOwnerList(group.users);
    getLocationList(groupId);
    getTypeList(groupId);
    getItemList(groupId);
  };

  const getLocationList = async (groupId) => {
    const locations = await storageApi.getLocationList(groupId);
    setLocationList(locations);
  };

  const getTypeList = async (groupId) => {
    const types = await storageApi.getTypeList(groupId);
    setTypeList(types);
  };

  const getItemList = async (groupId) => {
    const items = await storageApi.getItemList(groupId);
    setItemList(items);
  }; 

  const handleAddValue = (dataType) => {
    setDialogMode(dataType);
    if(dataType === 'item') {
      setItemDialogOpen(true);
    } else {
      setValueDialogOpen(true);
    }
  };

  const handleSelectGroup = (e) => {
    getGroup(e.target.value);
    setGroup(e.target.value);
  };

  const handleValueDialogClose = () => {
    setValueDialogOpen(false);
  };

  const handleItemDialogClose = () => {
    setItemDialogOpen(false);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  const handleInfoButtonClick = () => {
    setInfoDialogOpen(true);
  };

  const fetchValueList = () => {
    if(dialogMode === 'item') {
      getItemList(group);
    } else if (dialogMode === 'location') {
      getLocationList(group);
    } else if (dialogMode === 'type') {
      getTypeList(group);
    }
  };

  const getValueList = () => {
    if (dialogMode === 'location') {
      return locationList;
    } else if (dialogMode === 'type') {
      return typeList;
    } else {
      return [];
    }
  };

  // fetch the list of the groups that the user belongs to,
  // then fetch some other data corresponding to the group after a group is selected
  useEffect(() => {
    getGroupList();
  }, []);

  if(loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box> 
    );
  }

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.groupSelector}>
          <FormControl>
            <InputLabel id="orderby-select-label">Group</InputLabel>
            <Select
              id="group"
              name="group"
              value={group}
              onChange={handleSelectGroup}
              className={styles.group}
              style={{width: 200}}
            >
              {groupList.map((val, i) =>
                <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => navigate('/group')}>Edit Group</Button>
          <Tooltip title='info'>
            <IconButton onClick={handleInfoButtonClick}>
              <InfoIcon color="primary"/>
            </IconButton>
          </Tooltip>
        </div>
        {matches.width && 
          <div className={styles.actionButtons}>
            <Button onClick={() => handleAddValue('item')}>Add Item</Button>
            <Button onClick={() => handleAddValue('location')}>Add Location</Button>
            <Button onClick={() => handleAddValue('type')}>Add Type</Button>
          </div>
        }
        <StorageTable itemList={itemList} getItemList={getItemList} locationList={locationList} 
          ownerList={ownerList} typeList={typeList} groupId={group}/>
        <AddValueDialog open={valueDialogOpen} onClose={handleValueDialogClose} callback={fetchValueList} 
          valueList={getValueList()} dialogMode={dialogMode} groupId={group}/>
        <ItemDialog open={itemDialogOpen} onClose={handleItemDialogClose} callback={fetchValueList} 
          locationList={locationList} ownerList={ownerList} typeList={typeList} groupId={group}/>
        <InformationDialog open={infoDialogOpen} onClose={handleInfoDialogClose} />
      </div>
      {!matches.width && <MobileAddOptions handleAddValue={handleAddValue}/>
      }
    </div>
  );
};

export default StoragePage;