import React, { useEffect } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

import locales from '@/locales'

import MainBar from '@/components/Bar/main-bar'
import 'public/fontawesome/css/all.min.css'
import '@/styles/globals.css'
import store from '@/stores'
import { AnimatePresence, motion as m } from 'framer-motion'
import DocBar from '@/components/Bar/docs-bar'

function MyApp ({ Component, pageProps, router }: AppProps) {
  const url = `https://beta.nqhuy.dev${router.route}`

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Handle error here
  if (router.pathname === '/404') {
    return (
      <IntlProvider locale={router.locale || 'en'} messages={locales[router.locale || 'en']}>
        <Head>
          <title>No such file or directory</title>
          <link rel="icon" href="/favicon.png" type="image/png" />
        </Head>
        <Component {...pageProps} canonical={url} key={url} />
      </IntlProvider>
    )
  }

  return (
    <IntlProvider locale={router.locale || 'en'} messages={locales[router.locale || 'en']}>
      <Provider store={store}>
        <Head>
          <link rel="icon" href="/favicon.png" type="image/png" />
        </Head>
        <DefaultSeo
          titleTemplate="nqhuy.%s"
          openGraph={{
            type: 'website',
            locale: 'en',
            url,
            description: 'This page was created by HuyNguyen.',
            site_name: 'Huy Nguyen Portfolio | a.nqhuy.dev',
            images: []
          }}
          canonical={url}
        />
        <main>
          <MainBar />
          <DocBar />
          <AnimatePresence mode="wait">
            <m.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: .5} }} exit={{ y: -50, opacity: 0, transition: { duration: .5} }} key={url}>
              <Component {...pageProps} canonical={url} />
            </m.div>
          </AnimatePresence>
        </main>
      </Provider>
    </IntlProvider>
  )
}

export default MyApp
