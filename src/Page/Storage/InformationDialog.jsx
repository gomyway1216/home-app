import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, 
  DialogContent, DialogTitle } from '@mui/material';


const InformationDialog = (props) => {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>Usage</DialogTitle>
        <DialogContent>
          This feature is to keep track of the location of the items.
          <br/>
          To make the most out of it, please register locations and types before adding any item.
          <br/>
          Location can be like fridge, freezer, cupboards.
          <br/>
          Type can be like food, condiment, and drink
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

InformationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InformationDialog;