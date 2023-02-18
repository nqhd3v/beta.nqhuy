import React, { useEffect, useMemo } from 'react'
import TextLoading from './text-loading';

type tCommandArg = { type: 'string' | 'path' | 'operator' | 'error', content: string };
export type tCommandLine = {
  cmd: 'cd' | 'mv' | '#' | '!';
  args: tCommandArg[];
}
export interface iCommand {
  lines: tCommandLine[];
  className?: string;
  onRunLast?: () => void;
}
const Command: React.FC<iCommand> = ({ lines, className, onRunLast }) => {
  const cmdLines = useMemo(() => lines.map((l, i) => ({
    isComment: l.cmd === '#',
    isError: l.cmd === '!',
    isLast: i === lines.length - 1,
    args: l.args.map((a, j) => ({ ...a, paramIndex: j })),
    cmd: l.cmd,
    row: i + 1,
  })), [lines]);

  const handleEnterKeyUp = () => {
    onRunLast?.();
  };

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        handleEnterKeyUp();
      }
    }
    if (onRunLast) {
      document.addEventListener('keyup', onKeyUp);
    }

    return () => {
      if (onRunLast) {
        document.removeEventListener('keyup', onKeyUp);
      }
    }
  }, [])

  return (
    <div className={`relative w-full min-h-[200px] p-3 pl-12 rounded bg-dark-50 dark:bg-dark-800 text-green-400 ${className}`}>
      {cmdLines.map(line => {
        if (line.isError) {
          return (
            <div className="relative flex items-center text-red-400 dark:text-red-600" key={line.row}>
              Error:{' '}{line.args[0].content}
            </div>
          )
        }
        return (
          <div className="relative flex items-center min-h-6" key={line.row}>
            <div className="absolute top-0 -left-9 w-7 h-6 font-sm text-gray-400 dark:text-gray-700 flex items-center justify-end">
              <i className="fas fa-arrow-right text-xs" />
            </div>
            <div className="italic ">{line.cmd}</div>
            {' '}
            {(line.args || []).map(({ paramIndex, ...arg }) => <Arg {...arg} key={paramIndex} />)}
            {line.isLast ? <div className="w-3 h-6 relative after:content-[''] after:absolute after:w-2 after:h-0.5 after:left-1 after:bottom-0 after:bg-white animate-flicker " /> : null}
          </div>
        )
      })}

      {onRunLast ? (
        <div className="absolute bottom-3 left-12 italic text-gray-400 dark:text-gray-600">
          # Press [Enter] to run the last command...
        </div>
      ) : null}
    </div>
  )
}

export default Command

const ArgContent: React.FC<{content?: tCommandArg['content'], className?: string, loading?: boolean, cursor?: boolean }> = ({ content, className, loading, cursor }) => (
  <>
    &nbsp;&nbsp;
    {loading ? <TextLoading /> : <div className={className || ''}>{content}</div>}
  </>
)

const Arg: React.FC<tCommandArg> = ({ type, content }) => {
  if (content === '@') return <ArgContent loading />
  if (type === 'string') return <ArgContent content={content} className='code-str' />
  if (type === 'path') return <ArgContent content={content} className='text-slate-100' />
  if (type === 'operator') return <ArgContent content={content} className='text-purple-400 dark:text-purple-600' />
  return null
}
