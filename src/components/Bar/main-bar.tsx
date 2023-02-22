import React from 'react'
import { useIsWidthSM, useRouter } from '@/utils/hooks'
import { AnimatePresence, motion as m } from 'framer-motion'
import BarItem, { DarkLight } from './bar-item'

const MainBar: React.FC = () => {
  const { isCurrent, go, route } = useRouter()
  const isWidthLG = useIsWidthSM()
  const hasOthers = ['/docs/[doc]', '/projects/[prj]'].includes(route)
  const initial = () => {
    if (isWidthLG) {
      return { opacity: 0, x: 0, y: 76 }
    }
    return { x: -112, y: 0, opacity: 0 }
  }
  const animate = () => {
    if (isWidthLG) {
      return hasOthers
        ? { y: -10, opacity: 1, transition: { duration: 0.5 } }
        : { y: 100, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }
    }
    return { x: -116, y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }
  }

  return (
    <AnimatePresence mode="wait">
      <m.div
        initial={initial()}
        animate={animate()}
        exit={{ opacity: 0, y: 76 }}
        className={
          'fixed left-1/2 bottom-2 sm:left-2 lg:left-5 sm:bottom-1/2 z-30 ' +
          'flex sm:w-auto sm:flex-col px-5 sm:px-2 py-2 rounded-md bg-light-50/30 dark:bg-dark-600/30 backdrop-blur-sm sm:shadow dark:shadow-dark-700 '
        }
      >
        <BarItem
          icon="fas fa-user"
          active={isCurrent('/')}
          onClick={() => go('/')}
          className="mr-2 last:mr-0 sm:mr-0 sm:mb-2 sm:last:m-0"
        />
        <BarItem
          icon="fas fa-folder"
          active={isCurrent('/projects')}
          onClick={() => go('/projects')}
          className="mr-2 last:mr-0 sm:mr-0 sm:mb-2 sm:last:m-0"
        />
        <BarItem
          icon="fas fa-pencil"
          active={isCurrent('/docs')}
          onClick={() => go('/docs')}
          className="mr-2 last:mr-0 sm:mr-0 sm:mb-2 sm:last:m-0"
        />
        <DarkLight />
      </m.div>
    </AnimatePresence>
  )
}

export default MainBar
