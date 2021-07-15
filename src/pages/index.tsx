// Core
import Head from 'next/head';
import { Typography } from '@material-ui/core';

// Styles
import styles from '../styles/Home.module.scss';

const Home = () => {
  return (
    <section className={styles.container}>
      <Typography component='h1'>Добро пожаловать!</Typography>
    </section>
  )
};

export default Home;
