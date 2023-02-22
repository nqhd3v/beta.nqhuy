import { TW_BOX_SHADOW } from "@/utils/constants";
import { AnimatePresence, motion as m } from "framer-motion"
import { useRouter } from "next/router";
import ElementWrapper from "../element-wrapper";

interface iDocCard {
  title: string;
  description: string;
  href: string;
}
const DocCard: React.FC<iDocCard> = ({ title, description, href }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        className={
          "w-full border border-gray-300 dark:border-gray-800 relative p-5 cursor-pointer backdrop-blur-sm "
        }
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: .3 }}}
        whileHover={{ y: -10, boxShadow: TW_BOX_SHADOW.lg, transition: { duration: .3 }}}
        exit={{ y: 20, opacity: 0 }}
        onClick={() => router.push(href)}
      >
        <div className="font-bold uppercase text-dark-500 dark:text-light-50 text-2xl text-ellipsis overflow-hidden whitespace-nowrap">{title}</div>
        <ElementWrapper content={description} element="p" className="text-gray-400 dark:text-gray-600" />
      </m.div>
    </AnimatePresence>
  )
};

export default DocCard;
