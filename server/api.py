"""
REST API Blueprint
Provides JSON API endpoints for the portfolio
"""
from flask import Blueprint, jsonify, request
from functools import wraps
from datetime import datetime
from db import (
    get_contact_messages,
    get_analytics_summary,
    get_db_stats,
    is_connected as db_connected
)

api = Blueprint('api', __name__, url_prefix='/api')

# Store start time for uptime calculation
START_TIME = datetime.utcnow()


def json_response(data, status=200):
    """Standardized JSON response"""
    return jsonify({
        'success': status < 400,
        'data': data,
        'timestamp': datetime.utcnow().isoformat()
    }), status


def error_response(message, status=400):
    """Standardized error response"""
    return jsonify({
        'success': False,
        'error': message,
        'timestamp': datetime.utcnow().isoformat()
    }), status


# ============== Projects API ==============

PROJECTS = [
    {
        'id': 'fake-news-extension',
        'title': 'Fake News Detection Chrome Extension',
        'description': 'A Chrome extension that analyzes news articles in real-time combining local text analysis with backend verification.',
        'category': ['ai', 'extension'],
        'tech_stack': ['Chrome API', 'Python', 'NLP', 'ML'],
        'github_url': 'https://github.com/shivamsinghtomar78/Fake-news-Detection-chrome-extension',
        'icon': 'fas fa-shield-alt',
    },
    {
        'id': 'movie-matrix',
        'title': 'Movie Matrix 2.0 – Cyberpunk Recommendation System',
        'description': 'Content-based movie recommendation system using NLP, cosine similarity, and Porter stemming with cyberpunk UI.',
        'category': ['ai', 'web'],
        'tech_stack': ['Python', 'Streamlit', 'NLP', 'TMDB API'],
        'github_url': 'https://github.com/shivamsinghtomar78/Movie-Matrix-2.0',
        'icon': 'fas fa-film',
    },
    {
        'id': 'fake-news-web',
        'title': 'Fake News Detection System',
        'description': 'Machine learning-powered web app to detect fake news in real-time using Flask and Scikit-Learn.',
        'category': ['ai', 'web'],
        'tech_stack': ['Flask', 'Scikit-Learn', 'JavaScript', 'HTML/CSS'],
        'github_url': 'https://github.com/shivamsinghtomar78/Fake-news-detection',
        'icon': 'fas fa-search',
    },
    {
        'id': 'chat-pdf',
        'title': 'Chat With PDF - AI-Powered Document Analyzer',
        'description': 'Intelligent PDF analysis and chat system using Google Gemini 1.5 Pro and LangChain with RAG architecture.',
        'category': ['ai', 'web'],
        'tech_stack': ['Python', 'Streamlit', 'LangChain', 'Google Gemini', 'FAISS'],
        'huggingface_url': 'https://huggingface.co/spaces/Shivamsinghtomar78/ChatWithPDF',
        'icon': 'fas fa-file-pdf',
    },
    {
        'id': 'blood-cell',
        'title': 'Blood Cell Detection System',
        'description': 'AI-powered blood cell detection using YOLOv10 for real-time identification of RBCs, WBCs, and Platelets.',
        'category': ['ai', 'web'],
        'tech_stack': ['Python', 'Streamlit', 'YOLOv10', 'OpenCV', 'Plotly'],
        'huggingface_url': 'https://huggingface.co/spaces/Shivamsinghtomar78/Blood-Cell-Detection-System',
        'icon': 'fas fa-microscope',
    },
    {
        'id': 'resume-matcher',
        'title': 'AI Resume-JD Matcher',
        'description': 'AI-powered application for resume-job matching with career guidance and upskilling recommendations.',
        'category': ['ai', 'web'],
        'tech_stack': ['Flask', 'Google Gemini AI', 'FAISS', 'SQLite', 'Chart.js'],
        'github_url': 'https://github.com/shivamsinghtomar78/AI-Resume-JD-Matcher',
        'live_url': 'https://ai-resume-jd-matcher-o84v.onrender.com/',
        'icon': 'fas fa-user-tie',
    },
    {
        'id': 'kanoon',
        'title': 'Kanoon ki Pehchaan - AI Legal Assistant',
        'description': 'Comprehensive legal assistance platform with Firebase auth, MySQL, and Gemini AI for Indian law consultation.',
        'category': ['ai', 'web'],
        'tech_stack': ['Python', 'Streamlit', 'Firebase', 'MySQL', 'LangChain', 'Google Gemini'],
        'github_url': 'https://github.com/shivamsinghtomar78/Kanoon_Ki_Pechaaan',
        'icon': 'fas fa-balance-scale',
    },
    {
        'id': 'storybook',
        'title': 'AI-Generated Storybook Creator',
        'description': 'Flask web app that creates 5-page children\'s storybooks with AI-generated text, illustrations, and narration.',
        'category': ['ai', 'web'],
        'tech_stack': ['Flask', 'OpenRouter API', 'Replicate', 'Text-to-Speech', 'PDF Generation'],
        'github_url': 'https://github.com/shivamsinghtomar78/Story-Book',
        'live_url': 'https://story-book-1hio.onrender.com',
        'icon': 'fas fa-book-open',
    },
]

