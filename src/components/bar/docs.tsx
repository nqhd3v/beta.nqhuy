import React from 'react'
import { useRouter } from '@/utils/hooks'
import { AnimatePresence, motion as m } from 'framer-motion'
import { Heart, Sharing } from './item'

const DocBar = () => {
  const { route } = useRouter()

  return (
      <AnimatePresence mode="wait">
        {route === '/docs/[doc]'
          ? (<m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20, transition: { delay: 0.5, duration: 0.3 } }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
          className={
            'fixed top-1/2 left-2 lg:left-5 z-[29] ' +
            'flex flex-col p-2 rounded-md bg-light-50/30 dark:bg-dark-600/30 backdrop-blue-md shadow dark:shadow-dark-700 '
          }
        >
          <Heart />
          <Sharing />
        </m.div>)
          : null}
      </AnimatePresence>
  )
}

export default DocBar
