import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link to="/" className="text-2xl font-black gradient-text">
                            SS
                        </Link>
                        <p className="text-sm text-[var(--foreground-muted)] flex items-center gap-1">
                            Made with <Heart size={14} className="text-[var(--accent)] fill-current" /> by Shivam Singh
                        </p>
                        <p className="text-sm text-[var(--foreground-subtle)]">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                        <motion.a
                            href="https://github.com/shivamsinghtomar78"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                        >
                            <Github size={20} />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/in/shivam-singh-81b160280"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                        >
                            <Linkedin size={20} />
                        </motion.a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
