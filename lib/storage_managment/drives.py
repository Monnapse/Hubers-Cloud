"""
    Made by Monnapse
"""
import os
import psutil
import pathlib
#import file_size
import json
from lib.storage_managment import file_size

compiled_file_info = []
file_extensions = None
valid_file_view_types = None
drives = None

def get_files_from_json():
    global file_extensions
    if file_extensions : return file_extensions
    json_file = open("file_categories.json")
    data = json.load(json_file)
    if not data: return
    file_extensions = data
    return data

def get_valid_file_view_types_json():
    global valid_file_view_types
    if valid_file_view_types : return valid_file_view_types
    json_file = open("valid_file_view_types.json")
    data = json.load(json_file)
    if not data: return
    valid_file_view_types = data
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
#        
#def get_drive_info_by_path(path: str):
#    for i in get_drives():
#        if str(i["path"]).lower() == str(path).lower():
#            return i

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

def get_category_icon(category: str):
    extensionTypes = get_files_from_json()

    for i in extensionTypes:
        if category.lower() in i["name"].lower():
            return i["img_name"]

    return "Unkown.png"

def can_view_file(extension: str):
    types = get_valid_file_view_types_json()
    category = get_category(extension)

    for type in types:
        if type.lower() == category.lower(): return True
    return False

def compile_files(name: str, drive: str, path: str, size: int):
    compiled = [
        {
            "category": "Others",
            "files": 0,
            "size": 0,
            #"percentage": 0,
            #"z-index": 0
        },
        #{
        #    "category": "Free Space",
        #    "files": "",
        #    "size": get_space_left(name, drive, path, size),
        #    "percentage": 0,
        #    "z-index": 0
        #}
    ]

    extensionTypes = get_files_from_json()

    # Compile the categories
    for i in extensionTypes:
        compiled.append({
            "category": i["name"],
            "files": 0,
            "size": 0, # in bytes and then converts to readible string
            #"percentage": 0,
            #"z-index": 0
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
    drive_size = get_drive_size(name, drive, path, size)
    z_index=len(compiled)
    for i in compiled:
        #i["z-index"] = z_index
        #z_index -= 1
        #i["percentage"] = i["size"]/drive_size * 100
        i["size"] = i["size"]

    print("Done Compiling")
    return compiled

def get_path_used(path: str):
    size = 0
    #print(path)

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

def list_files(nextKey: str, filesAmount: int, path: str, driveName: str):
    list = []

    drivePath = get_drive_info(driveName)["path"]

    for ele in os.scandir(path):
        ext = get_extension(str(ele.name))
        cv = can_view_file(ext)
        file = None
        size = 0
        if ele.is_file(): size = os.path.getsize(ele.path)
        elif ele.is_dir(): size = get_path_used(ele.path)

        file = driveName+ele.path.replace(drivePath, "").replace("\\","/")

        list.append({
            "name": ele.name.replace("."+ext, ""),
            "is_dir": ele.is_dir(),
            "is_file": ele.is_file(),
            "category": get_category(ext),
            "size": file_size.bytes_to_size(size),
            "can_view": cv,
            "path": file
        })
    return list

def get_total_reserved_space(name: str):
    drives_settings = get_drives()
    drives_total_allowed = {}
    drives_amount_used = {}

    for i in drives_settings:
        drive = i["drive"]
        if drives_total_allowed.get(drive) == None:
            drives_total_allowed[drive] = psutil.disk_usage(drive).free
        if drives_amount_used.get(drive) == None:
            drives_amount_used[drive] = 0
        used = drives_amount_used[drive]
        total_allowed = drives_total_allowed[drive]

        remaining = total_allowed - used
        #print(remaining)

        size = i["size"]

        # if size is -1 then set size to drive size
        if size < 0:
            size = total_allowed

        amount_using = 0
        # Check if there is enough space for this drive
        if size + used <= total_allowed:
            amount_using = size
            drives_amount_used[drive] = size + used
        elif total_allowed-(size + used) > 0:
            amount_using = (size + used)-total_allowed
            drives_amount_used[drive] = amount_using
        else:
            # Just give the drive the remaining amount
            amount_using = remaining
            drives_amount_used[drive] += remaining

            
        if i["name"] == name:
            return amount_using

def get_used_bytes(disk: str) -> int:
    return psutil.disk_usage(disk).used

#def get_drive_size(name: str) -> int:
#    print(name)
#    drive_info = get_drive_info_by_path(name)
#
#    total = 0
#    drive_used = 0
#    desired_size = -1
#
#    if not drive_info:
#        print("No Drive Info")
#        total = psutil.disk_usage(name).total
#        #disk_used = get_used_bytes(drive_info["drive"])
#        #print("From directory: "  + str(bytes_to_size(get_path_used(name))))
#        drive_used = get_used_bytes(name) - get_path_used(name)#get_used_bytes(drive_info["path"])
#    else:
#        print("Drive Info")
#        desired_size = drive_info["size"]
#
#        total = psutil.disk_usage(drive_info["drive"]).total
#        #disk_used = get_used_bytes(drive_info["drive"])
#        #print(bytes_to_size(get_path_used(drive_info["path"])))
#        drive_used = get_used_bytes(drive_info["drive"]) - os.path.getsize(drive_info["path"])#get_used_bytes(drive_info["path"])
#
#        #print("Used: " + bytes_to_size(drive_used))
#        
#
#    size = total - drive_used
#
#    if desired_size > 0:
#        size = desired_size
#
#    print(size)
#    return size

def get_drive_size(name: str, drive: str, path: str , desired_size: int) -> int:
    total = 0
    drive_used = 0

    total = psutil.disk_usage(drive).total
    drive_used = get_used_bytes(drive) - os.path.getsize(path)
        
    size = total - drive_used
    if desired_size > 0 and desired_size <= size:
        size = desired_size

    #print(size)

    return size

def get_total_reserved():
    drives_settings = get_drives()
    
    size = 0

    for i in drives_settings:
        size += get_total_reserved_space(i["name"]) or 0

    return size

def get_space_left(name: str, drive: str, path: str , size: int):
    return get_drive_size(name, drive, path , size) - get_path_used(path)

def get_drive_with_space(size: int):
    for drive in get_drives():
        drive_space_left = get_space_left(drive["name"], drive["drive"], drive["path"], drive["size"])
        #print(drive["name"] + " : " + file_size.bytes_to_size(get_space_left(drive["name"], drive["drive"], drive["path"], drive["size"])))
        if drive_space_left > size: return drive

    return None


#def compile_drives():
#    compiled_drives = []
#    drives = get_drives()
#
#    for i in drives:
#        compiled_info = compile_files(i["path"])
#        if compiled_info:
#            compiled_drives.append({
#                "name": i["name"],
#                "compiled_info": compiled_info
#            })
#
#    return compiled_drives
        
#compiled_file_info = compile_drives()

#print(compiled_file_info)

#def get_drive_compiled_info(name: str) -> {}:
#    global compiled_file_info
#    #print(get_total_bytes("C:"))
#    
#    for i in compiled_file_info:
#        if str(i["name"]).lower() == str(name).lower():
#            path = get_drive_info(name)["path"]
#            return {
#                "name": name,
#                "size": size.bytes_to_size(get_drive_size(path) or 0),
#                "used": size.bytes_to_size(get_path_used(path) or 0),
#                "categories": i["compiled_info"]
#            }
    