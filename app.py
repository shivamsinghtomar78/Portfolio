from flask import Flask, render_template, send_from_directory, request, jsonify, flash
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'your-secret-key-here'  # Change this to a secure secret key

# Route for the main page
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle contact form submission
@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        # For now, just log the message (you can implement email sending later)
        contact_data = {
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Log to console (in production, save to database or send email)
        print("New Contact Form Submission:")
        print(f"Name: {name}")
        print(f"Email: {email}")
        print(f"Subject: {subject}")
        print(f"Message: {message}")
        print(f"Time: {contact_data['timestamp']}")
        print("-" * 50)
        
        # You can also save to a file
        with open('contact_messages.txt', 'a', encoding='utf-8') as f:
            f.write(f"\n--- New Message ({contact_data['timestamp']}) ---\n")
            f.write(f"Name: {name}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Subject: {subject}\n")
            f.write(f"Message: {message}\n")
            f.write("-" * 50 + "\n")
        
        return jsonify({'success': True, 'message': 'Message sent successfully!'})
        
    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500

# Optional: Email sending function (uncomment and configure if you want to send emails)
def send_email(name, email, subject, message):
    """
    Configure this function with your email settings to actually send emails
    """
    try:
        # Email configuration (update with your settings)
        SMTP_SERVER = "smtp.gmail.com"  # or your email provider's SMTP server
        SMTP_PORT = 587
        EMAIL_ADDRESS = "your-email@gmail.com"  # Your email
        EMAIL_PASSWORD = "your-app-password"  # Your email app password
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = EMAIL_ADDRESS  # Send to yourself
        msg['Subject'] = f"Portfolio Contact: {subject}"
        
        body = f"""
        New message from your portfolio website:
        
        Name: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_ADDRESS, EMAIL_ADDRESS, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return False

# Route to serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)