"""
    Made by Monnapse

    LOGIN is for entering the Master Password
    SIGNIN is for entering account info
"""

from flask import Flask, render_template, request, session, redirect, send_file
from flask_session import Session
from lib import two_factor_auth as twofa
from lib import account
import pyotp 

account_signin_directory = "/signin"
account_signup_directory = "/signup"
cloud_login = "/login"

def run(app: Flask):
    """------------------ ROUTES ------------------"""
    @app.flask.route("/logout")
    def logout():
        session.clear()
        #session["MasterPassword"] = ""
        #session["Username"] = ""
        #session["2FA"] = False
        #session["2fa"] = ""
        return redirect(cloud_login)
    @app.flask.route(cloud_login)
    def login():
        # Check if user is already logged in
        try:
            signed_in = session["2FA"]
            if signed_in:
                return redirect("/")
        except Exception:
            logged_in = check_logged_in()
            if logged_in:
                return redirect(account_signin_directory)
            else:
                # Renders the login page
                return render_template(
                    app.template,
                    template=app.authentication_template,
                    pagename = "Hubers Cloud | Login Page",
                    stylesheet="/static/css/authentication_pages.css",
                    content = "login.html"
                )
    
    @app.flask.route(account_signin_directory)
    def signin():
        # Check if user is already logged in
        try:
            signed_in = session["2FA"]
            if signed_in:
                return redirect("/")
        except Exception:

            logged_in = check_logged_in()
            if not logged_in:
                return redirect(cloud_login)
            else:
                # Renders the login page
                return render_template(
                    app.template,
                    template=app.authentication_template,
                    pagename = "Hubers Cloud | Sign In Page",
                    stylesheet="/static/css/authentication_pages.css",
                    content = "signin.html"
                )
        
    @app.flask.route(account_signup_directory)
    def signup():
        # Check if user is already logged in
        try:
            signed_in = session["2FA"]
            if signed_in:
                return redirect("/")
        except Exception:
            logged_in = check_logged_in()
            if not logged_in:
                return redirect(cloud_login)
            else:
                # Renders the login page
                key, uri = get_session_twofa()
                return render_template(
                    app.template,
                    template=app.authentication_template,
                    pagename = "Hubers Cloud | Sign Up Page",
                    stylesheet="/static/css/authentication_pages.css",
                    content = "signup.html",
                    twofa_key = key,
                    twofa_uri = uri,
                    twofa_displayer = "https://chart.apis.google.com/chart?cht=qr&chs=177x177&chl="
                )
        
    @app.flask.route("/form_login", methods=['POST']) 
    def form_login():


        data = request.headers
        account = login(data["Password"])
        if account:
            print("Correct Password")
            session["MasterPassword"] = data["Password"]
            return {
                "response": "Correct Password",
                "status": 200
            }, 200
        else:
            print("Wrong Password")
            return {
                "response": "Incorrect Password",
                "status": 401
            }, 401
        
    @app.flask.route("/form_signin", methods=['POST']) 
    def form_signin():
        headers = request.headers
        #print(headers)
        info, id = account.get_account(headers["Username"])

        if info:
            key, uri = twofa.get_key_uri(info["2fa"]) # Grab the 2fa info from account 2fa secret
            auth = twofa.check_code(key, headers["Twofa"]) # check if the clients 2fa code is valid
            if auth:
                session["Username"] = headers["Username"] # Apply Username to users session
                session["2FA"] = True
                return {
                    "response": "Succesfully signed in",
                    "status": 200
                }, 200
            else:
                return {
                    "response": "Incorect 2FA Code",
                    "status": 401
                }, 401
        else:
            print("Account does not exist")
            return {
                "response": "Account does not exist",
                "status": 401
            }, 401
        
    @app.flask.route("/form_signup", methods=['POST']) 
    def form_signup():

        headers = request.headers
        #print(headers)
        exists = account.exists(headers["Username"])

        if not exists:
            key, uri = get_session_twofa() # Grab the 2fa info
            auth = twofa.check_code(key, headers["Twofa"]) # check if the clients 2fa code is valid
            if auth:
                session["Username"] = headers["Username"] # Apply Username to users session
                session["2FA"] = True
                account.create_new_user(headers["Username"], key)
                return {
                    "response": "Succesfully signed up",
                    "status": 200
                }, 200
            else:
                return {
                    "response": "Incorect 2FA Code",
                    "status": 401
                }, 401
        else:
            # Account already exists
            print("Account already exist")
            return {
                "response": "Account already exist",
                "status": 401
            }, 401
        
    @app.flask.route("/get_auth_qr_u_uri/<uri>", methods=['GET']) 
    def qr(uri):
        return twofa.get_qr(uri)


    """------------------ FUNCTIONS ------------------"""
    def check_logged_in() -> bool:
        if not session.get("MasterPassword"):
            return False
        return login(session.get("MasterPassword"))
    
    #def check_signed_in() -> bool:
    
    def login(password: str) -> bool:
        return password == app.data["Password"]
    
    def get_session_twofa():
        if not session.get("2FA_Key"):
            key, uri = twofa.new_key()
            session["2FA_Key"] = key

        return twofa.get_key_uri(session.get("2FA_Key"))