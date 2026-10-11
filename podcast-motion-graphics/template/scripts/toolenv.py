"""Locate ffmpeg / python / chrome for the scripts. setup.sh writes .tools/env.json; env vars override it."""
import json, os, shutil

def _env():
    for base in ('.tools/env.json', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.tools', 'env.json')):
        if os.path.exists(base):
            return json.load(open(base))
    return {}

def ffmpeg_path():
    return os.environ.get('FFMPEG') or _env().get('ffmpeg') or shutil.which('ffmpeg') or 'ffmpeg'

def chrome_path():
    return os.environ.get('CHROME_PATH') or _env().get('chrome')
