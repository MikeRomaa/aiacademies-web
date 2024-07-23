import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import Navigation from '~/components/Navigation';
import Footer from '~/components/Footer';
import '~/styles/globals.css';
import '~/styles/Spinner.css';
import Script from 'next/script';

const App = ({ Component, pageProps }: AppProps) => (
    <>
        <Head>
            <meta name="google-adsense-account" content="ca-pub-4897811061387102">
            <meta name="theme-color" content="#03045E" />
            <meta name="description" content="AI Education for Students by Students" />
            <meta name="keywords" content="AI Education, Learn AI, Learn machine learning, Learn python, AI courses, Machine learning courses, Python courses, Artificial Intelligence" />
            <meta property="og:title" content="AI Education" />
            <meta property="og:description" content="AI Education for Students by Students" />
            <meta property="og:image" content="https://aiacademies.com/img/logo192.png" />

            <link rel="shortcut icon" href="/img/favicon.ico" />

            <title>AI Academies</title>
        </Head>

        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-8HPKV9EYQB"
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
    
                    gtag('config', 'G-8HPKV9EYQB');
                `}
        </Script>

        <Navigation />
        <Component {...pageProps} />
        <Footer />
    </>
);

export default App;
