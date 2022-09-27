import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import NoFoodIcon from '@mui/icons-material/NoFood';
import ReplayIcon from '@mui/icons-material/Replay';
import ItemModal from './ItemModal';
import * as storageApi from '../../Firebase/storage';
import { useAuth } from '../../Provider/AuthProvider';
import styles from './storage-table.module.scss';

const StorageTable = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItem, setDialogItem] = useState({});
  const { locationList, ownerList, typeList, itemList, getItemList } = props;
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

  const columns = [
    { field: 'location', headerName: 'Location', width: 100 },
    { field: 'owner', headerName: 'Owner', width: 100 },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'purchaseDate', 
      headerName: 'Purchase Date', 
      width: 150,
      type: 'date',
      valueGetter: ({ value }) => value && new Date(value).toLocaleDateString()
    },
    { field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: 150,
      type: 'date',
      valueGetter: ({ value }) => value && new Date(value).toLocaleDateString()
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'isAvailable', headerName: 'Available', width: 100, type: 'boolean' },
    {
      field: 'consume',
      headerName: 'Consume',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          handleConsumeItem(params.row);
        };
        return (
          <Tooltip title="consume">
            <IconButton aria-label="consume" onClick={onClick} color="primary">
              <NoFoodIcon />
            </IconButton>
          </Tooltip>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          setDialogItem(params.row);
          handleDialogOpen();
        };
        return (
          <Tooltip title="edit">
            <IconButton aria-label="edit" onClick={onClick} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConsumeItem = (row) => {
    storageApi.consumeItem(userId, row.id);
    getItemList();
  };

  return (
    <div className={styles.storageTableRoot}>
      <div className={styles.commands}>
        <Button onClick={getItemList} variant="outlined" startIcon={<ReplayIcon />}>Update</Button>
      </div>
      <DataGrid
        rows={itemList}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
      />
      <ItemModal open={dialogOpen} onClose={handleDialogClose} callback={getItemList} 
        locationList={locationList} ownerList={ownerList} typeList={typeList} item={dialogItem}/>
    </div>
  );
};

StorageTable.propTypes = {
  locationList: PropTypes.array.isRequired,
  ownerList: PropTypes.array.isRequired,
  typeList: PropTypes.array.isRequired,
  itemList: PropTypes.array.isRequired,
  getItemList: PropTypes.func.isRequired
};

export default StorageTable;