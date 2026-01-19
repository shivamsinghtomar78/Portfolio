import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Fix #2: Lazy Load Images Hook
 * Loads images only when they become visible in the viewport
 */
export function useLazyImage(src: string) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setImageSrc(src);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [src]);

    const handleLoad = () => setIsLoaded(true);

    return { imgRef, imageSrc, isLoaded, handleLoad };
}

/**
 * Fix #3 & #10: Debounced Scroll Handler with RAF
 * Uses requestAnimationFrame for smooth scroll handling
 */
export function useOptimizedScroll(callback: () => void, delay = 100) {
    const rafId = useRef<number>();
    const timeoutId = useRef<NodeJS.Timeout>();
    const lastCall = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();

            // Debounce check
            if (now - lastCall.current < delay) {
                if (timeoutId.current) clearTimeout(timeoutId.current);
                timeoutId.current = setTimeout(handleScroll, delay);
                return;
            }

            lastCall.current = now;

            // Use RAF for smooth updates (Fix #10)
            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(callback);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId.current) cancelAnimationFrame(rafId.current);
            if (timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, [callback, delay]);
}

/**
 * Fix #6: Detect Mobile Device
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(
                window.innerWidth < 768 ||
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0
            );
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

/**
 * Fix #4: Reduced Motion Preference
 */
export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}

/**
 * Fix #5: IntersectionObserver for triggering animations
 * More efficient than scroll-based animation triggers
 */
export function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
}
