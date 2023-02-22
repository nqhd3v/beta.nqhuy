import React from 'react'
import { NextSeo } from 'next-seo'
import DocHeader from '@/components/header/doc-header'
import { iPageProps } from '@/types/app'
import ElementWrapper from '@/components/element-wrapper'

const PostReading: React.FC<iPageProps> = ({ rootRef }) => {
  return (
    <>
      <NextSeo
        title="Post"
        description="This is reading page for my portfolio beta version"
      />
      <div>
        <DocHeader title="Sample document" rootRef={rootRef} />
        <div className="page-content-width m-auto py-20">
          <DocDescription />
          <div className="w-1 h-screen bg-red-100"></div>
        </div>
      </div>
    </>
  )
}

export default PostReading

const DocDescription = () => {
  return (
    <ElementWrapper
      element="main"
      includeElement
      className="text-gray-400 dark:text-gray-500 text-justify"
      content={
        'Sample document for application with the too long long long long long long long long long long long long ' +
        'long long long long long long long long long long long long long long long long long long long long long long long long' +
        'long long long long long long long long long long long long long long long long long long long long long long long long ' +
        'long long long long long long long long long long long long long long long long long long long long long long long long content.'
      }
    />
  )
}
