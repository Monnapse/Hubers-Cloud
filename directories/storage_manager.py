"""
    Made by Monnapse

    LOGIN is for entering the Master Password
    SIGNIN is for entering account info
"""

import shutil
import os
from flask import Flask, render_template, request, session, redirect, send_file
from flask_session import Session
import lib.storage_managment as sm
from lib.storage_managment import drives, file_size
import shutil

def run(app: Flask):
    @app.flask.route("/upload", methods=['POST']) 
    def upload():
        headers = request.headers
        path = ""
        if headers.get("FilePath"):
            path = headers.get("FilePath").split("/",1)
            file_path = path[1]
            drive_name = path[0]

            drive_info = drives.get_drive_info(drive_name)
            if not drive_info:
                return {
                    "response": "Drive does not exist",
                    "code": 400
                }, 400

            path = drive_info["path"]+"/"+file_path
        else:
            drive = drives.get_drive_with_space(size)
            path = drive["path"]

        if 'file1' not in request.files: 
            return {
                "response": "No file to upload",
                "status": 400
            }, 400
        
        file = request.files["file1"]
        print(file)
        
        if file.filename == '': 
            return {
                "response": "No file selected",
                "status": 400
            }, 400

        size = len(file.read()) + 1024 # add some to reserve
        #print(file_size.bytes_to_size(size))

        #drive = drives.get_drive_with_space(size)
        #path = drive["path"]
        
        file.stream.seek(0)
        file.save(os.path.join(path, file.filename))
        #
        return {
                "response": f"Successfully uploaded {file.filename}",
                ""
                "status": 200
            }, 200
    
    @app.flask.route("/delete", methods=['POST']) 
    def delete():
        headers = request.headers
        if not headers.get("path"): return {
                "response": "Did not include drive name or path started with /",
                "code": 400
            },

        path = headers.get("path").split("/",1)
        file_path = path[1]
        drive_name = path[0]

        if not drive_name or len(drive_name) == 0:
            return {
                "response": "Did not include drive name or path started with /",
                "code": 400
            }, 400
        
        drive_info = drives.get_drive_info(drive_name)

        if not drive_info:
            return {
                "response": "Drive does not exist",
                "code": 400
            }, 400

        real_path = drive_info["path"]+"/"+file_path
        if os.path.isdir(real_path):
            os.rmdir(real_path)
        elif os.path.isfile(real_path):
            os.remove(real_path)
        else:
            return {
                "response": "Cannot find file",
                "status": 400
            }, 400
    
        #
        return {
                "response": f"Successfully deleted {file_path}",
                ""
                "status": 200
            }, 200
    
    @app.flask.route("/download", methods=['GET']) 
    def downloadFile():
        headers = request.headers
        if not headers.get("path"): return {
                "response": "Did not include drive name or path started with /",
                "code": 400
            },

        path = headers.get("path").split("/",1)
        file_path = path[1]
        drive_name = path[0]

        if not drive_name or len(drive_name) == 0:
            return {
                "response": "Did not include drive name or path started with /",
                "code": 400
            }, 400
        
        drive_info = drives.get_drive_info(drive_name)

        if not drive_info:
            return {
                "response": "Drive does not exist",
                "code": 400
            }, 400

        real_path = drive_info["path"]+"/"+file_path
 
        if os.path.isdir(real_path):
            # Path is a folder/directory
            zip = shutil.make_archive("test", 'zip', real_path)
            return send_file(zip, as_attachment=True)
        else:
            # Path is a file
            return send_file(real_path, as_attachment=True)

    @app.flask.route("/drives/file") 
    def openFile():
        path = request.args.get("path").split("/",1)
        file_path = path[1]
        drive_name = path[0]
        if not drive_name or len(drive_name) == 0:
            return {
                "response": "Did not include drive name or path started with /",
                "code": 400
            }, 400
        
        drive_info = drives.get_drive_info(drive_name)

        if not drive_info:
            return {
                "response": "Drive does not exist",
                "code": 400
            }, 400

        real_path = drive_info["path"]+"/"+file_path
        return send_file(real_path)
    
    #previewfile
    @app.flask.route("/drives/previewfile") 
    def previewFile():
        path = request.args.get("path").split("/",1)
        file_path = path[1]
        drive_name = path[0]
        if not drive_name or len(drive_name) == 0:
            return {
                "response": "Did not include drive name or path started with /",
                "code": 400
            }, 400
        
        drive_info = drives.get_drive_info(drive_name)

        if not drive_info:
            return {
                "response": "Drive does not exist",
                "code": 400
            }, 400
        category = drives.get_category(drives.get_extension(file_path))
        real_path = drive_info["path"]+"/"+file_path
        if category == "Images":
            return send_file(real_path)
        elif category == "Videos":
            bytesIo = sm.get_video_first_frame(real_path)
            return bytesIo
        
    @app.flask.route("/files/geticon", methods=["GET"]) 
    def getIcon():
        headers = request.headers
        file_name = headers.get("File-Name")
        category = headers.get("Category")

        path = "/static/images/Unkown.png"

        if not category and file_name:
            category = drives.get_category(drives.get_extension(file_name))

        #if category == "Images" or category == "Videos": path = "/static/images/Image.png"
        #elif category == "Documents"
        
        return {
            "response": drives.get_category_icon(category),
            "code": 200
        }, 200
    @app.flask.route("/files/getcategory", methods=["GET"]) 
    def getCategory():
        headers = request.headers
        file_name = headers.get("File-Name")
        file_ext = headers.get("File-Extension")
        if not file_ext: file_ext = drives.get_extension(file_name)

        return {
            "response": drives.get_category(file_ext),
            "code": 200
        }, 200