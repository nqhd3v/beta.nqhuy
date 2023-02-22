import SubPageHeader from "@/components/sub-page-header";
import { NextSeo } from "next-seo";

const RunningPage = () => {
  return (
    <>
      <NextSeo title="Running" description="This is a private page for myself to track my practice activities for some races in the future!" />
      <SubPageHeader title={""} path={["node", "running.js"]} />
    </>
  )
};

export default RunningPage;
