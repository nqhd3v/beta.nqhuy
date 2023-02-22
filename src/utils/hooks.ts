import { AppDispatch, RootState } from '@/stores'
import { useIntl } from 'react-intl'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { NextRouter, useRouter as u } from "next/router"
import { useEffect, useState } from 'react'
import { TW_RESPONSIVE } from './constants'

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

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
export const useIsWidthSM = () => useMediaQuery(TW_RESPONSIVE.sm);
export const useIsWidthMD = () => useMediaQuery(TW_RESPONSIVE.md);
export const useIsWidthLG = () => useMediaQuery(TW_RESPONSIVE.lg);
export const useIsWidthXL = () => useMediaQuery(TW_RESPONSIVE.xl);
export const useIsWidthXXL = () => useMediaQuery(TW_RESPONSIVE.xxl);

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
