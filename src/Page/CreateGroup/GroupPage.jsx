import React, { useEffect, useState } from 'react';
import * as storageApi from '../../Firebase/storage';
import { Button, Box, CircularProgress, IconButton, List, ListItem,
  ListItemButton, ListItemText, TextField } from '@mui/material';
import { useAuth } from '../../Provider/AuthProvider';
import EditGroupDialog from './EditGroupDialog';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import styles from './group-page.module.scss';


const defaultErrorText = {
  name: '',
};

// there are 2 flows
// 1. group does not exist.
// 2. group already exists.
// when group does not exist, initialize the group name and the user
// the creator's userId should be added automatically. 
// this page should only show group creation and group list

const GroupPage = () => {
  const [loading, setLoading] = useState(true);
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [errorText, setErrorText] = useState(defaultErrorText);
  const { userId } = useAuth();
  const [groupList, setGroupList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const getGroupsForUser = async () => {
    const groups = await storageApi.getGroupList(userId);
    setGroupList(groups);
    setLoading(false);
  };

  const onAddGroup = async () => {
    let errT;
    try {
      setLoading(true);
      if(groupList.some(e => e.name === groupName)) {
        errT = 'Group Name already exists in your group list';
        setErrorText({
          ...errorText,
          'name': errT
        });
        return;
      }
      const gId = await storageApi.createGroup({ name: groupName, admin: userId, users: [userId] });
      setErrorText(defaultErrorText);
      errT = '';
      setGroupId(gId);
      setGroupName('');
      // show dialog to add users to the group
      setDialogOpen(true);
    } catch (err) {
      errT = 'Some unknown issue happened.';
    }
    setErrorText({
      ...errorText,
      ['name']: errT
    });
    setLoading(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    getGroupsForUser();
  };

  const handleAddUserChange = (e) => {
    setGroupName(e.target.value);
  };

  const onEditClick = (id) => {
    setDialogOpen(true);
    setGroupId(id);
  };

  useEffect(() => {
    getGroupsForUser();
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
        {groupList.length == 0 &&
          <h1>Please create a group to start</h1>
        }
        <div className={styles.groupList}>
          <List>
            {groupList.map((group, i) =>
              <ListItem disablePadding key={i} 
                secondaryAction={
                  <IconButton edge="end" aria-label="edit" onClick={() => onEditClick(group.id)}>
                    {group.admin === userId ? <EditIcon /> : <VisibilityIcon /> }
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => navigate('/storage', { state: { groupId: group.id} })}>
                  <ListItemText primary={group.name} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </div>
        <div className={styles.addUser}>
          <TextField label='New Group Name'
            value={groupName} 
            onChange={handleAddUserChange}
            error={errorText.name !== ''}
            helperText={errorText.name}
          />
          <Button variant="outlined" onClick={onAddGroup}>Add</Button>
        </div>
      </div>
      <EditGroupDialog open={dialogOpen} onClose={handleDialogClose} groupId={groupId} />
    </div>
  );
};

export default GroupPage;