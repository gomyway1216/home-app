import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import NoFoodIcon from '@mui/icons-material/NoFood';


const IconButtonWithTooltip = ({ tooltipText, disabled, onClick, ...other }) => {
  disabled = typeof disabled === 'undefined' ? false : disabled;
  const adjustedButtonProps = {
    disabled: disabled,
    component: disabled ? 'div' : undefined,
    onClick: disabled ? undefined : onClick
  };
  return (
    <Tooltip title={tooltipText}>
      <IconButton {...other} {...adjustedButtonProps} >
        <NoFoodIcon />
      </IconButton>
    </Tooltip>
  );
};

IconButtonWithTooltip.propTypes = {
  tooltipText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default IconButtonWithTooltip;