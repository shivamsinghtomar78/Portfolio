import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Briefcase, Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const timeline = [
    {
        type: 'experience',
        title: 'Software Engineer Intern',
        organization: 'Microsoft & SAP | TechSaksham',
        date: 'Feb 2025 - Mar 2025',
        location: 'Delhi, India',
        description: 'Developed an AI-based project prototype under Microsoft & SAP-AICTE mentorship. Presented to industry experts at a regional showcase.',
        icon: Briefcase,
    },
    {
        type: 'experience',
        title: 'Aspire Leaders Program 2025',
        organization: 'Aspire Institute',
        date: 'Jan 2025 - Present',
        location: 'Delhi, India',
        description: 'Selected for a prestigious global leadership program. Developed leadership skills through structured workshops and peer collaboration.',
        icon: Briefcase,
    },
    {
        type: 'experience',
        title: 'Microsoft Learn Student Ambassador',
        organization: 'Microsoft',
        date: 'Dec 2024 - Present',
        location: 'Remote',
        description: 'Organizing tech events, workshops, and community building activities as an MLSA.',
        icon: Briefcase,
    },
    {
        type: 'education',
        title: 'B.Tech in CS with Artificial Intelligence',
        organization: 'Maharaja Agrasen Institute of Technology',
        date: 'Sep 2023 - May 2027',
        location: 'New Delhi, India',
        description: 'Specializing in AI with advanced coursework in Data Structures, DBMS, and Machine Learning.',
        icon: GraduationCap,
    },
];

const achievements = [
    { title: 'Finalist – HackTU 6.0', desc: 'Developed real-time fake news detection extension', year: '2025' },
    { title: 'Open Source Contributor', desc: 'GirlScript Summer of Code', year: '2024' },
    { title: 'Certification: Microsoft & SAP', desc: 'AI: Transformative Learning', year: '2025' },
];

export default function About() {
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
                        About Me
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Know <span className="gradient-text">Me Better</span>
                    </h1>
                </motion.div>

                {/* Intro Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <Card glow>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                {/* Profile Image */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-1"
                                >
                                    <div className="w-full h-full rounded-xl bg-[var(--card)] flex items-center justify-center text-6xl">
                                        👨‍💻
                                    </div>
                                </motion.div>

                                {/* Bio */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold mb-2">Hi, I'm Shivam Singh</h2>
                                    <p className="text-[var(--primary)] font-medium mb-4">AI Developer & B.Tech CS (AI) Student</p>
                                    <p className="text-[var(--foreground-muted)] mb-6">
                                        I'm a dedicated developer specializing in Artificial Intelligence and Machine Learning.
                                        Currently pursuing my B.Tech at MAIT, I focus on building intelligent solutions
                                        ranging from legal assistants to medical diagnostics using YOLOv10 and Google Gemini.
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <a href="/resume.pdf" download="Shivam_Singh_Resume.pdf">
                                            <Button size="sm">
                                                <Download size={16} />
                                                Download Resume
                                            </Button>
                                        </a>
                                        <Link to="/projects">
                                            <Button variant="secondary" size="sm">
                                                View Projects
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-4xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold text-center mb-12"
                    >
                        Education & <span className="gradient-text">Experience</span>
                    </motion.h2>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]" />

                        {timeline.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                {/* Icon */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--background)]" />

                                {/* Content */}
                                <div className={`flex-1 ml-16 md:ml-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <Card>
                                        <CardContent>
                                            <div className={`flex items-center gap-3 mb-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                                                <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                                                    <item.icon size={18} className="text-[var(--primary)]" />
                                                </div>
                                                <span className="text-sm text-[var(--primary)]">{item.date}</span>
                                            </div>
                                            <h3 className="font-bold mb-1">{item.title}</h3>
                                            <p className="text-sm text-[var(--secondary)] mb-2">{item.organization} • {item.location}</p>
                                            <p className="text-sm text-[var(--foreground-muted)]">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold text-center mb-12"
                    >
                        <Award className="inline mr-2 text-[var(--accent)]" />
                        Achievements
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {achievements.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card glow className="text-center">
                                    <CardContent>
                                        <span className="inline-block px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs mb-3">
                                            {item.year}
                                        </span>
                                        <h3 className="font-bold mb-1">{item.title}</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
