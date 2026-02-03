import json
import os

files = [
    'public/data/history_heekeun.json',
    'public/data/history_geonkyung.json'
]

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"✅ {file_path}: Valid JSON")
    except json.JSONDecodeError as e:
        print(f"❌ {file_path}: Invalid JSON")
        print(f"   Error: {e}")
    except Exception as e:
        print(f"❌ {file_path}: Error {e}")
