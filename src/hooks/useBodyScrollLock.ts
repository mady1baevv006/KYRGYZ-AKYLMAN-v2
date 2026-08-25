import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal or dialog is open.
 * Prevents the background page from scrolling behind the open modal.
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    };
  }, [isLocked]);
}
