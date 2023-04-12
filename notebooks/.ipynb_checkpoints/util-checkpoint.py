"""
    os Dirctory
"""
import os
from datetime import datetime

def getFileName(file):
    return file.split("\\")[-1]
def getFileIsoDate(file):
    return datetime.fromtimestamp( os.path.getctime(file) ).isoformat()

def dir2df(rootPath):
    arr=[]
    for root, dirs, files in os.walk(rootPath, topdown=False):
        for name in files:
            arr.append({'type':'file', "root":root, 'path':name})
        for name in dirs:
            arr.append({'type':'dir', "root":root, 'path':name})
    return pd.DataFrame(arr)
