"""
Admin Dashboard Blueprint
Provides admin login and dashboard for managing contacts/analytics
"""
import os
from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from datetime import datetime
from db import (
    get_contact_messages,
    mark_message_read,
    get_unread_count,
    get_analytics_summary,
    get_db_stats
)

admin = Blueprint('admin', __name__, url_prefix='/admin')


def login_required(f):
    """Decorator to require admin login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


@admin.route('/login', methods=['GET', 'POST'])
def login():
    """Admin login page"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        admin_user = os.getenv('ADMIN_USERNAME', 'admin')
        admin_pass = os.getenv('ADMIN_PASSWORD')
        
        if username == admin_user and password == admin_pass:
            session['admin_logged_in'] = True
            session['admin_username'] = username
            session['admin_login_time'] = datetime.utcnow().isoformat()
            
            next_url = request.args.get('next')
            return redirect(next_url or url_for('admin.dashboard'))
        else:
            flash('Invalid credentials', 'error')
    
    return render_template('admin/login.html')


@admin.route('/logout')
def logout():
    """Admin logout"""
    session.pop('admin_logged_in', None)
    session.pop('admin_username', None)
    session.pop('admin_login_time', None)
    flash('Logged out successfully', 'success')
    return redirect(url_for('admin.login'))


@admin.route('/')
@admin.route('/dashboard')
@login_required
def dashboard():
    """Admin dashboard"""
    analytics = get_analytics_summary()
    db_stats = get_db_stats()
    unread = get_unread_count()
    
    return render_template('admin/dashboard.html',
        analytics=analytics,
        db_stats=db_stats,
        unread_count=unread
    )


@admin.route('/messages')
@login_required
def messages():
    """View contact messages"""
    page = request.args.get('page', 1, type=int)
    per_page = 20
    skip = (page - 1) * per_page
    unread_only = request.args.get('unread', 'false').lower() == 'true'
    
    messages_list = get_contact_messages(limit=per_page, skip=skip, unread_only=unread_only)
    
    return render_template('admin/messages.html',
        messages=messages_list,
        page=page,
        unread_only=unread_only
    )


@admin.route('/messages/<message_id>/read', methods=['POST'])
@login_required
def mark_read(message_id):
    """Mark message as read"""
    success = mark_message_read(message_id)
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': success})
    
    flash('Message marked as read' if success else 'Failed to mark as read', 
          'success' if success else 'error')
    return redirect(url_for('admin.messages'))


@admin.route('/analytics')
@login_required
def analytics():
    """View detailed analytics"""
    summary = get_analytics_summary()
    return render_template('admin/analytics.html', analytics=summary)
