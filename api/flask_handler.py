from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("public/" + path):
        return send_from_directory('public', path)
    else:
        return send_from_directory('public', 'index.html')

# Vercel requires this handler
def handler(event, context):
    from flask_handler import app
    return app(event, context)