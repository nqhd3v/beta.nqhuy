import React from 'react'
import { AnimatePresence, motion as m } from 'framer-motion'

interface iSubPageHeader {
  title: string;
  path: [string, string] | string;
}
const SubPageHeader: React.FC<iSubPageHeader> = ({ title, path }) => {
  return (
    <div className="page-content-width h-[120px] lg:h-[300px] flex items-center justify-between m-auto">
      <div>
        <AnimatePresence mode="wait">
          <m.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            className="text-sm code-cmd "
          >
            <span className="code-cmd-cmd">{Array.isArray(path) && path.length > 1 ? path[0] : 'cat'}</span>
            <span className="code-cmd-args">{Array.isArray(path) && path.length > 1 ? path[1] : path}</span>
          </m.div>
        </AnimatePresence>
        <div className="overflow-hidden h-10 relative">
          <AnimatePresence mode="wait">
            <m.div
              initial={{ y: '100%' }}
              animate={{ y: 0, transition: { duration: 0.3, delay: 0.2 } }}
              exit={{ y: '-100%' }}
              className="text-4xl font-bold text-dark-500 dark:text-light-50"
            >
              {title}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SubPageHeader
