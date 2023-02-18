import { useRouter } from "@/utils/hooks";
import { AnimatePresence, motion as m } from "framer-motion"
import BarItem, { DarkLight } from "./bar-item";

const MainBar: React.FC = () => {
  const { isCurrent, go, route } = useRouter();
  const hasOthers = ['/docs/[doc]', '/projects/[prj]'].includes(route);

  return (
    <AnimatePresence mode="wait">
      <m.div
        initial={{ opacity: 0, y: 76 }}
        animate={hasOthers ? { y: -10, opacity: 1, transition: { duration: .5 }} : { y: 76, opacity: 1, transition: { duration: .5, delay: .5 }}}
        exit={{ opacity: 0, y: 76 }}
        className={
          "fixed left-2 lg:left-5 bottom-1/2 z-30 " +
          "flex flex-col p-2 rounded-md bg-light-50/30 dark:bg-dark-600/30 backdrop-blue-md shadow dark:shadow-dark-700 last:mb-0 "
        }
      >
        <BarItem
          icon="fas fa-user"
          active={isCurrent("/")}
          onClick={() => go('/')}
        />
        <BarItem
          icon="fas fa-folder"
          active={isCurrent("/projects")}
          onClick={() => go('/projects')}
        />
        <BarItem
          icon="fas fa-pencil"
          active={isCurrent("/docs")}
          onClick={() => go('/docs')}
        />
        <DarkLight />
      </m.div>
    </AnimatePresence>
  )
};

export default MainBar;