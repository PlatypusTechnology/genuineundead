import { useEffect, useState } from 'react';

interface UseIsVisibleOptions {
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean; // New option to keep the state after the element becomes visible
}

export const useIsVisible = (ref: React.RefObject<Element>, { rootMargin = '0px', threshold = 0.5, triggerOnce = false }: UseIsVisibleOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Check if the element is in the viewport
          const isElementVisible = entry.isIntersecting;

          // If triggerOnce is true, only set to visible once
          if (isElementVisible) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, rootMargin, threshold, triggerOnce]);

  return isVisible;
};
