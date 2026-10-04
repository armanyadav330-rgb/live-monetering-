import json
import os

with open('src/i18n/extracted_existing.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

with open('scripts/base_en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

with open('scripts/base_hi.json', 'r', encoding='utf-8') as f:
    hi_dict = json.load(f)

# Helper to format TS file
def write_ts_file(lang_code, lang_name, lang_dict):
    out_path = f"src/i18n/translations/{lang_code}.ts"
    lines = [
        f"// Translation dictionary for {lang_name} ({lang_code})",
        f"export const {lang_code}: Record<string, string> = {{"
    ]
    for k, v in sorted(lang_dict.items()):
        escaped_v = v.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
        lines.append(f"  '{k}': '{escaped_v}',")
    lines.append("};")
    lines.append(f"export default {lang_code};")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"Wrote {out_path} with {len(lang_dict)} keys")

# Write en and hi
write_ts_file('en', 'English', en_dict)
write_ts_file('hi', 'Hindi', hi_dict)
