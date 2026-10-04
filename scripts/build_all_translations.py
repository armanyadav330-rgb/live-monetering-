import json
import os

with open('src/i18n/extracted_existing.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

with open('scripts/base_en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

with open('scripts/base_hi.json', 'r', encoding='utf-8') as f:
    hi_dict = json.load(f)

print(f"Base EN has {len(en_dict)} keys, Base HI has {len(hi_dict)} keys")
