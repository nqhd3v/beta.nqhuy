const TextLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={"w-12 h-6 rounded-sm bg-gray-400/30 dark:bg-gray-600/30 animate-pulse " + (className || '')}></div>
);

export default TextLoading;