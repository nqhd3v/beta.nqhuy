import React, { useEffect, useState } from 'react'
import Command from '@/components/Command'
import { useRouter } from 'next/router'

const Error404 = () => {
  const router = useRouter();
  const [currentPath, setPath] = useState<string>('');

  useEffect(() => {
    if (router.isReady) {
      setPath(router.asPath);
    }
  }, [router.isReady])

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Command
        lines={[
          {
            cmd: 'cd',
            args: [
              { type: 'path', content: currentPath || '@' },
            ]
          },
          {
            cmd: '!',
            args: [
              { type: 'error', content: 'no such file or directory: ' + (currentPath || '[path]') },
            ]
          },
          {
            cmd: 'cd',
            args: [
              { type: 'path', content: '/' },
            ]
          },
        ]}
        className="max-w-cmd"
        onRunLast={() => router.push('/')}
      />
    </div>
  )
}

export default Error404
