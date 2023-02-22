import { useRouter } from "@/utils/hooks";
import { AnimatePresence, motion as m } from "framer-motion"
import { Heart, Sharing } from "./bar-item";

const RunBar = () => {
  const { route } = useRouter();

  return (
      <AnimatePresence mode="wait">
        {route === "/running" ? (<m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20, transition: { delay: .5, duration: .3 }}}
          exit={{ opacity: 0, y: 20, transition: { duration: .3} }}
          className={
            "fixed top-1/2 left-2 lg:left-5 z-[29] " +
            "flex flex-col p-2 rounded-md bg-light-50/30 dark:bg-dark-600/30 backdrop-blue-md shadow dark:shadow-dark-700 "
          }
        >
          <Heart />
          <Sharing />
        </m.div>) : null}
      </AnimatePresence>
  )
}

export default RunBar