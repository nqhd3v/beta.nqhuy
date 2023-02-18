import React from 'react'
import { NextSeo } from 'next-seo'
import SubPageHeader from '@/components/sub-page-header'
import { useMessage } from '@/utils/hooks'

function Reading () {
  const { msg } = useMessage();

  return (
    <>
      <NextSeo title="Docs" description="This is docs page for my portfolio beta version" />
      <div>
        <SubPageHeader title={msg('page.docs.title')} description={msg('page.docs.description')} />
      </div>
    </>
  )
}

export default Reading
