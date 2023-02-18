interface iSubPageHeader {
  title: string;
  description: string;
}
const SubPageHeader: React.FC<iSubPageHeader> = ({ title, description }) => {
  return (
    <div className="page-content-width h-[300px] flex items-center justify-between m-auto">
      <div>
        <div className="font-sm code-comment !text-gray-500 !dark:text-light-800 ">
          {description}
        </div>
        <div className="text-5xl font-bold text-dark-500 dark:text-light-50">
          {title}
        </div>
      </div>
    </div>
  )
};

export default SubPageHeader;