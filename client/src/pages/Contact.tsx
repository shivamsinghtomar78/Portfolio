import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Sparkles, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8b5cf6', '#06b6d4', '#f472b6']
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || '';
            const response = await fetch(`${apiBase}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });

            const result = await response.json();
            if (result.success) {
                setStatus('success');
                triggerConfetti(); // WOW #4 & #10: Success feedback
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-sm text-[var(--primary)] mb-6">
                        <Sparkles size={16} />
                        Let's Connect
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Get in <span className="gradient-text shimmer-text">Touch</span>
                    </h1>
                    <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                        Have a project in mind? Let's discuss how we can work together.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        <Card glow>
                            <CardContent className="space-y-6">
                                <h2 className="text-2xl font-bold">Let's Connect</h2>
                                <p className="text-[var(--foreground-muted)]">
                                    Ready to bring your ideas to life? I'm always open to discussing new projects,
                                    creative ideas, or opportunities.
                                </p>

                                <div className="space-y-4">
                                    {contactInfo.map((item) => (
                                        <div key={item.label} className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                                                <item.icon size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-[var(--foreground-muted)]">{item.label}</p>
                                                {item.href ? (
                                                    <a href={item.href} className="font-medium hover:text-[var(--primary)] transition-colors">
                                                        {item.value}
                                                    </a>
                                                ) : (
                                                    <p className="font-medium">{item.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
                                    {/* WOW #9: Animated Social Icons */}
                                    <motion.a
                                        href="https://github.com/shivamsinghtomar78"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                                    >
                                        <Github size={18} />
                                        <span>GitHub</span>
                                    </motion.a>
                                    <motion.a
                                        href="https://www.linkedin.com/in/shivam-singh-81b160280"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                                    >
                                        <Linkedin size={18} />
                                        <span>LinkedIn</span>
                                    </motion.a>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card glow>
                            <CardContent>
                                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">Email</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">Subject</label>
                                        <Input
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="What's this about?"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">Message</label>
                                        {/* WOW #4: Input micro-interactions via focus styles in index.css */}
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Your message..."
                                            rows={5}
                                            required
                                            className={cn(
                                                'flex w-full rounded-xl bg-[var(--card)] px-4 py-3 text-sm',
                                                'border border-[var(--border)] transition-all duration-300',
                                                'placeholder:text-[var(--foreground-subtle)]',
                                                'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)]',
                                                'resize-none'
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full neon-border group"
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? (
                                            'Sending...'
                                        ) : status === 'success' ? (
                                            '✓ Message Sent!'
                                        ) : (
                                            <>
                                                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>

                                    {status === 'error' && (
                                        <motion.p
                                            initial={{ x: -10 }}
                                            animate={{ x: [0, -10, 10, -10, 10, 0] }}
                                            className="text-center text-sm text-red-400"
                                        >
                                            Failed to send. Please try again.
                                        </motion.p>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

const contactInfo = [
    { icon: Mail, label: 'Email', value: 'ss93134041@gmail.com', href: 'mailto:ss93134041@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 7838984624', href: 'tel:+917838984624' },
    { icon: MapPin, label: 'Location', value: 'New Delhi, India', href: null },
];
