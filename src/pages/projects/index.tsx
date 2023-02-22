import React from 'react'
import ProjectCard from '@/components/card/project-card'
import SubPageHeader from '@/components/sub-page-header'
import { AnimatePresence, motion as m } from 'framer-motion'
import { NextSeo } from 'next-seo'

const Projects = () => {
  // const { msg } = useMessage()
  return (
    <>
      <NextSeo title="Projects" description="This is projects page for my portfolio beta version" />
      <div>
        <SubPageHeader title="My projects" path="~/projects" />

        <AnimatePresence mode="wait">
          <m.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.6 } }}
            exit={{ y: 40, opacity: 0 }}
            className="page-content-width m-auto grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 pb-10"
          >
            <ProjectCard title="Sample project name" description="Sample project description with long content" href="/projects/1" />
          </m.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default Projects
