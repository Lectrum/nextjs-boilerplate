// Core
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

// Instruments
import { useStore } from '../init/store';

// Styles
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps)  => {
    const store = useStore(pageProps.initialReduxState);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
                <meta name="description" content="Lectrum Next.js Test Task" />
                <link rel="icon" href="/favicon.ico" />
                <title>Lectrum Next.js Test Task</title>
            </Head>
            <Provider store = { store }>
                <Component {...pageProps} />
            </Provider>
        </>
    )
}

export default MyApp;
