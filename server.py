"""
    Made by Monnapse

    TODO Change to SQL instead of json for accounts, etc.
"""

import web
from flask import Flask,session
from flask_session import Session
from datetime import timedelta
    
session_hours = 2

# Define the flask app
app = Flask(__name__)
#app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['PERMANENT_SESSION_LIFETIME'] =  timedelta(hours=session_hours)
Session(app)

web_controller = web.define(app)

if __name__ == '__main__':
    # Now make the web directories
    # and run the flask app
    web_controller.run_directories()
    app.run(debug=True, port="6969")