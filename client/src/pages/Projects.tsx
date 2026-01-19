import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Star, GitFork, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const projects = [
    {
        id: 'fake-news-extension',
        title: 'Fake News Chrome Extension',
        description: 'Analyzes news in real-time to identify sensationalism, lack of citations, and verify publishing dates.',
        category: ['ai', 'extension'],
        tech: ['JS', 'HTML', 'CSS', 'Python'],
        github: 'https://github.com/shivamsinghtomar78/Fake-news-Detection-chrome-extension',
        icon: '🛡️',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        id: 'movie-matrix',
        title: 'Movie Matrix 2.0',
        description: 'Cyberpunk recommendation system using NLP, cosine similarity, and Porter stemming on 5000+ movies.',
        category: ['ai', 'web'],
        tech: ['Python', 'Streamlit', 'TMDB API', 'NLP'],
        github: 'https://github.com/shivamsinghtomar78/Movie-Matrix-2.0',
        icon: '🎬',
        gradient: 'from-cyan-500 to-blue-600',
    },
    {
        id: 'chat-pdf',
        title: 'Chat With PDF',
        description: 'RAG-based analyzer using Gemini 1.5 Pro, FAISS vector database, and LangChain for intelligent document Q&A.',
        category: ['ai', 'web'],
        tech: ['LangChain', 'Gemini', 'FAISS', 'Python'],
        live: 'https://huggingface.co/spaces/Shivamsinghtomar78/ChatWithPDF',
        icon: '📄',
        gradient: 'from-pink-500 to-rose-600',
    },
    {
        id: 'blood-cell',
        title: 'Blood Cell Detection',
        description: 'Medical AI system using YOLOv10 and OpenCV for automated cell identification with bounding boxes and CSV export.',
        category: ['ai', 'web'],
        tech: ['YOLOv10', 'OpenCV', 'Streamlit', 'Plotly'],
        live: 'https://huggingface.co/spaces/Shivamsinghtomar78/Blood-Cell-Detection-System',
        icon: '🔬',
        gradient: 'from-red-500 to-orange-600',
    },
    {
        id: 'placement-prediction',
        title: 'Student Placement Predictor',
        description: 'Predicts student placement likelihood based on CGPA and IQ using Scikit-Learn and normalized input scaling.',
        category: ['ai', 'web'],
        tech: ['Scikit-Learn', 'Python', 'Streamlit', 'Pickle'],
        github: 'https://github.com/shivamsinghtomar78/Student-placement-prediction-',
        icon: '🎓',
        gradient: 'from-blue-400 to-indigo-600',
    },
    {
        id: 'kanoon',
        title: 'Kanoon ki Pehchaan',
        description: 'Legal platform with Indian Kanoon API integration, RAG-based summarization, and lawyer-client connection system.',
        category: ['ai', 'web'],
        tech: ['Firebase', 'MySQL', 'Gemini', 'LangChain'],
        github: 'https://github.com/shivamsinghtomar78/Kanoon_Ki_Pechaaan',
        icon: '⚖️',
        gradient: 'from-amber-500 to-yellow-600',
    },
    {
        id: 'fake-news-web',
        title: 'Fake News Detection System',
        description: 'ML-powered web app using TF-IDF and Logistic Regression for real-time text classification and verification.',
        category: ['ai', 'web'],
        tech: ['Flask', 'Scikit-Learn', 'JS', 'ML'],
        github: 'https://github.com/shivamsinghtomar78/Fake-news-Detection-system',
        icon: '📰',
        gradient: 'from-emerald-400 to-teal-600',
    },
    {
        id: 'storybook',
        title: 'AI Storybook Creator',
        description: 'Generative children\'s storybooks with AI-generated text/illustrations and text-to-speech integration.',
        category: ['ai', 'web'],
        tech: ['Flask', 'OpenRouter', 'Replicate', 'TTS'],
        github: 'https://github.com/shivamsinghtomar78/Story-Book',
        live: 'https://story-book-1hio.onrender.com',
        icon: '📚',
        gradient: 'from-indigo-500 to-violet-600',
    },
];

const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'web', label: 'Web Apps' },
    { id: 'extension', label: 'Extensions' },
];

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(p => p.category.includes(activeCategory));

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
                        Featured Work
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        My <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                        AI-powered applications that solve real-world problems
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={activeCategory === cat.id ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.label}
                        </Button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card glow className="h-full flex flex-col group">
                                {/* Icon Header */}
                                <div className={cn(
                                    'h-32 rounded-t-2xl flex items-center justify-center text-5xl bg-gradient-to-br',
                                    project.gradient
                                )}>
                                    {project.icon}
                                </div>

                                <CardHeader>
                                    <CardTitle className="group-hover:text-[var(--primary)] transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col">
                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 text-xs rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--foreground-muted)]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-3 mt-auto">
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                                            >
                                                <Github size={16} />
                                                Code
                                            </a>
                                        )}
                                        {project.live && (
                                            <a
                                                href={project.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                                            >
                                                <ExternalLink size={16} />
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}
