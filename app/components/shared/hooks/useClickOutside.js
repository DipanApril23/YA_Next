"use client";

import { useEffect, useRef } from "react";

export const useClickOutside = (callbackFn, excludeRef) => {
  const domNodeRef = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (
        !domNodeRef.current?.contains(event.target) &&
        !excludeRef?.current?.contains(event.target)
      ) {
        callbackFn();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callbackFn, excludeRef]);

  return domNodeRef;
};
