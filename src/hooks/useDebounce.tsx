import { useCallback, useRef } from 'react';
import { debounce, DebouncedFunc } from 'lodash';

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): DebouncedFunc<T> => {
  const debouncedRef = useRef<DebouncedFunc<T>>();

  if (!debouncedRef.current) {
    debouncedRef.current = debounce(callback, delay);
  }

  const updateDebounce = useCallback(() => {
    if (debouncedRef.current) {
      debouncedRef.current.cancel();
    }
    debouncedRef.current = debounce(callback, delay);
  }, [callback, delay]);

  if (!debouncedRef.current) {
    debouncedRef.current = debounce(callback, delay);
  }

  return debouncedRef.current;
};