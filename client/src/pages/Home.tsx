import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Code, Brain, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroCanvas } from '@/components/3d/HeroCanvas';

const stats = [
    { number: '8+', label: 'Projects', icon: Code },
    { number: '8+', label: 'Technologies', icon: Brain },
    { number: '50+', label: 'Commits', icon: Rocket },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export default function Home() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <HeroCanvas />

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-6 relative z-10"
            >
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-sm text-[var(--primary)]">
                            <Sparkles size={16} />
                            Available for opportunities
                        </span>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-black mb-4 tracking-tight"
                    >
                        <span className="text-[var(--foreground)]">Hi, I'm </span>
                        {/* WOW #7: Shimmer Text */}
                        <span className="gradient-text-glow shimmer-text">Shivam</span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-[var(--foreground-muted)] mb-4"
                    >
                        AI Developer & Computer Science Student
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg text-[var(--foreground-subtle)] max-w-2xl mx-auto mb-8"
                    >
                        Building innovative AI-powered solutions that bridge technology with real-world problems.
                        Specializing in Machine Learning, NLP, and Full-Stack Development.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                    >
                        <Link to="/projects">
                            {/* WOW #3: Neon Glow Pulse */}
                            <Button size="lg" className="neon-border neon-glow-pulse group">
                                View Projects
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="secondary" size="lg">
                                Get in Touch
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--glass)] backdrop-blur-sm border border-[var(--border)]"
                            >
                                <stat.icon size={24} className="text-[var(--primary)]" />
                                <div className="text-left">
                                    <div className="text-2xl font-bold gradient-text">{stat.number}</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 text-[var(--foreground-subtle)]"
                >
                    <span className="text-sm">Scroll to explore</span>
                    <div className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}
