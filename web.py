"""
    Made by Monnapse
"""

from flask import Flask, render_template
import os, glob
import imp
import json

class define:
    # This defines the main attributes of the class
    template = "base.html"
    cloud_template = "cloud_template.html"
    authentication_template = "authentication_template.html"
    flask: Flask = None

    # The initializer of the class
    # Defines the class attributes
    def __init__(app, flask_app: Flask) -> None:
        app.flask = flask_app
        print("Web Controller >>> is running")

        # Open server json and set self properties
        server_json = open('server.json')
        data = json.load(server_json)

        # Save all keys in json to app
        app.data = {}
        for i in data:
            app.data[i] = data[i]
            print(i + " : " + data[i])
        # Close the json file
        server_json.close()
        pass

    # Run Directories goes through the Directories Folder
    # and imports the module and runs it
    # directories folder contains all the directories of the site
    def run_directories(app):
        for filename in glob.glob(os.path.join("directories", '*.py')):
           module = imp.load_source(filename, filename)
           module.run(app)
           print(filename)