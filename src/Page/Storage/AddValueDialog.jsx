import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../../Firebase/storage';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogTitle, List, ListItem, ListItemText, TextField } from '@mui/material';
import styles from './add-value-dialog.module.scss';


const AddValueDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onItemInputChange = (e) => {
    setValue(e.target.value);
  };

  const onSave = async () => {
    try {
      setLoading(true);
      let docId;
      // triggers api based on the data type that user is appending
      if(props.dialogMode === 'location') {
        docId = await api.createLocation(props.groupId, value);
      } else if (props.dialogMode === 'type') {
        docId = await api.createType(props.groupId, value);
      }
      
      if (docId) {
        setValue('');
        props.callback();
      } else {
        console.log('saving ' + props.dialogMode + ' failed');
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>Add to {props.dialogMode}</DialogTitle>
        <DialogContent>
          {loading && 
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box> 
          }
          <List>
            {props.valueList.map((item, i) =>
              <ListItem disablePadding key={i}>
                <ListItemText primary={item} />
              </ListItem>
            
            )}
          </List>
          <div className={styles.addWrapper}>
            <TextField label='New value'
              value={value} 
              onChange={onItemInputChange}/>
            <Button variant="outlined" onClick={onSave}>Add</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddValueDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired,
  valueList: PropTypes.array.isRequired,
  dialogMode: PropTypes.string.isRequired
};


export default AddValueDialog;