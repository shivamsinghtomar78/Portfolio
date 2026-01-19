/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090b',
                'background-secondary': '#0f0f12',
                card: '#18181b',
                'card-hover': '#1f1f23',
                foreground: '#fafafa',
                'foreground-muted': '#a1a1aa',
                'foreground-subtle': '#71717a',
                primary: '#8b5cf6',
                'primary-hover': '#a78bfa',
                secondary: '#06b6d4',
                'secondary-hover': '#22d3ee',
                accent: '#f472b6',
                'accent-hover': '#f9a8d4',
                border: 'rgba(255, 255, 255, 0.1)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.4)' },
                },
            },
        },
    },
    plugins: [],
}
