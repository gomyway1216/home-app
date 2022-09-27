import React, { useState } from 'react';
import { AppBar, Toolbar, List, ListItem, ListItemText, Drawer, IconButton, Menu, MenuItem, Typography, Alert, AlertTitle } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';


const ApplicationBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, signOut } = useAuth();
  const [error, setError] = useState('');

  const toggleDrawer = (open) => (event) => {
    if(event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleItemClick = () => {
    if(!isHome()) {
      navigate('/');
    }
  };

  const isHome = () => {
    return '/' === loc.pathname;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignIn = () => {
    navigate('/signin');
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    setError('');
    try {
      await signOut();
      setAnchorEl(null);
    } catch (e) {
      console.log('error while signing out!', e);
    }
  };

  const SideList = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button key={'Storage'} onClick={() => navigate('/storage')} >
          <ListItemText primary={'Storage'} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={handleItemClick} style={{ cursor: 'pointer' }}>
            Home Organizer
          </Typography>
          <div className="account-button-wrapper">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!currentUser && <MenuItem onClick={handleSignIn}>Sign In</MenuItem>}
              {currentUser && <MenuItem >{currentUser.userName ? currentUser.userName : currentUser.email.split('@')[0]}</MenuItem>}
              {currentUser && <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>}
            </Menu>
            {error && 
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            }
          </div>
        </Toolbar>
      </AppBar>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {SideList('left')}
      </Drawer>
    </div>
  );
};


export default ApplicationBar;