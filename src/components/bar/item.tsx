// import { useIsWidthSM } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'
// import { AnimatePresence, motion as m } from 'framer-motion'

interface iItemClickable { icon: string, text?: string, active?: boolean, className?: string, onClick: () => void }
const ItemClickable: React.FC<iItemClickable> = ({ icon, text, active, className = '', onClick }) => {
  // const isSm = useIsWidthSM();

  // if (isSm) {
  //   return (
  //     <>
  //       <AnimatePresence mode="wait">
  //         <m.div
  //           className={
  //             'w-10 h-10 rounded-md shadow-md ' +
  //             'bg-light dark:bg-dark-300 hover:bg-light-50 dark:hover:bg-dark-400 ' +
  //             'font-xl ' +
  //             (active ? 'text-blue-400 dark:text-white ' : 'text-dark dark:text-light-200 cursor-pointer ') +
  //             'flex items-center justify-center ' +
  //             'duration-300 ' +
  //             className
  //           }
  //           initial={{ }}
  //           onClick={() => active ? null : onClick()}
  //         >
  //           <i className={'text-lg' + icon} />
  //         </m.div>
  //       </AnimatePresence>
  //       <AnimatePresence mode="wait">
  //         <m.div
  //           className={
  //             'px-2 py-1 rounded-md shadow-md ' +
  //             'bg-light dark:bg-dark-300 hover:bg-light-50 dark:hover:bg-dark-400 ' +
  //             'font-xl ' +
  //             (active ? 'text-blue-400 dark:text-white ' : 'text-dark dark:text-light-200 cursor-pointer ') +
  //             'flex items-center justify-center ' +
  //             'duration-300 ' +
  //             className
  //           }
  //           initial={{ }}
  //           onClick={() => active ? null : onClick()}
  //         >
  //           <i className={'text-lg' + icon} />
  //         </m.div>
  //       </AnimatePresence>
  //     </>
  //   )
  // }

  return (
    <div
      className={
        'w-10 h-10 rounded-md shadow-md ' +
        'bg-light dark:bg-dark-300 hover:bg-light-50 dark:hover:bg-dark-400 ' +
        'font-xl ' +
        (active ? 'text-blue-400 dark:text-white ' : 'text-dark dark:text-light-200 cursor-pointer ') +
        'flex items-center justify-center ' +
        'duration-300 ' +
        className
      }
      onClick={() => active ? null : onClick()}
    >
      <i className={icon} />
    </div>
  )
}

export default ItemClickable

export const Heart: React.FC<{ active?: boolean, onClick?: () => void }> = ({ active, onClick }) => {
  return (
    <div
      className={
        'w-10 h-10 rounded-md shadow-md ' +
        'bg-light dark:bg-dark-300 hover:bg-light-50 dark:hover:bg-dark-400 ' +
        'font-xl cursor-pointer ' +
        'flex items-center justify-center ' +
        'duration-300 mb-2 last:mb-0 group'
      }
      onClick={() => active ? null : onClick?.()}
    >
      <i className={`fa${active ? 's' : 'r'} fa-heart text-dark dark:text-light-200 group-hover:text-red-400 duration-300`} />
    </div>
  )
}

export const Sharing: React.FC<{ active?: boolean, onClick?: () => void }> = ({ active, onClick }) => {
  return (
    <div
      className={
        'w-10 h-10 rounded-md shadow-md ' +
        'bg-light dark:bg-dark-300 hover:bg-light-50 dark:hover:bg-dark-400 ' +
        'font-xl ' +
        (active ? 'text-blue-400 dark:text-white ' : 'text-dark dark:text-light-200 cursor-pointer ') +
        'flex items-center justify-center ' +
        'duration-300 mb-2 last:mb-0 group'
      }
      onClick={() => active ? null : onClick?.()}
    >
      <i className="fas fa-share-nodes" />
    </div>
  )
}

const isDarkModeActivated = (): boolean =>
  (localStorage && localStorage.theme === 'dark') ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
export const DarkLight: React.FC = () => {
  const [darkOn, setDark] = useState<boolean>(false)

  const toggleMode = (): void => {
    localStorage.theme = !darkOn ? 'dark' : 'light'
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setDark(!darkOn)
  }

  useEffect(() => {
    setDark(isDarkModeActivated())
  }, [])

  return (
    <div
      className={
        'w-10 h-10 rounded-md shadow-md ' +
        'bg-light dark:bg-dark-300 hover:bg-light-50 dark:hover:bg-dark-400 ' +
        'font-xl cursor-pointer ' +
        'flex items-center justify-center ' +
        'duration-300 mb-2 last:mb-0 group'
      }
      onClick={() => toggleMode()}
    >
      <i
        className={
          (darkOn ? 'fas ' : 'far ') +
          'fa-lightbulb text-dark dark:text-light-200 group-hover:text-yellow-400 duration-300 '
        }
      />
    </div>
  )
}
