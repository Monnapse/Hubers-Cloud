"""
    Made by Monnapse
"""

def bytes_to_size(bytes: int):
    for unit in ("B", "KB", "MB", "GB", "T", "P", "E", "Z"):
        if abs(bytes) < 1024.0:
            return f"{bytes:3.1f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.1f} B"