import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../../Firebase/storage';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, 
  FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useAuth } from '../../Provider/AuthProvider';
import moment from 'moment';
import styles from './item-modal.module.scss';

const defaultItem = {
  location: '',
  owner: '',
  type: '',
  purchaseDate: moment(),
  expiryDate: moment(),
  name: '',
  isAvailable: true
};


const ItemModal = (props) => {
  const [open, setOpen] = useState(props.open);
  const [dialogItem, setDialogItem] = useState(defaultItem);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
    
  useEffect(() => {
    setOpen(props.open);
    // trick to initialize dialogItem, without the below line, dialogItem is empty
    if(props.item) {
      const modifiedItem = props.item;
      modifiedItem.purchaseDate = moment(props.item.purchaseDate);
      modifiedItem.expiryDate = moment(props.item.expiryDate);
      setDialogItem(modifiedItem);
    }
  }, [props.open]);

  const onItemInputChange = (e) => {
    setDialogItem({
      ...dialogItem,
      [e.target.name]: e.target.value
    });
  };

  const onDateInputChange = (name) => (value) => {
    setDialogItem({
      ...dialogItem,
      [name]: value
    });
  };

  //TODO: validate this method
  const onSelectInputChange = (e) => {
    setDialogItem({
      ...dialogItem,
      [e.target.name]: e.target.value
    });
  };

  const onSwitchChange = (e) => {
    setDialogItem({
      ...dialogItem,
      [e.target.name]: e.target.checked
    });
  };

  const onSave = async (item) => {
    try {
      setLoading(true);
      // convert moment date to js date
      item.purchaseDate = item.purchaseDate.toDate();
      item.expiryDate = item.expiryDate.toDate();
      if(props.item) {
        const err = await api.updateItem(userId, item);
        if (err) {
          console.log('Updating the item failed.');
        } else {
          props.onClose();
          setDialogItem(defaultItem);
          props.callback();
        }
      } else {
        const itemId = await api.createItem(userId, item);
        if (itemId) {
          props.onClose();
          setDialogItem(defaultItem);
          props.callback();
        } else {
          console.log('saving the new item failed.');
        }
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const renderInputFields = (item) => {
    if (item.includes('is')) {
      return <FormControlLabel
        control={<Switch
          name={item}
          checked={dialogItem[item]}
          onChange={onSwitchChange}
        />}
        label={item}
        labelPlacement="start"
      />;
    } else if (item.includes('owner')) {
      return <FormControl>
        <InputLabel id="orderby-select-label">Owner</InputLabel>
        <Select
          id="owner"
          name="owner"
          value={dialogItem[item]}
          onChange={onSelectInputChange}
          className={styles.owner}
          style={{width: 200}}
        >
          {props.ownerList.map((val, i) =>
            <MenuItem key={val} value={val}>{val}</MenuItem>
          )}
        </Select>
      </FormControl>;
    } else if (item.includes('location')) {
      return <FormControl>
        <InputLabel id="orderby-select-label">Location</InputLabel>
        <Select
          id="location"
          name="location"
          value={dialogItem[item]}
          onChange={onSelectInputChange}
          className={styles.location}
          style={{width: 200}}
        >
          {props.locationList.map((val, i) =>
            <MenuItem key={val} value={val}>{val}</MenuItem>
          )}
        </Select>
      </FormControl>;
    } else if (item.includes('type')) {
      return <FormControl>
        <InputLabel id="orderby-select-label">Type</InputLabel>
        <Select
          id="type"
          name="type"
          value={dialogItem[item]}
          onChange={onSelectInputChange}
          className={styles.type}
          style={{width: 200}}
        >
          {props.typeList.map((val, i) =>
            <MenuItem key={val} value={val}>{val}</MenuItem>
          )}
        </Select>
      </FormControl>;
    } else if (item.includes('Date')) {
      return <LocalizationProvider dateAdapter={AdapterMoment}>
        <MobileDatePicker
          label={item === 'purchaseDate' ? 'Purchase Date' : 'Expiry Date'}
          inputFormat="MM/DD/YYYY"
          value={dialogItem[item]}
          onChange={onDateInputChange(item)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>;     
    } else if (item === 'id') {
      return <></>;
    } else {
      return <TextField id={item} name={item} label={item}
        fullWidth
        value={dialogItem[item]} 
        onChange={onItemInputChange}/>;
    }
  };

  if (Object.keys(dialogItem).length === 0) {
    return <></>;
  }

  return (
    <div>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>Purchased Item</DialogTitle>
        <DialogContent>
          <Grid container item={true} spacing={3}>      
            {Object.keys(props.item ? props.item : defaultItem).map((item, i) => (
              <Grid key={item} item={true} xs={12} sm={12} md={12}>
                {renderInputFields(item)}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Cancel</Button>
          <Button onClick={() => onSave(dialogItem)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  locationList: PropTypes.array.isRequired,
  ownerList: PropTypes.array.isRequired,
  typeList: PropTypes.array.isRequired,
  item: PropTypes.shape({
    location: PropTypes.string,
    owner: PropTypes.string,
    type: PropTypes.string,
    purchaseDate: PropTypes.any,
    expiryDate: PropTypes.any,
    name: PropTypes.string,
    isAvailable: PropTypes.bool
  })
};

export default ItemModal;