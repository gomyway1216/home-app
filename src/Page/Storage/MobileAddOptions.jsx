import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import styles from './mobile-add-options.module.scss';

const MobileAddOptions = (props) => {
  const { handleAddValue } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionButtonClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={styles.addIconContainer}>
      {isExpanded && <div className={styles.actionButtons}>
        <Button variant="outlined" onClick={() => handleAddValue('item')}>Add Item</Button>
        <Button variant="outlined" onClick={() => handleAddValue('location')}>Add Location</Button>
        <Button variant="outlined" onClick={() => handleAddValue('type')}>Add Type</Button>
      </div>
      }
      <div className={styles.addIcon}>
        <Fab color="primary" aria-label="add" onClick={handleOptionButtonClick}>
          <AddIcon />
        </Fab>
      </div>

    </div>
  );
};


MobileAddOptions.propTypes = {
  handleAddValue: PropTypes.func.isRequired,
};


export default MobileAddOptions;