import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as userApi from '../../Firebase/user';
import * as storageApi from '../../Firebase/storage';
import { Button, Box, CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogTitle, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useAuth } from '../../Provider/AuthProvider';
import styles from './edit-group-dialog.module.scss';


const defaultErrorText = {
  name: '',
  addingUser: ''
};

const EditGroupDialog = (props) => {
  const { userId } = useAuth();
  const [open, setOpen] = useState(props.open);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [admin, setAdmin] = useState('');
  const [userList, setUserList] = useState([userId]);
  const [addingUserId, setAddingUserId] = useState('');
  const [errorText, setErrorText] = useState(defaultErrorText);

  const getGroup = async () => {
    setLoading(true);
    const g = await storageApi.getGroup(props.groupId);
    setName(g.name);
    setAdmin(g.admin);
    setUserList(g.users);
    setLoading(false);
  };

  useEffect(() => {
    setOpen(props.open);
    if(props.groupId) {
      getGroup();
    }
    setAddingUserId('');
    setErrorText(defaultErrorText);
  }, [props.open]);

  const handleAddingUserIdChange = (e) => {
    setAddingUserId(e.target.value);
  };

  const onAddUser = async () => {
    try {
      setLoading(true);
      // check to make sure the user is new
      if(userList.includes(addingUserId)) {
        setErrorText({
          ...errorText,
          addingUser: 'user already exists in the list'
        });
        return;
      }
      
      // check to make sure user exists
      const userExist = await userApi.checkUserExist(addingUserId);
      if(!userExist) {
        setErrorText({
          ...errorText,
          addingUser: 'user does not exist'
        });
        setLoading(false);
        return;
      }
      await storageApi.updateGroup(props.groupId, {name, users: [...userList, addingUserId] });
      getGroup();
      setErrorText({
        ...errorText,
        addingUser: ''
      });
      setAddingUserId('');
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.root}>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          {loading && 
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box> 
          }
          <div>Admin: {admin}</div>
          <List>
            {userList.map((user, i) =>
              <ListItem disablePadding key={i}>
                <ListItemText primary={user} />
              </ListItem>
            )}
          </List>
          {admin === userId &&
            <div className={styles.addUserWrapper}>
              <TextField label='User Id'
                value={addingUserId} 
                onChange={handleAddingUserIdChange}
                error={errorText.addingUser !== ''}
                helperText={errorText.addingUser}
              />
              <Button variant="outlined" onClick={onAddUser}>Add</Button>
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

EditGroupDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired
};

export default EditGroupDialog;