SKILLS = {
    'languages': [
        {'name': 'Python', 'proficiency': 90, 'icon': 'fab fa-python'},
        {'name': 'Java', 'proficiency': 85, 'icon': 'fab fa-java'},
        {'name': 'JavaScript', 'proficiency': 85, 'icon': 'fab fa-js-square'},
        {'name': 'HTML/CSS', 'proficiency': 95, 'icon': 'fab fa-html5'},
    ],
    'tools': [
        {'name': 'VS Code', 'proficiency': 90, 'icon': 'fas fa-code'},
        {'name': 'PyCharm', 'proficiency': 85, 'icon': 'fas fa-laptop-code'},
        {'name': 'Google Colab', 'proficiency': 80, 'icon': 'fab fa-google'},
        {'name': 'Postman', 'proficiency': 85, 'icon': 'fas fa-tools'},
    ],
    'frameworks': [
        {'name': 'Flask', 'proficiency': 85, 'icon': 'fas fa-flask'},
        {'name': 'NumPy', 'proficiency': 85, 'icon': 'fas fa-chart-line'},
        {'name': 'Pandas', 'proficiency': 80, 'icon': 'fas fa-table'},
        {'name': 'Scikit-Learn', 'proficiency': 85, 'icon': 'fas fa-brain'},
        {'name': 'LangChain', 'proficiency': 75, 'icon': 'fas fa-link'},
    ],
}


@api.route('/projects')
def get_projects():
    """Get all projects"""
    category = request.args.get('category')
    
    if category:
        filtered = [p for p in PROJECTS if category in p['category']]
        return json_response(filtered)
    
    return json_response(PROJECTS)


@api.route('/projects/<project_id>')
def get_project(project_id):
    """Get single project by ID"""
    project = next((p for p in PROJECTS if p['id'] == project_id), None)
    
    if project is None:
        return error_response('Project not found', 404)
    
    return json_response(project)


@api.route('/skills')
def get_skills():
    """Get all skills"""
    category = request.args.get('category')
    
    if category and category in SKILLS:
        return json_response(SKILLS[category])
    
    return json_response(SKILLS)


@api.route('/stats')
def get_stats():
    """Get portfolio statistics"""
    stats = {
        'projects_count': len(PROJECTS),
        'technologies_count': len(set(
            tech for p in PROJECTS for tech in p['tech_stack']
        )),
        'skills_count': sum(len(skills) for skills in SKILLS.values()),
        'categories': {
            'ai': len([p for p in PROJECTS if 'ai' in p['category']]),
            'web': len([p for p in PROJECTS if 'web' in p['category']]),
            'extension': len([p for p in PROJECTS if 'extension' in p['category']]),
        }
    }
    return json_response(stats)


# ============== Health Check ==============

@api.route('/health')
def health_check():
    """Health check endpoint"""
    uptime_seconds = (datetime.utcnow() - START_TIME).total_seconds()
    hours = int(uptime_seconds // 3600)
    minutes = int((uptime_seconds % 3600) // 60)
    
    health = {
        'status': 'healthy',
        'uptime': f'{hours}h {minutes}m',
        'version': '2.0.0',
        'database': {
            'connected': db_connected(),
            'stats': get_db_stats() if db_connected() else None
        },
        'timestamp': datetime.utcnow().isoformat()
    }
    
    return json_response(health)


# ============== Analytics (Protected) ==============

@api.route('/analytics')
def get_analytics():
    """Get analytics data (would need auth in production)"""
    summary = get_analytics_summary()
    return json_response(summary)
