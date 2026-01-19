import { motion } from 'framer-motion';
import { Sparkles, Code, Wrench, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const skillCategories = {
    languages: {
        icon: Code,
        label: 'Languages',
        skills: [
            { name: 'Python', level: 90, icon: '🐍' },
            { name: 'Java', level: 85, icon: '☕' },
            { name: 'JavaScript', level: 85, icon: '🟨' },
            { name: 'TypeScript', level: 80, icon: '🔷' },
            { name: 'HTML/CSS', level: 95, icon: '🎨' },
            { name: 'SQL', level: 80, icon: '🗃️' },
        ],
    },
    tools: {
        icon: Wrench,
        label: 'Tools',
        skills: [
            { name: 'VS Code', level: 90, icon: '💻' },
            { name: 'Git/GitHub', level: 90, icon: '🔀' },
            { name: 'Docker', level: 75, icon: '🐳' },
            { name: 'MongoDB', level: 80, icon: '🍃' },
            { name: 'Postman', level: 85, icon: '📮' },
            { name: 'Figma', level: 70, icon: '🎨' },
        ],
    },
    frameworks: {
        icon: Layers,
        label: 'Frameworks',
        skills: [
            { name: 'Flask', level: 85, icon: '🌶️' },
            { name: 'React', level: 80, icon: '⚛️' },
            { name: 'LangChain', level: 75, icon: '🔗' },
            { name: 'TensorFlow', level: 70, icon: '🧠' },
            { name: 'Streamlit', level: 85, icon: '🎈' },
            { name: 'Tailwind', level: 90, icon: '🌊' },
        ],
    },
};

type Category = keyof typeof skillCategories;

export default function Skills() {
    const [activeCategory, setActiveCategory] = useState<Category>('languages');

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
                        Technical Skills
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        My <span className="gradient-text">Tech Stack</span>
                    </h1>
                    <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                        Technologies I work with to bring ideas to life
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-4 mb-12"
                >
                    {(Object.keys(skillCategories) as Category[]).map((cat) => {
                        const { icon: Icon, label } = skillCategories[cat];
                        return (
                            <Button
                                key={cat}
                                variant={activeCategory === cat ? 'default' : 'secondary'}
                                onClick={() => setActiveCategory(cat)}
                                className="gap-2"
                            >
                                <Icon size={18} />
                                {label}
                            </Button>
                        );
                    })}
                </motion.div>

                {/* Skills Grid */}
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skillCategories[activeCategory].skills.map((skill, i) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="group hover:border-[var(--primary)]">
                                    <CardContent className="flex items-center gap-4">
                                        <span className="text-3xl">{skill.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold group-hover:text-[var(--primary)] transition-colors">
                                                    {skill.name}
                                                </span>
                                                <span className="text-sm text-[var(--foreground-muted)]">
                                                    {skill.level}%
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 0.8, delay: i * 0.05 }}
                                                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tech Clouds */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <h2 className="text-2xl font-bold mb-8">Other Technologies</h2>
                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {['NumPy', 'Pandas', 'Scikit-Learn', 'OpenCV', 'FAISS', 'Firebase', 'MySQL',
                            'Redis', 'Vite', 'GSAP', 'Three.js', 'Chart.js', 'Hugging Face', 'OpenAI',
                            'Google Gemini', 'Replicate', 'Vercel', 'Render', 'Railway'].map((tech, i) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.02 }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-sm border transition-colors cursor-default',
                                        i % 3 === 0 ? 'border-[var(--primary)]/30 hover:border-[var(--primary)] text-[var(--primary)]' :
                                            i % 3 === 1 ? 'border-[var(--secondary)]/30 hover:border-[var(--secondary)] text-[var(--secondary)]' :
                                                'border-[var(--accent)]/30 hover:border-[var(--accent)] text-[var(--accent)]'
                                    )}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
