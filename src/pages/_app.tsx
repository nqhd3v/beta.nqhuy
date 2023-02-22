import React, { useEffect, useRef } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { AnimatePresence, motion as m } from 'framer-motion'

import locales from '@/locales'
import store from '@/stores'
import MainBar from '@/components/bar/main'
import DocBar from '@/components/bar/docs'

import 'public/fontawesome/css/all.min.css'
import '@/styles/globals.css'

function MyApp ({ Component, pageProps, router }: AppProps) {
  const url = `https://beta.nqhuy.dev${router.route}`
  const pageElementRef = useRef<HTMLDivElement>(null)

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
          titleTemplate="%s · nqhuy"
          openGraph={{
            type: 'website',
            locale: 'en',
            url,
            description: 'This page was created by HuyNguyen.',
            site_name: 'Huy Nguyen | nqhuy.dev',
            images: []
          }}
          canonical={url}
        />
        <main>
          <MainBar />
          <DocBar />
          <div className="w-full max-h-screen overflow-hidden">
            <AnimatePresence mode="wait">
              <m.div
                ref={pageElementRef}
                className='w-full hide-scrollbar max-h-screen overflow-auto overflow-x-hidden'
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
                exit={{ y: -50, opacity: 0, transition: { duration: 0.5 } }}
                key={url}
              >
                <Component {...pageProps } rootRef={pageElementRef} canonical={url} />
              </m.div>
            </AnimatePresence>
          </div>
        </main>
      </Provider>
    </IntlProvider>
  )
}

export default MyApp
