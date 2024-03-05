"""
    Made by Monnapse

    TODO Change to SQL instead of json for accounts, etc.
"""

import json

directory = "accounts.json"

def get_accounts():
    json_file = open(directory)
    data = json.load(json_file)
    if not data: return
    return data,json_file

def get_account(username: str):
    # Open server json and set self properties
    data,json_file = get_accounts()
    #print(data)
    acc_info = False
    acc_id = None
    for i in data["accounts"]:
        if i["u"].lower() == username.lower():
            acc_info = i
            acc_id = i["id"]

    json_file.close()
    return acc_info, acc_id

def exists(username: str):
    acc,d = get_account(username)
    if acc:
        return True
    return False

def create_new_user(username: str, key: str):
    data,json_file = get_accounts()
    #print(data)
    data["latest_id"] += 1
    data["accounts"].append({
        "u": username,
        "2fa": key,
        "id": data["latest_id"]
    })
    
    with open(directory, 'w') as outfile:
        json.dump(data, outfile)

    json_file.close()