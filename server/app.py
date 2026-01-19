"""
Portfolio Backend - Flask Application
Features: MongoDB, Rate Limiting, CSRF Protection, Admin Dashboard, Caching, Logging
Refactored to serve React SPA from static/react
"""
import os
import re
import logging
import threading
from datetime import datetime
from functools import wraps

from flask import Flask, render_template, send_from_directory, request, jsonify, make_response
from flask_cors import CORS
from flask_mail import Mail, Message as MailMessage
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from flask_caching import Cache
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============== Environment Validation ==============

def validate_environment():
    """Validate required environment variables at startup"""
    required_vars = ['FLASK_SECRET_KEY']
    optional_vars = ['MONGODB_URI', 'MAIL_SERVER', 'ADMIN_PASSWORD']
    
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        print(f"ERROR: Missing required environment variables: {', '.join(missing)}")
    
    warnings = [var for var in optional_vars if not os.getenv(var)]
    if warnings:
        print(f"WARNING: Optional env vars not set: {', '.join(warnings)}")

validate_environment()

# ============== App Configuration ==============

# Update static_folder to the React build directory
# We set static_url_path to '/static' to avoid conflicts with SPA routing
app = Flask(__name__, 
            static_folder=os.path.join(os.path.dirname(__file__), 'static', 'react'), 
            template_folder='templates')

# Allow CORS for development and production (Vercel)
CORS(app, resources={r"/*": {"origins": "*"}}) 

app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-fallback-secret-key')

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_TIMEOUT'] = 10

# Caching Configuration
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300

# ============== Initialize Extensions ==============

mail = Mail(app)
csrf = CSRFProtect(app)
cache = Cache(app)

# Rate Limiting
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=os.getenv('RATELIMIT_STORAGE_URL', 'memory://')
)

# ============== Logging Setup ==============

def setup_logging():
    """Configure structured logging"""
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format))
    
    if not app.debug:
        log_dir = os.path.join(os.path.dirname(__file__), 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        file_handler = logging.handlers.RotatingFileHandler(
            os.path.join(log_dir, 'portfolio.log'),
            maxBytes=10_000_000,
            backupCount=5
        )
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(logging.Formatter(log_format))
        app.logger.addHandler(file_handler)
    
    app.logger.addHandler(console_handler)
    app.logger.setLevel(logging.INFO)

import logging.handlers
setup_logging()

# ============== Import Blueprints ==============

from api import api
from admin import admin
from db import save_contact_message, log_page_view, is_connected as db_connected

# Register Blueprints
app.register_blueprint(api)
app.register_blueprint(admin)

# Exempt API from CSRF
csrf.exempt(api)

# ============== Request Hooks ==============

@app.before_request
def log_request():
    """Log incoming requests"""
    if not request.path.startswith(('/assets', '/favicon.ico', '/vite.svg')):
        app.logger.info(f"{request.method} {request.path} - {request.remote_addr}")

@app.after_request
def log_page_view_analytics(response):
    """Log page views for analytics"""
    if (response.status_code == 200 and 
        request.method == 'GET' and 
        not request.path.startswith(('/assets', '/api', '/admin', '/favicon.ico', '/vite.svg'))):
        
        # Capture request data synchronously (before losing context)
        page_data = {
            'page': request.endpoint or 'spa_route',
            'path': request.path,
            'referrer': request.referrer,
            'user_agent': request.user_agent.string,
            'ip_address': request.remote_addr
        }
        
        def log_async(data):
            try:
                log_page_view(data)
            except Exception as e:
                app.logger.error(f"Failed to log page view: {e}")
        
        thread = threading.Thread(target=log_async, args=(page_data,))
        thread.start()
    
    return response

# ============== Static Files & SPA Support ==============

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Explicitly serve assets from the React build directory"""
    return send_from_directory(os.path.join(app.static_folder, 'assets'), filename)

@app.route('/vite.svg')
def serve_vite_svg():
    return send_from_directory(app.static_folder, 'vite.svg')

@app.route('/favicon.ico')
def serve_favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    """Serve the React SPA. Catch-all handles client-side routing."""
    
    # Check if the requested path starts with protected prefixes
    if path.startswith(('api', 'admin')):
        # This shouldn't be reached if blueprints match, but just in case
        return make_response(jsonify({'error': 'Not found'}), 404)

    # For everything else, serve index.html
    # This allows React Router to handle the URL on the client side
    return send_from_directory(app.static_folder, 'index.html')

# ============== Contact Form Handler ==============

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@app.route('/contact', methods=['POST'])
@csrf.exempt
@limiter.limit("5 per minute")
def contact():
    """Handle contact form submissions"""
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        name = data.get('name', '').strip()[:100]
        email = data.get('email', '').strip()[:254]
        subject = data.get('subject', '').strip()[:200]
        message = data.get('message', '').strip()[:2000]
        
        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        contact_data = {
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'ip_address': request.remote_addr,
            'user_agent': request.user_agent.string
        }
        
        # Database save (non-blocking failure)
        try:
            save_contact_message(contact_data)
        except Exception as db_err:
            app.logger.warning(f"Failed to save contact to DB: {db_err}")
        
        def send_email_async(app):
            with app.app_context():
                # Pre-flight check for mail configuration
                mail_server = os.getenv('MAIL_SERVER')
                mail_username = os.getenv('MAIL_USERNAME')
                mail_password = os.getenv('MAIL_PASSWORD')
                mail_sender = os.getenv('MAIL_DEFAULT_SENDER')
                
                if not all([mail_server, mail_username, mail_password, mail_sender]):
                    app.logger.warning(f"Email skipped: Missing mail config (server={bool(mail_server)}, user={bool(mail_username)}, pass={bool(mail_password)}, sender={bool(mail_sender)})")
                    return
                
                try:
                    # Notification to owner
                    msg = MailMessage(
                        subject=f'Portfolio Contact: {subject}',
                        recipients=[mail_sender],
                        reply_to=email
                    )
                    msg.body = f"From: {name} ({email})\nSubject: {subject}\n\n{message}"
                    mail.send(msg)
                    app.logger.info(f"Email sent to owner from {email}")
                    
                    # Auto-reply to visitor
                    ar = MailMessage(
                        subject='Thanks for reaching out! - Shivam Singh',
                        recipients=[email]
                    )
                    ar.body = f"Hi {name},\n\nThanks for your message regarding '{subject}'. I'll get back to you soon!\n\nBest,\nShivam"
                    mail.send(ar)
                    app.logger.info(f"Auto-reply sent to {email}")
                except Exception as e:
                    app.logger.error(f"Email send failed: {type(e).__name__}: {e}")
        
        threading.Thread(target=send_email_async, args=(app,)).start()
        
        return jsonify({'success': True, 'message': 'Message sent successfully!'})
        
    except Exception as e:
        app.logger.error(f"Contact error: {e}")
        return jsonify({'success': False, 'message': 'Internal error'}), 500

# ============== Error Handlers ==============

@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({'success': False, 'error': 'Rate limit exceeded'}), 429

# ============== Main ==============

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"\n{'='*50}")
    print(f"  Portfolio Server Starting (SPA MODE)")
    print(f"  Port: {port}")
    print(f"  Database: {'Connected' if db_connected() else 'Offline'}")
    print(f"{'='*50}\n")
    
    app.run(host='0.0.0.0', port=port, debug=debug)