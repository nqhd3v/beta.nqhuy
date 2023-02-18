import { AppDispatch, RootState } from '@/stores'
import { useIntl } from 'react-intl'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { NextRouter, useRouter as u } from "next/router"

export const useMessage = () => {
  const intl = useIntl()
  return {
    msg: (id: string, values?: Record<string, any>) => intl.formatMessage({ id }, values)
  }
}


type tUseRouter = NextRouter & {
  go: (path: string) => void;
  isCurrent: (path: string) => boolean;
}
export const useRouter = (): tUseRouter => {
  const router = u();
  return {
    ...router,
    go: (path: string) => router.push(path),
    isCurrent: (path: string) => router.asPath === path,
  }
};

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
