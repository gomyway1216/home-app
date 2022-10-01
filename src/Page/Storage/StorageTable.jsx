import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, 
  GridToolbarColumnsButton, GridToolbarFilterButton, 
  GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ItemModal from './ItemModal';
import * as storageApi from '../../Firebase/storage';
import { useAuth } from '../../Provider/AuthProvider';
import useMobileQuery from '../../Hook/useMobileQuery';
import IconButtonWithTooltip from '../../Component/IconButtonWithTooltip';
import styles from './storage-table.module.scss';


const StorageTable = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItem, setDialogItem] = useState({});
  const { locationList, ownerList, typeList, itemList, getItemList } = props;
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { matches } = useMobileQuery();

  const columns = [
    {
      field: 'consume',
      headerName: 'Consume',
      sortable: false,
      filterable: false,
      width: 80,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          handleConsumeItem(params.row);
        };
        return (
          <IconButtonWithTooltip aria-label="consume" tooltipText="click here to consume" color="primary" disabled={!params.row.isAvailable} onClick={onClick} />
        );
      }
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'location', headerName: 'Location', width: 80, type: 'singleSelect', valueOptions: locationList },
    { field: 'owner', headerName: 'Owner', width: 80, type: 'singleSelect', valueOptions: ownerList },
    { field: 'type', headerName: 'Type', width: 100, type: 'singleSelect', valueOptions: typeList },
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
    { field: 'isAvailable', headerName: 'Available', width: 100, type: 'boolean' },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
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
      {matches.width && <div className={styles.commands}>
        <Button onClick={getItemList} variant="outlined" startIcon={<ReplayIcon />}>Update</Button>
      </div>
      }
      <DataGrid
        rows={itemList}
        columns={columns}
        components={{ Toolbar: () => {
          return (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>);
        }}}
        autoHeight
        componentsProps={{
          panel: {
            sx: {
              '& .MuiDataGrid-filterForm': {
                display: 'flex',
                flexDirection: 'column'
              },
            },
          },
        }}
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
  getItemList: PropTypes.func.isRequired,
  innerRef: PropTypes.any
};

export default StorageTable;