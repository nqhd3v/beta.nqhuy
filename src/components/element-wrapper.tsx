import React from 'react'
interface iElementWrapper {
  element: string;
  content: (JSX.Element | string)[] | JSX.Element | string;
  className?: string;
  includeElement?: boolean;
}

const ElementWrapper: React.FC<iElementWrapper> = ({ element, content, className = '', includeElement = true }) => {
  return (
    <div
      className={
        'relative py-8 before:w-px before:absolute before:bg-gray-300 dark:before:bg-gray-800 before:h-[calc(100%-60px)] before:top-1/2 before:-translate-y-1/2 ' +
        (includeElement ? 'px-6 before:left-3 ' : 'before:-left-2 before:lg:-left-4 text-justify ') +
        className
      }
    >
      <span className={'absolute text-sm top-2 text-gray-400 dark:text-gray-700 pointer-events-none ' + (includeElement ? 'left-0 ' : '-left-3 lg:-left-7 ')}>
        &lt;{element}&gt;
      </span>
      <span className={'absolute text-sm bottom-2 text-gray-400 dark:text-gray-700 pointer-events-none ' + (includeElement ? 'left-0 ' : '-left-3 lg:-left-7 ')}>
        &lt;{element}/&gt;
      </span>
      {content}
    </div>
  )
}

export default ElementWrapper
