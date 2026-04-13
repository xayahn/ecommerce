/**
 * useScrollLock.js
 * Locks body scroll when a modal or drawer is open.
 * Auto-restores on unmount.
 *
 * @param {boolean} isLocked - whether scroll should be locked
 */

import { useEffect } from "react";

const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow  = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Compensate for scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow     = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow     = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};

export default useScrollLock;