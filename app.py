from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os
import re
from datetime import datetime

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'fallback-secret-key')

# Mail configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_TIMEOUT'] = 10

mail = Mail(app)

# Route for the main page
@app.route('/')
def home():
    return render_template('index.html')

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get and sanitize form data
        name = request.form.get('name', '').strip()[:100]
        email = request.form.get('email', '').strip()[:254]
        subject = request.form.get('subject', '').strip()[:200]
        message = request.form.get('message', '').strip()[:2000]
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Send email with timeout
        try:
            msg = Message(
                subject=f'Portfolio Contact: {subject}',
                recipients=[os.getenv('MAIL_DEFAULT_SENDER')],
                reply_to=email
            )
            msg.body = f"""New message from your portfolio:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"""
            
            # Set shorter timeout for production
            import signal
            def timeout_handler(signum, frame):
                raise TimeoutError("Email sending timeout")
            
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(10)  # 10 second timeout
            
            mail.send(msg)
            signal.alarm(0)  # Cancel timeout
            
        except TimeoutError:
            # Log message locally if email fails
            with open('/tmp/contact_messages.txt', 'a') as f:
                f.write(f"\n{datetime.now()}: {name} ({email}) - {subject}\n{message}\n---\n")
            # Still return success to user
            pass
        return jsonify({'success': True, 'message': 'Message sent successfully!'})
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to send message. Please try again.'}), 500



# Route to serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')