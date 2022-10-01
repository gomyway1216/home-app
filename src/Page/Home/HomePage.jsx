import React from 'react';
import ItemCard from './ItemCard';
import foodImage from '../../../src/assets/image/food.jpg';
import styles from './home-page.module.scss';


const HomePage = () => {
  return (
    <div className={styles.root}>
      <div className={styles.cards}>
        <ItemCard title="Storage" description="Keeping track of foods/condiments/drinks" image={foodImage} link='/storage' />
      </div>
    </div>
  );
};

export default HomePage;