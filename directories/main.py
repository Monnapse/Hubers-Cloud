"""
    Made by Monnapse
"""

from flask import Flask, render_template, redirect, session, request, jsonify
from lib import storage_managment
import time

# SETTINGS
grab_time = 60*3 # every 3 minutes reset

def run(app: Flask):
    compiled_drives = None
    global_drive = None
    last_drive_grab = 0

    @app.flask.route("/")
    def index():
        # Get user is logged in
        #Username = session["Username"] # Apply Username to users session
        try:
            signed_in = session["2FA"]

            # Check to see if user is logged in
            if signed_in:
                # User is logged in
                # So render the main page which shows the cloud
                return redirect("/cloud")
        except Exception:
            # User is not logged in
            # So redirect them to the login page where they can sign in
            return redirect("/login")
        
    @app.flask.route("/cloud")
    def cloud():
        # Get user is logged in
        #Username = session["Username"] # Apply Username to users session
        try:
            signed_in = session["2FA"]

            # Check to see if user is logged in
            if signed_in:
                # User is logged in
                # So render the main page which shows the cloud

                return render_template(
                    app.template,
                    #drive=global_drive,
                    template=app.cloud_template,
                    pagename = "Hubers Cloud | Cloud",
                    stylesheet="/static/css/cloud_template.css",
                   # script="/static/js/contextMenu.js",
                    page = "Cloud",
                    content = "cloud.html"
                )
        except Exception:
            # User is not logged in
            # So redirect them to the login page where they can sign in
            return redirect("/login")
    @app.flask.route("/drives")
    def drives():
        # Get user is logged in
        #Username = session["Username"] # Apply Username to users session
        try:
            signed_in = session["2FA"]

            # Check to see if user is logged in
            if signed_in:
                # User is logged in
                # So render the main page which shows the cloud
                return render_template(
                    app.template,
                    #drive=global_drive,
                    template=app.cloud_template,
                    pagename = "Hubers Cloud | Drives",
                    stylesheet="/static/css/cloud_template.css",
                    page = "Drives",
                    content = "drives.html"
                )
        except Exception:
            # User is not logged in
            # So redirect them to the login page where they can sign in
            return redirect("/login")
    @app.flask.route("/settings")
    def settings():
        # Get user is logged in
        #Username = session["Username"] # Apply Username to users session
        try:
            signed_in = session["2FA"]

            # Check to see if user is logged in
            if signed_in:
                # User is logged in
                # So render the main page which shows the cloud
                return render_template(
                    app.template,
                    #drive=global_drive,
                    template=app.cloud_template,
                    pagename = "Hubers Cloud | Settings",
                    stylesheet="/static/css/cloud_template.css",
                    page = "Settings"
                    #content = "template.html"
                )
        except Exception:
            # User is not logged in
            # So redirect them to the login page where they can sign in
            return redirect("/login")
        
    @app.flask.route("/grab_files", methods=['GET']) 
    def grab_files():
        """
            nextKey: nextKey,
            filesAmount: filesAmount
        """
        headers = request.headers
        nextKey = headers.get("Next-Key")
        filesAmount = headers.get("Files-Amount")
        path = headers.get("Path")
        print("Path="+path)
        if not nextKey or not filesAmount:
            return {
                "response": "not all parameters were provided.",
                "code": 400
            }, 400
        
        #
        if path != "null":
            pathSplit = path.split("/",1)
            file_path = "" if len(pathSplit)==1 else pathSplit[1]
            drive_name = pathSplit[0]

            files = storage_managment.drives.list_files("", 0, storage_managment.drives.get_drive_info(drive_name)["path"]+"/"+file_path, drive_name)
        else:
            files = storage_managment.list_files_shared("",0)
        #print(files)
        return {"response":files}, 200
    
    @app.flask.route("/get_drive", methods=['GET']) 
    def get_drive():
        # If time is over the reset time then update the drive data
        if time.time() - last_drive_grab or 0 > grab_time or 0:
            print("Updating Drive!")
            compiled_drives = storage_managment.compile_all_drives() # this updates everything
            global_drive = storage_managment.get_global_drive() # this puts the data into dictionary list data
        return {"response": global_drive, "code": 200}, 200
    
    @app.flask.route("/get_all_drives", methods=['GET']) 
    def get_all_drives_():
        # If time is over the reset time then update the drive data
        if time.time() - last_drive_grab or 0 > grab_time or 0:
            print("Updating Drive!")
            compiled_drives = storage_managment.compile_all_drives() # this updates everything

        return {"response": storage_managment.get_all_drives(compiled_drives), "code": 200}, 200

def sign_in_check():
    try:
        signed_in = session["2FA"]
        # Check to see if user is logged in
        if signed_in:
            # User is logged in
            # So render the main page which shows the cloud
            return True
    except Exception:
        # User is not logged in
        # So redirect them to the login page where they can sign in
        return False