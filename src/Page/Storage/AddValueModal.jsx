import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../../Firebase/storage';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { useAuth } from '../../Provider/AuthProvider';


const AddValueModal = (props) => {
  const [open, setOpen] = useState(props.open);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
    
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onItemInputChange = (e) => {
    setValue(e.target.value);
  };

  const onSave = async () => {
    try {
      setLoading(false);
      let docId;
      // triggers api based on the data type that user is appending
      if(props.modalMode === 'location') {
        docId = await api.createLocation(userId, value);
      } else if (props.modalMode === 'owner') {
        docId = await api.createOwner(userId, value);
      } else if (props.modalMode === 'type') {
        docId = await api.createType(userId, value);
      }
      
      if (docId) {
        setValue('');
        props.callback();
      } else {
        console.log('saving ' + props.modalMode + ' failed');
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>Add to {props.modalMode}</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="value list">
              <List>
                {props.valueList.map((item, i) =>
                  <ListItem disablePadding key={i}>
                    <ListItemButton>
                      <ListItemText primary={item} />
                    </ListItemButton>
                  </ListItem>
            
                )}
              </List>
            </nav>
          </Box>
          <div>
            <TextField label='New value'
              value={value} 
              onChange={onItemInputChange}/>
            <Button onClick={onSave}>Add</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddValueModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  valueList: PropTypes.array.isRequired,
  modalMode: PropTypes.string.isRequired
};


export default AddValueModal;