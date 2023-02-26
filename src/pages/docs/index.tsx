import React from 'react'
import { NextSeo } from 'next-seo'
import SubPageHeader from '@/components/sub-page-header'
import { useMessage } from '@/utils/hooks'
import DocCard from '@/components/card/doc-card'
import { AnimatePresence, motion as m } from 'framer-motion'

function Docs () {
  const msg = useMessage()

  return (
    <>
      <NextSeo title="Docs" description="This is docs page for my portfolio beta version" />
      <div>
        <SubPageHeader title={msg('page.docs.title')} path="~/docs" />
        <AnimatePresence mode="wait">
          <m.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.6 } }}
            exit={{ y: 40, opacity: 0 }}
            className="page-content-width m-auto grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 pb-10"
          >
            <DocCard title="Sample app name" description='Sample app description with long content' href="/docs/this-is-doc-4-sample" />
          </m.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default Docs
