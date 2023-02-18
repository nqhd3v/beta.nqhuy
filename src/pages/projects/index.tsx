import { useMessage } from "@/utils/hooks";
import { NextSeo } from "next-seo";

const Projects = () => {
  const { msg } = useMessage();
  return (
    <>
      <NextSeo title="Projects" description="This is projects page for my portfolio beta version" />
      <div>
        This is Projects page
      </div>
    </>
  )
};

export default Projects;