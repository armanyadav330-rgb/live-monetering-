import json
import os

with open('scripts/base_en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

with open('scripts/base_hi.json', 'r', encoding='utf-8') as f:
    hi_dict = json.load(f)

def write_ts_file(lang_code, lang_name, lang_dict):
    out_path = f"src/i18n/translations/{lang_code}.ts"
    lines = [
        f"// Translation dictionary for {lang_name} ({lang_code})",
        f"export const {lang_code}: Record<string, string> = {{"
    ]
    for k in sorted(en_dict.keys()):
        v = lang_dict.get(k)
        if not v:
            v = hi_dict.get(k, en_dict[k])
        escaped_v = str(v).replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
        lines.append(f"  '{k}': '{escaped_v}',")
    lines.append("};")
    lines.append(f"export default {lang_code};")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"Wrote {out_path} with {len(en_dict)} keys")

# 1. GUJARATI (gu)
# 2. KANNADA (kn)
# 3. MALAYALAM (ml)
# 4. PUNJABI (pa)
# 5. ODIA (or)
# 6. ASSAMESE (as)
# 7. URDU (ur)

# Let's load the generated base dictionary mapping
print("Generating 7 remaining languages...")
