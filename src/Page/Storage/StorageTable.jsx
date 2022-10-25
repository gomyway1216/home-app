import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, 
  GridToolbarColumnsButton, GridToolbarFilterButton, 
  GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ItemDialog from './ItemDialog';
import * as storageApi from '../../Firebase/storage';
import useMobileQuery from '../../Hook/useMobileQuery';
import IconButtonWithTooltip from '../../Component/IconButtonWithTooltip';
import * as util from '../../util/util';
import styles from './storage-table.module.scss';


const StorageTable = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItem, setDialogItem] = useState({});
  const { locationList, ownerList, typeList, itemList, getItemList } = props;
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
      valueGetter: ({ value }) => value && new Date(value)
    },
    { field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: 150,
      type: 'date',
      valueGetter: ({ value }) => {
        return value && new Date(value);
      },
      sortComparator: (a, b) => {
        const distantFuture = new Date(8640000000000000);
        let dateA = a ? a : distantFuture;
        let dateB = b ? b : distantFuture;
        return dateA.getTime() - dateB.getTime();
      }
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
    storageApi.consumeItem(props.groupId, row.id);
    getItemList(props.groupId);
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
        initialState={{
          sorting: {
            sortModel: [{ field: 'expiryDate', sort: 'asc' }]
          },
          filter: {
            filterModel: {
              items: [{ columnField: 'isAvailable', operatorValue: 'is', value: 'true' }]
            },
          },
        }}
        autoHeight
        componentsProps={{
          panel: {
            sx: {
              '& .MuiDataGrid-filterForm': {
                display: 'flex',
                flexDirection: 'column'
              },
            },
          }
        }}

        getRowClassName={(params) => {
          if (params.row.expiryDate instanceof Date) {
            if(util.isDatePast(params.row.expiryDate)) {
              return `${styles.expired}`;
            } else if (util.isDateWithInAWeek(params.row.expiryDate)) {
              return `${styles.expiring}`;
            }  
          }
        }}
      />
      <ItemDialog open={dialogOpen} onClose={handleDialogClose} callback={getItemList} 
        locationList={locationList} ownerList={ownerList} typeList={typeList} item={dialogItem} groupId={props.groupId}/>
    </div>
  );
};

StorageTable.propTypes = {
  locationList: PropTypes.array.isRequired,
  ownerList: PropTypes.array.isRequired,
  typeList: PropTypes.array.isRequired,
  itemList: PropTypes.array.isRequired,
  getItemList: PropTypes.func.isRequired,
  groupId: PropTypes.string
};

export default StorageTable;