import { tNotionActivity, tNotionDoc } from '@/types/notion'
import { iQuery } from '@/types/service'
import { Client } from '@notionhq/client'
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN
})

export const getActivitiesNotion = async (): Promise<iQuery<tNotionDoc[]>> => {
  try {
    const docs = await notion.databases.query({ database_id: process.env.NEXT_PUBLIC_NOTION_DB as string })
    return {
      data: transformDocs(...docs.results)
    }
  } catch (err: any) {
    console.error('Error when activities from Notion:', err)
    return {
      errMsg: err.message || 'exception.notion.get.unknown'
    }
  }
}
export const getNotionDocs = async (published = true): Promise<iQuery<tNotionDoc[]>> => {
  try {
    const docs = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_NOTION_DB as string,
      filter: {
        property: 'Published',
        checkbox: {
          equals: published
        }
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    })
    return {
      data: transformDocs(...docs.results)
    }
  } catch (err: any) {
    console.error('Error when getting docs from Notion:', err)
    return {
      errMsg: err.message || 'exception.notion.get.unknown'
    }
  }
}

export const transformDocs = (...docs: (PartialPageObjectResponse | PageObjectResponse)[]): tNotionDoc[] => {
  return docs.map(d => {
    if ('properties' in d) {
      return {
        id: d.id,
        title: 'title' in d.properties.Name ? d.properties.Name.title[0].plain_text : '',
        description: 'rich_text' in d.properties.Description ? d.properties.Description.rich_text[0].plain_text : '',
        tags: 'multi_select' in d.properties.Tags ? d.properties.Tags.multi_select.map(t => t.name) : [],
        content: 'rich_text' in d.properties.Content ? d.properties.Content.rich_text[0].plain_text : '',
        date: 'last_edited_time' in d.properties.Date ? new Date(d.properties.Date.last_edited_time) : null,
        href: 'rich_text' in d.properties.Slug ? d.properties.Slug.rich_text[0].plain_text : ''
      }
    }
    return undefined
  }).filter(d => d) as tNotionDoc[]
}

export const transformActivities = (...docs: (PartialPageObjectResponse | PageObjectResponse)[]): tNotionActivity[] => {
  return docs.map(d => {
    if ('properties' in d) {
      return {
        id: d.id
      }
    }
    return undefined
  }).filter(d => d) as tNotionActivity[]
}
