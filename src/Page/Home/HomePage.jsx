import React from 'react';
import ItemCard from './ItemCard';
import foodImage from '../../../src/assets/image/food.jpg';


const HomePage = () => {
  return (
    <div>
      <div>Home</div>
      <ItemCard title="Storage" description="Keeping track of foods/condiments/drinks" image={foodImage} link='/storage' />
    </div>
  );
};

export default HomePage;