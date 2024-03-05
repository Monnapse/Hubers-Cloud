import random
from os import popen

chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
mixed_chars = "RvoGOdbJ6xa3QSg5i0clWmwkpUCT14MtLBfhAXjz9nPes2HD8FyIu7qNVErZKY"

slash = "e"

def mix(string: str):
    new = ""
    for i in string:
        ran_index = random.randint(0, len(string)-1)
        #print(len(string), ran_index)
        new += string[ran_index]
        string = string[:ran_index] + string[ran_index+1:]
    return new

def shorten(path: str, use_custom=False, custom_chars=mixed_chars):
    shortener_chars = custom_chars
    if not use_custom:
        global mixed_chars
        shortener_chars = mixed_chars
    
    path = path.lower()
    
    key = random.randint(1, len(chars))
    shortened_string = ""

    index = 0
    for char in path:
        #print(mixed_chars.find(i))
        index+=1
        i = index + key
        if index > key: index = (i+key)-len(chars)
        shortened_string += chars[i]

    return shortened_string

print(shorten("test/ok.png"))
#print(len(chars))
#mixed = mix(chars)
#print(len(mixed))
#print(mix(chars))