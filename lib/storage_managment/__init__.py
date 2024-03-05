"""
    Made by Monnapse
"""

import os
import psutil
import pathlib
import json
from lib.storage_managment import drives, file_size
import cv2
import io

global_drive = {}

class new_drive:
    def __init__(self, name: str, descriptive_name: str, path: str, drive: str, size: int) -> None:
        self.name = name
        self.descriptive_name = descriptive_name
        self.path = path
        self.drive = drive
        self.size = size

        self.compiled_files = []

    def compile_files(self):
        """
            Grab the drive files in categories
        """
        compiled_files = drives.compile_files(self.name, self.drive, self.path, self.size)
        if compiled_files:
            self.compiled_files = compiled_files
            return compiled_files

    def get_size(self):
        return drives.get_drive_size(self.name, self.drive, self.path, self.size)
    def get_drive_size_subtracted(self):
        # Get Size and substract other drives in same drive
        return drives.get_drive_size_subtracted(self.name, self.drive, self.path, self.size)
    def get_used(self):
        return drives.get_path_used(self.path)
    def list_files(self, nextKey, filesAmount):
        return drives.list_files(nextKey, filesAmount, self.path, self.name)
    
def list_files_shared(nextKey, filesAmount):
    drives_ = drives.get_drives()
    files = []

    for drive in drives_:
        for file in drives.list_files("",0, drive["path"], drive["name"]):
            files.append(file)

    return files

def reset_global_drive():
    global global_drive
    global_drive = global_drive = {
        "name": "GLOBAL",
        "size": 0,
        "used": 0,
        "categories": [],
    }

def compile_all_drives():
    reset_global_drive()

    compiled_drives = []
    drives_ = drives.get_drives()

    for i in drives_:
        #print(drive)
        drive = new_drive(i["name"], i["descriptive_name"], i["path"], i["drive"], i["size"])
        size = drive.get_size() or 0
        used = drive.get_used() or 0
        categories = drive.compile_files()
        
        add_to_global(size, used, categories)

        compiled_drives.append({
            "drive": drive,
            "name": i["name"],
            "size": size,
            "used": used,
            "categories": categories,
        })

    return compiled_drives

def get_all_drives(compiled_drives):
    drives_list = []
    for i in compiled_drives:
        #print(i)
        drives_list.append({
            "name": i["name"],
            "size": i["size"],
            "used": i["used"],
            "categories": i["categories"],
        })
    return drives_list

def get_global_drive():
    global global_drive
    categories = global_drive["categories"]

    # Sort by biggest size to smallest size
    def sort(e):
        return e["size"]
    categories.sort(key=sort, reverse=True)

    # Now turn categories size in bytes to readible string
    drive_size = drives.get_total_reserved()
    z_index=len(categories)
    #for i in categories:
    #    #i["z-index"] = z_index
    #    #z_index -= 1
    #    #i["percentage"] = i["size"]/drive_size * 100
    #    i["size"] = file_size.bytes_to_size(i["size"])

    #return {
    #    "name": global_drive["name"],
    #    "size": file_size.bytes_to_size(drive_size),
    #    "used": file_size.bytes_to_size(global_drive["used"]),
    #    "categories": categories,
    #}
    return {
    "name": global_drive["name"],
    "size": drive_size,
    "used": global_drive["used"],
    "categories": categories,
    }

def get_drive_by_name(name: str, compiled_drives: []):
    for i in compiled_drives:
        if str(i["name"]).lower() == str(name).lower():
            return i

def get_category_index(name: str, categories: []):
    index = 0
    for i in categories:
        if i["category"].lower() == name.lower():
            return index
        index += 1

def add_to_global(size: int, used: int, categories: []):
    global global_drive
    global_drive["size"] += size
    global_drive["used"] += used

    for i in categories:
        index = get_category_index(i["category"], global_drive["categories"])
        #print(index, i["category"])
        if index != None and index > -1:
            # category exists
            global_drive["categories"][index]["files"] += i["files"]
            global_drive["categories"][index]["size"] += i["size"]
        else:
            #print(index, i["category"])
            # category does not exist
            global_drive["categories"].append({
                "category": i["category"],
                "files": i["files"],
                "size": i["size"],
                #"percentage": 0,
                #"z-index": 0
            })
            
def get_video_first_frame(path):
    video = cv2.VideoCapture(path)
    if not video.isOpened():
        # Could not open video
        return None
    ret,frame = video.read()
    if not ret:
        # Couldnt read frame
        return None
    video.release()
    _,buffer = cv2.imencode(".jpg", frame)
    bytesIo = io.BytesIO(buffer)
    return bytesIo

#compile_all_drives()
#print(global_drive)