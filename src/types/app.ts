import React from 'react'
import { AppProps } from 'next/app'

export interface iPageProps extends AppProps {
  rootRef: React.RefObject<HTMLDivElement>;
}
