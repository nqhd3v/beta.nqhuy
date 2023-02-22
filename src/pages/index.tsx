import React from 'react'
import { NextSeo } from 'next-seo'
import { AnimatePresence, motion as m } from 'framer-motion'

export default function Home () {
  return (
    <>
      <NextSeo title="Home" description="This is home page for my portfolio beta version" />
      <div className='w-full min-h-screen flex justify-center items-center'>
        <div className="w-[calc(100%-40px)] sm:w-[calc(100%-144px)] h-[104px] sm:h-[160px] md:h-[192px] lg:h-[232px]">
          <div className="flex items-center justify-center">
            <div>
              <AnimatePresence mode="wait">
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: .5, duration: .3 }}}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-sm code-cmd "
                >
                  <span className="code-cmd-cmd">whoami</span>
                </m.div>
              </AnimatePresence>
              <div className="overflow-hidden relative sm:h-18 md:h-[84px] lg:h-[92px]">
                <AnimatePresence mode="wait">
                  <m.div
                    className='text-3xl sm:leading-[72px] sm:text-[72px] md:text-[84px] md:leading-[84px] lg:text-[92px] lg:leading-[92px] special'
                    initial={{ y: '100%' }}
                    animate={{ y: 0, transition: { duration: .5, delay: 1 }}}
                    exit={{ y: '100%' }}
                  >
                    I am a
                  </m.div>
                </AnimatePresence>
              </div>
              <div className="overflow-hidden relative h-12 sm:h-[68px] md:h-[88px] lg:h-[120px]">
                <AnimatePresence mode="wait">
                  <m.div
                    className='text-[48px] leading-[48px] sm:text-[68px] sm:leading-[68px] md:text-[88px] md:leading-[88px] lg:text-[120px] lg:leading-[120px] special'
                    initial={{ y: '100%' }}
                    animate={{ y: 0, transition: { duration: .5, delay: 1.5 }}}
                    exit={{ y: '100%' }}
                  >
                    Web Developer
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
