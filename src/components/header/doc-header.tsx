import { AnimatePresence, motion as m, useScroll, useSpring } from "framer-motion"
import React from "react";

interface iDocHeader {
  title?: string;
  rootRef?: React.RefObject<HTMLDivElement>;
}
const DocHeader: React.FC<iDocHeader> = ({ title, rootRef }) => {
  const { scrollYProgress } = useScroll({
    container: rootRef
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });


  return (
    <div className="page-content-width fixed top-0 left-1/2 -translate-x-1/2 z-10 backdrop-blur-md h-16 flex items-center border border-dashed border-t-0 border-l-0 border-r-0 border-dark-50 dark:border-light-500">
      <div className="relative h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0, transition: { duration: .3 } }}
            exit={{ y: '-100%', transition: { duration: .3 } }}
            className="overflow-hidden whitespace-nowrap text-ellipsis font-bold text-2xl"
            key={`docs.doc-header-name=${title}`}
          >
            {title || 'Untitled'}
          </m.div>
        </AnimatePresence>
      </div>
      <m.div
        className="absolute -bottom-[3px] left-0 right-0 h-[5px] bg-dark-50 dark:bg-light-500 origin-left z-[1]"
        style={{ scaleX }}
      />
    </div>
  )
};

export default DocHeader;