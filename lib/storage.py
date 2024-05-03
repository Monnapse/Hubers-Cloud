"""
    Made by Monnapse

    REMINDERS:
    os.R_OK - Check for read access
    os.W_OK - Check for write access
    os.X_OK - Check for execution access
    os.F_OK - Check for existence of file
"""

import os
import psutil
import pathlib
import json
#from heic2png import HEIC2PNG
from PIL import Image
from pillow_heif import register_heif_opener
from io import BytesIO
 
register_heif_opener()

compiled_file_info = []
file_extensions = None
drives = None

def convert_to_bytes(file_path: str, encoder: str="raw"):
    #heic_img = HEIC2PNG(file_path, quality=80)
    #heic_img.image.
    #return heic_img.image.tobytes(encoder)
    with Image.open(file_path) as img:
        # Convert the HEIC image to JPEG
        img_jpeg = BytesIO()
        img.convert('RGB').save(img_jpeg, 'JPEG')
        img_jpeg.seek(0)

        return img_jpeg

    #im = Image.open(file_path)  # do whatever need with a Pillow image
    #return im.tobytes(encoder)

def get_files_from_json():
    global file_extensions
    if file_extensions : return file_extensions
    json_file = open("file_categories.json")
    data = json.load(json_file)
    if not data: return
    file_extensions = data
    return data

def get_drives():
    global drives
    if drives : return drives
    json_file = open("drives.json")
    data = json.load(json_file)
    if not data: return
    drives = data
    return data

def get_drive_info(name: str):
    for i in get_drives():
        if str(i["name"]).lower() == str(name).lower():
            return i
        
def get_drive_info_by_path(path: str):
    for i in get_drives():
        if str(i["path"]).lower() == str(path).lower():
            return i

def bytes_to_size(bytes: int):
    for unit in ("", "KB", "MB", "GB", "T", "P", "E", "Z"):
        if abs(bytes) < 1024.0:
            return f"{bytes:3.1f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.1f} B"

#def bytes_to_size(bytes: int=0) -> str:
#    if bytes <= 1024:
#        return str(bytes/1024)
#    elif bytes <= 
#    return "857.23 GB"

def check_file_permissions(path: str):
    """
        Check if user has full path permissions
    """
    if not os.access(path, os.R_OK) or not os.access(path, os.W_OK) or not os.access(path, os.X_OK) or not os.access(path, os.F_OK):
        return False
    return True

    return total_size

def get_path_used(path: str):
    size = 0

    def e(p):
        nonlocal size
        for ele in os.scandir(p):
            if ele.is_dir():
                e(ele.path)
            elif ele.is_file:
                #print(ele.stat())
                size += ele.stat().st_size

    e(path)
    return size

def get_used_bytes(disk: str) -> int:
    return psutil.disk_usage(disk).used

def get_drive_size(name: str) -> int:
    print(name)
    drive_info = get_drive_info_by_path(name)

    total = 0
    drive_used = 0
    desired_size = -1

    if not drive_info:
        print("No Drive Info")
        total = psutil.disk_usage(name).total
        #disk_used = get_used_bytes(drive_info["drive"])
        #print("From directory: "  + str(bytes_to_size(get_path_used(name))))
        drive_used = get_used_bytes(name) - get_path_used(name)#get_used_bytes(drive_info["path"])
    else:
        print("Drive Info")
        desired_size = drive_info["size"]

        total = psutil.disk_usage(drive_info["drive"]).total
        #disk_used = get_used_bytes(drive_info["drive"])
        #print(bytes_to_size(get_path_used(drive_info["path"])))
        drive_used = get_used_bytes(drive_info["drive"]) - os.path.getsize(drive_info["path"])#get_used_bytes(drive_info["path"])

        #print("Used: " + bytes_to_size(drive_used))
        

    size = total - drive_used

    if desired_size > 0:
        size = desired_size

    print(size)
    return size

def get_space_left(path: str):
    return get_drive_size(path) - get_path_used(path)



#print(bytes_to_size(get_space_left("C:\\Cloud_1")))
#print(bytes_to_size(get_path_used("C:\\Cloud_1")))
def get_extension(name: str):
    split = name.split(".")
    return split[len(split)-1]

def get_category(extension: str):
    extensionTypes = get_files_from_json()

    for i in extensionTypes:
        if extension.lower() in i["extensions"]:
            return i["name"]

    return "Others"

#print(check_file_permissions( 'C:\\Users\\hubermas000\\.gradle\\caches\\transforms-3\\c762f17d69b567ffc4fbadfe65190e1a\\transformed\\unzipped-distribution\\gradle-8.2\\build-logic\\binary-compatibility\\src\\main\\groovy\\gradlebuild\\binarycompatibility\\rules\\SinceAnnotationMissingRuleCurrentGradleVersionSetup.java'))

def compile_files(path: str):
    compiled = [
        {
            "category": "Others",
            "files": 0,
            "size": 0,
            "percentage": 0,
            "z-index": 0
        },
        {
            "category": "Free Space",
            "files": "",
            "size": get_space_left(path),
            "percentage": 0,
            "z-index": 0
        }
    ]

    extensionTypes = get_files_from_json()

    # Compile the categories
    for i in extensionTypes:
        compiled.append({
            "category": i["name"],
            "files": 0,
            "size": 0, # in bytes and then converts to readible string
            "percentage": 0,
            "z-index": 0
        })

    # Iterate through all files and add to coresponding category
    def list(p: str):
        #print(p)
        nonlocal compiled
        r=False # For no errors
        try:
            for i in os.listdir(p):
                new_path = p+"\\"+i
                #print(new_path)
                #print(check_file_permissions(new_path))
                if pathlib.Path(new_path).is_dir():
                    list(new_path+"\\")
                elif check_file_permissions(new_path):
                    found = False
                    # add file to coresponding category
                    for v in compiled:
                        if v["category"] == get_category(get_extension(i)):
                            found = True
                            v["files"] += 1
                            v["size"] += os.path.getsize(new_path) or 0
        except PermissionError as e:
            print(f"Unable to search {path} : {e}")
            # Maybe add something here to skip ahead to the next path?
        else:
            r=True # For no errors
    list(path)

    # Add the unkown files category

    # Sort by biggest size to smallest size
    def sort(e):
        return e["size"]
    compiled.sort(key=sort, reverse=True)

    # Now turn categories size in bytes to readible string
    drive_size = get_drive_size(path)
    z_index=len(compiled)
    for i in compiled:
        i["z-index"] = z_index
        z_index -= 1
        i["percentage"] = i["size"]/drive_size * 100
        i["size"] = bytes_to_size(i["size"])

    print("Done Compiling")
    return compiled

#print(get_category(get_extension("text.MoV.pNg")))
#print(compile_files("C:\\Users\\hubermas000\\Dreadmare\\"))

def compile_drives():
    compiled_drives = []
    drives = get_drives()

    for i in drives:
        compiled_info = compile_files(i["path"])
        if compiled_info:
            compiled_drives.append({
                "name": i["name"],
                "compiled_info": compiled_info
            })

    return compiled_drives
        
compiled_file_info = compile_drives()

#print(compiled_file_info)

def get_drive_compiled_info(name: str) -> {}:
    global compiled_file_info
    #print(get_total_bytes("C:"))
    
    for i in compiled_file_info:
        if str(i["name"]).lower() == str(name).lower():
            path = get_drive_info(name)["path"]
            return {
                "name": name,
                "size": bytes_to_size(get_drive_size(path) or 0),
                "used": bytes_to_size(get_path_used(path) or 0),
                "categories": i["compiled_info"]
            }
        
#print(get_drive_compiled_info("Main"))