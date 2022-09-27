import * as React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, CardActionArea, Typography, } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemCard = (props) => {
  const { title, description, image, link } = props;
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => navigate(link)}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ItemCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default ItemCard;
