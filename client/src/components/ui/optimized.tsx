import { useIsMobile, usePrefersReducedMotion } from '@/hooks/usePerformance';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

/**
 * Fix #1 & #2: Optimized Image Component
 * - Lazy loads images using native loading="lazy"
 * - Shows placeholder until loaded
 * - Supports WebP with fallback
 */
export function OptimizedImage({ src, alt, className = '', width, height }: LazyImageProps) {
    // Convert to WebP if it's a local image
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return (
        <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                width={width}
                height={height}
                className={`lazy-image loaded ${className}`}
                onError={(e) => {
                    // Fallback to original if WebP fails
                    const target = e.target as HTMLImageElement;
                    if (target.src !== src) {
                        target.src = src;
                    }
                }}
            />
        </picture>
    );
}

/**
 * Fix #4 & #5: Optimized Animation Wrapper
 * Reduces animations on mobile and respects prefers-reduced-motion
 */
interface AnimatedProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function OptimizedAnimated({ children, className = '', delay = 0 }: AnimatedProps) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isMobile = useIsMobile();

    // Disable complex animations on mobile or if user prefers reduced motion
    if (prefersReducedMotion || isMobile) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            className={`animate-fade-in will-animate ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/**
 * Fix #9: Optimized Glass Card
 * Reduces backdrop blur on mobile
 */
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    blur?: boolean;
}

export function GlassCard({ children, className = '', blur = true }: GlassCardProps) {
    const isMobile = useIsMobile();

    return (
        <div className={`glass ${blur && !isMobile ? 'glass-blur' : ''} rounded-2xl ${className}`}>
            {children}
        </div>
    );
}
