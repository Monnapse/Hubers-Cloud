"""
Googles Two Factor Authentication
"""
import time 
import pyotp 
import qrcode 
import io
from flask import Flask, send_file

def new_key():
    key = pyotp.random_base32() # Generate a random key

    # Make the key valid
    key, uri = get_key_uri(key)

    # Print out the results
    print("Two Factor has been created.")
    print("* KEY: " + key)
    print("* URI: " + uri)

    return key, uri

def check_code(key: int, code: int) -> bool:
    totp = pyotp.TOTP(key)
    if not totp: return
    return totp.verify(code)

def get_key_uri(secret: str):
    # Make the key valid
    uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=" Two Factor",
        issuer_name="Huber Cloud"
    )
    return secret, uri