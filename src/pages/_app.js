import React from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../components/Layout'

//import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import { generateDefaultSeo } from 'next-seo/pages'
import SEO from '../../next-seo.config'
import { StateContext } from '../context/StateContext'
import '../styles/globals.css' /* common page elements */
import '../styles/index.scss' /* main styles */

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {generateDefaultSeo({
          ...SEO,
          title: 'Next SEO Example',
          description:
            'Next SEO is a plug in that makes managing your SEO easier in Next.js projects.',
          twitter: {
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          },
        })}
        <link rel='manifest' href='/site.webmanifest' />
      </Head>

      <StateContext>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </>
  )
}

export default MyApp
