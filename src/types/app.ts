import { AppProps } from "next/app";
import { RefObject } from "react";

export interface iPageProps extends AppProps {
  rootRef: React.RefObject<HTMLDivElement>;
}