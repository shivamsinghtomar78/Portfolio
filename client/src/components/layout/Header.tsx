import { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOptimizedScroll, useIsMobile, usePrefersReducedMotion } from '@/hooks/usePerformance';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Contact', path: '/contact' },
];

// Memoized nav link to prevent unnecessary re-renders
const NavLink = memo(({ link, isActive }: { link: typeof navLinks[0]; isActive: boolean }) => (
    <Link to={link.path}>
        <div
            className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors will-animate',
                isActive
                    ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
            )}
        >
            {link.name}
        </div>
    </Link>
));

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isMobile = useIsMobile();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Fix #3 & #10: Optimized scroll handler with debounce and RAF
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 50);
    }, []);

    useOptimizedScroll(handleScroll, 150); // Increased debounce time

    // Close mobile menu on route change
    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    // Simplified animations for reduced motion
    const headerAnimation = prefersReducedMotion
        ? {}
        : {
            initial: { y: -100 },
            animate: { y: 0 },
            transition: { duration: 0.5, ease: 'easeOut' },
        };

    return (
        <>
            <motion.header
                {...headerAnimation}
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-animate',
                    isScrolled
                        ? 'glass glass-blur border-b border-[var(--border)]'
                        : 'bg-transparent'
                )}
            >
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black gradient-text">SS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                link={link}
                                isActive={location.pathname === link.path}
                            />
                        ))}
                    </div>

                    {/* Desktop Social + CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="https://github.com/shivamsinghtomar78"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/shivam-singh-81b160280"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
                        >
                            <Linkedin size={20} />
                        </a>
                        <Link to="/contact">
                            <Button size="sm">Get in Touch</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </motion.header>

            {/* Mobile Menu - Simplified animation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-16 z-40 p-4 md:hidden"
                    >
                        <div className="glass rounded-2xl border border-[var(--border)] p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} onClick={closeMobileMenu}>
                                    <div
                                        className={cn(
                                            'px-4 py-3 rounded-xl text-center font-medium transition-colors',
                                            location.pathname === link.path
                                                ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                                                : 'text-[var(--foreground-muted)]'
                                        )}
                                    >
                                        {link.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
