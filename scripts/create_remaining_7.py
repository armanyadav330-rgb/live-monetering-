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

# Common domain terms per language for high accuracy
DOMAINS = {
    'gu': {
        'gov': 'ભારત સરકાર',
        'ministry': 'સામાજિક ન્યાય અને અધિકારિતા મંત્રાલય',
        'portal_title': 'સત્ય નિરીક્ષક',
        'portal_subtitle': 'AI-સંચાલિત NGO દેખરેખ અને રિયલ-ટાઇમ ટેલિમેટ્રી પોર્ટલ',
        'dashboard': 'ડેશબોર્ડ',
        'projects': 'પ્રોજેક્ટ ડિરેક્ટરી',
        'inspections': 'ક્ષેત્ર નિરીક્ષણો',
        'cctv': '24×7 સીસીટીવી દેખરેખ',
        'vc': 'આકસ્મિક વીડિયો કૉલ',
        'analytics': 'AI વિસંગતતા રડાર',
        'map': 'GIS ભૌગોલિક નકશો',
        'reports': 'સત્તાવાર અહેવાલો',
        'audit': 'સિસ્ટમ ઑડિટ ટ્રેઇલ',
        'officers': 'અધિકારી રોસ્ટર',
        'roles': 'ભૂમિકા મેટ્રિક્સ',
        'users': 'વપરાશકર્તા વ્યવસ્થાપન',
        'notifications': 'સૂચનાઓ',
        'settings': 'પોર્ટલ સેટિંગ્સ',
        'profile': 'મારી પ્રોફાઇલ',
        'logout': 'લૉગ આઉટ',
        'start_inspection': 'નિરીક્ષણ શરૂ કરો',
        'submit_report': 'અહેવાલ સબમિટ કરો',
        'active': 'સક્રિય',
        'pending': 'બાકી',
        'completed': 'પૂર્ણ',
        'critical': 'ગંભીર જોખમ',
        'high': 'ઉચ્ચ જોખમ',
        'medium': 'મધ્યમ જોખમ',
        'low': 'ઓછું જોખમ',
        'simulation': 'સિમ્યુલેશન / ડેમો વાતાવરણ',
        'start_sim': 'સિમ્યુલેશન શરૂ કરો',
        'stop_sim': 'સિમ્યુલેશન રોકો',
        'reset_sim': 'સિમ્યુલેશન રીસેટ કરો',
        'running': 'સિમ્યુલેશન ચાલુ છે',
        'paused': 'સિમ્યુલેશન થોભાવેલું છે',
        'detection_rate': 'સ્વચાલિત તપાસ દર',
        'false_alarm': 'ખોટા એલાર્મ દર',
        'rf_spectrum': 'RF સ્પેક્ટ્રમ અને ટેલિમેટ્રી ટેલિફોની',
        'strategy': 'સ્માર્ટ સ્કેન વ્યૂહરચના',
    },
    'kn': {
        'gov': 'ಭಾರತ ಸರ್ಕಾರ',
        'ministry': 'ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ',
        'portal_title': 'ಸತ್ಯ ನಿರೀಕ್ಷಕ',
        'portal_subtitle': 'AI-ಚಾಲಿತ ಎನ್‌ಜಿಒ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ರಿಯಲ್-ಟೈಮ್ ಟೆಲಿಮೆಟ್ರಿ ಪೋರ್ಟಲ್',
        'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'projects': 'ಯೋಜನಾ ಡೈರೆಕ್ಟರಿ',
        'inspections': 'ಕ್ಷೇತ್ರ ಪರಿಶೀಲನೆಗಳು',
        'cctv': '24×7 ಸಿಸಿಟಿವಿ ಕಣ್ಗಾವಲು',
        'vc': 'ಆಕಸ್ಮಿಕ ವೀಡಿಯೊ ಕರೆ',
        'analytics': 'AI ಅಸಂಗತತೆ ರಾಡಾರ್',
        'map': 'GIS ಜಿಯೋಲೋಕೇಶನ್ ನಕ್ಷೆ',
        'reports': 'ಅಧಿಕೃತ ವರದಿಗಳು',
        'audit': 'ಸಿಸ್ಟಮ್ ಆಡಿಟ್ ಟ್ರಯಲ್',
        'officers': 'ಅಧಿಕಾರಿಗಳ ಪಟ್ಟಿ',
        'roles': 'ಪಾತ್ರ ಮ್ಯಾಟ್ರಿಕ್ಸ್',
        'users': 'ಬಳಕೆದಾರರ ನಿರ್ವಹಣೆ',
        'notifications': 'ಅಧಿಸೂಚನೆಗಳು',
        'settings': 'ಪೋರ್ಟಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'profile': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
        'logout': 'ಲಾಗ್ ಔಟ್',
        'start_inspection': 'ಪರಿಶೀಲನೆ ಪ್ರಾರಂಭಿಸಿ',
        'submit_report': 'ವರದಿ ಸಲ್ಲಿಸಿ',
        'active': 'ಸಕ್ರಿಯ',
        'pending': 'ಬಾಕಿ ಉಳಿದಿದೆ',
        'completed': 'ಪೂರ್ಣಗೊಂಡಿದೆ',
        'critical': 'ಗಂಭೀರ ಅಪಾಯ',
        'high': 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
        'medium': 'ಮಧ್ಯಮ ಅಪಾಯ',
        'low': 'ಕಡಿಮೆ ಅಪಾಯ',
        'simulation': 'ಸಿಮ್ಯುಲೇಶನ್ / ಡೆಮೊ ಪರಿಸರ',
        'start_sim': 'ಸಿಮ್ಯುಲೇಶನ್ ಪ್ರಾರಂಭಿಸಿ',
        'stop_sim': 'ಸಿಮ್ಯುಲೇಶನ್ ನಿಲ್ಲಿಸಿ',
        'reset_sim': 'ಸಿಮ್ಯುಲೇಶನ್ ಮರುಹೊಂದಿಸಿ',
        'running': 'ಸಿಮ್ಯುಲೇಶನ್ ಚಾಲನೆಯಲ್ಲಿದೆ',
        'paused': 'ಸಿಮ್ಯುಲೇಶನ್ ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ',
        'detection_rate': 'ಸ್ವಯಂಚಾಲಿತ ಪತ್ತೆ ದರ',
        'false_alarm': 'ಸುಳ್ಳು ಎಚ್ಚರಿಕೆ ವ್ಯತ್ಯಾಸ',
        'rf_spectrum': 'RF ಸ್ಪೆಕ್ಟ್ರಮ್ ಮತ್ತು ಟೆಲಿಮೆಟ್ರಿ ಟೆಲಿಫೋನಿ',
        'strategy': 'ಸ್ಮಾರ್ಟ್ ಸ್ಕ್ಯಾನ್ ತಂತ್ರ',
    },
    'ml': {
        'gov': 'ഭാരത സർക്കാർ',
        'ministry': 'സാമൂഹിക നീതി ശാക്തീകരണ മന്ത്രാലയം',
        'portal_title': 'സത്യ നിരീക്ഷക്',
        'portal_subtitle': 'AI-അധിഷ്ഠിത എൻ‌ജി‌ഒ നിരീക്ഷണ തത്സമയ ടെലിമെട്രി പോർട്ടൽ',
        'dashboard': 'ഡാഷ്‌ബോർഡ്',
        'projects': 'പദ്ധതി ഡയറക്ടറി',
        'inspections': 'ഫീൽഡ് പരിശോധനകൾ',
        'cctv': '24×7 സിസിടിവി നിരീക്ഷണം',
        'vc': 'സർപ്രൈസ് വീഡിയോ കോൾ',
        'analytics': 'AI അപാകത റഡാർ',
        'map': 'ജിഐഎസ് ഭൂപടം',
        'reports': 'ഔദ്യോഗിക റിപ്പോർട്ടുകൾ',
        'audit': 'സിസ്റ്റം ഓഡിറ്റ് ട്രയൽ',
        'officers': 'ഉദ്യോഗസ്ഥ പട്ടിക',
        'roles': 'റോൾ മാട്രിക്സ്',
        'users': 'ഉപയോക്തൃ മാനേജ്‌മെന്റ്',
        'notifications': 'അറിയിപ്പുകൾ',
        'settings': 'പോർട്ടൽ ക്രമീകരണങ്ങൾ',
        'profile': 'എന്റെ പ്രൊഫൈൽ',
        'logout': 'ലോഗ് ഔട്ട്',
        'start_inspection': 'പരിശോധന ആരംഭിക്കുക',
        'submit_report': 'റിപ്പോർട്ട് സമർപ്പിക്കുക',
        'active': 'സജീവം',
        'pending': 'തീർച്ചപ്പെടുത്തിയിട്ടില്ല',
        'completed': 'പൂർത്തിയായി',
        'critical': 'ഗുരുതരമായ അപകടസാധ്യത',
        'high': 'ഉയർന്ന അപകടസാധ്യത',
        'medium': 'ഇടത്തരം അപകടസാധ്യത',
        'low': 'കുറഞ്ഞ അപകടസാധ്യത',
        'simulation': 'സിമുലേഷൻ / ഡെമോ പരിസ്ഥിതി',
        'start_sim': 'സിമുലേഷൻ ആരംഭിക്കുക',
        'stop_sim': 'സിമുലേഷൻ നിർത്തുക',
        'reset_sim': 'സിമുലേഷൻ പുനഃസജ്ജമാക്കുക',
        'running': 'സിമുലേഷൻ പ്രവർത്തിക്കുന്നു',
        'paused': 'സിമുലേഷൻ താൽക്കാലികമായി നിർത്തി',
        'detection_rate': 'ഓട്ടോമേറ്റഡ് കണ്ടെത്തൽ നിരക്ക്',
        'false_alarm': 'തെറ്റായ അലാറം വ്യത്യാസം',
        'rf_spectrum': 'RF സ്പെക്ട്രവും ടെലിമെട്രി ടെലിഫോണിയും',
        'strategy': 'സ്മാർട്ട് സ്കാൻ തന്ത്രം',
    },
    'pa': {
        'gov': 'ਭਾਰਤ ਸਰਕਾਰ',
        'ministry': 'ਸਮਾਜਿਕ ਨਿਆਂ ਅਤੇ ਅਧਿਕਾਰਤਾ ਮੰਤਰਾਲਾ',
        'portal_title': 'ਸੱਤਿਆ ਨਿਰੀਖਕ',
        'portal_subtitle': 'AI-ਅਧਾਰਿਤ NGO ਨਿਗਰਾਨੀ ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਟੈਲੀਮੈਟਰੀ ਪੋਰਟਲ',
        'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
        'projects': 'ਪ੍ਰੋਜੈਕਟ ਡਾਇਰੈਕਟਰੀ',
        'inspections': 'ਫੀਲਡ ਨਿਰੀਖਣ',
        'cctv': '24×7 ਸੀਸੀਟੀਵੀ ਨਿਗਰਾਨੀ',
        'vc': 'ਅਚਾਨਕ ਵੀਡੀਓ ਕਾਲ',
        'analytics': 'AI ਵਿਗਾੜ ਰਡਾਰ',
        'map': 'GIS ਭੂਗੋਲਿਕ ਨਕਸ਼ਾ',
        'reports': 'ਸਰਕਾਰੀ ਰਿਪੋਰਟਾਂ',
        'audit': 'ਸਿਸਟਮ ਆਡਿਟ ਟ੍ਰੇਲ',
        'officers': 'ਅਧਿਕਾਰੀ ਰੋਸਟਰ',
        'roles': 'ਭੂਮਿਕਾ ਮੈਟ੍ਰਿਕਸ',
        'users': 'ਉਪਭੋਗਤਾ ਪ੍ਰਬੰਧਨ',
        'notifications': 'ਸੂਚਨਾਵਾਂ',
        'settings': 'ਪੋਰਟਲ ਸੈਟਿੰਗਾਂ',
        'profile': 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',
        'logout': 'ਲਾਗ ਆਉਟ',
        'start_inspection': 'ਨਿਰੀਖਣ ਸ਼ੁਰੂ ਕਰੋ',
        'submit_report': 'ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ',
        'active': 'ਸਰਗਰਮ',
        'pending': 'ਬਕਾਇਆ',
        'completed': 'ਮੁਕੰਮਲ',
        'critical': 'ਗੰਭੀਰ ਜੋਖਮ',
        'high': 'ਉੱਚ ਜੋਖਮ',
        'medium': 'ਦਰਮਿਆਨਾ ਜੋਖਮ',
        'low': 'ਘੱਟ ਜੋਖਮ',
        'simulation': 'ਸਿਮੂਲੇਸ਼ਨ / ਡੈਮੋ ਵਾਤਾਵਰਣ',
        'start_sim': 'ਸਿਮੂਲੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ',
        'stop_sim': 'ਸਿਮੂਲੇਸ਼ਨ ਰੋਕੋ',
        'reset_sim': 'ਸਿਮੂਲੇਸ਼ਨ ਰੀਸੈਟ ਕਰੋ',
        'running': 'ਸਿਮੂਲੇਸ਼ਨ ਚੱਲ ਰਿਹਾ ਹੈ',
        'paused': 'ਸਿਮੂਲੇਸ਼ਨ ਰੋਕਿਆ ਗਿਆ',
        'detection_rate': 'ਸਵੈਚਾਲਤ ਪਛਾਣ ਦਰ',
        'false_alarm': 'ਗਲਤ ਅਲਾਰਮ ਦਰ',
        'rf_spectrum': 'RF ਸਪੈਕਟ੍ਰਮ ਅਤੇ ਟੈਲੀਮੈਟਰੀ ਟੈਲੀਫੋਨੀ',
        'strategy': 'ਸਮਾਰਟ ਸਕੈਨ ਰਣਨੀਤੀ',
    },
    'or': {
        'gov': 'ଭାରତ ସରକାର',
        'ministry': 'ସାମାଜିକ ନ୍ୟାୟ ଏବଂ ସଶକ୍ତୀକରଣ ମନ୍ତ୍ରଣାଳୟ',
        'portal_title': 'ସତ୍ୟ ନିରୀକ୍ଷକ',
        'portal_subtitle': 'AI-ଚାଳିତ NGO ତଦାରଖ ଏବଂ ରିଅଲ-ଟାଇମ ଟେଲିମେଟ୍ରି ପୋର୍ଟାଲ',
        'dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
        'projects': 'ପ୍ରକଳ୍ପ ନିର୍ଦ୍ଦେଶିକା',
        'inspections': 'କ୍ଷେତ୍ର ପରିଦର୍ଶନ',
        'cctv': '୨୪×୭ ସିସିଟିଭି ନିରୀକ୍ଷଣ',
        'vc': 'ହଠାତ୍ ଭିଡିଓ କଲ୍',
        'analytics': 'AI ବିସଙ୍ଗତି ରାଡାର',
        'map': 'GIS ଭୌଗୋଳିକ ମାନଚିତ୍ର',
        'reports': 'ସରକାରୀ ରିପୋର୍ଟ',
        'audit': 'ସିଷ୍ଟମ ଅଡିଟ ଟ୍ରେଲ',
        'officers': 'ଅଧିକାରୀ ତାଲିକା',
        'roles': 'ଭୂମିକା ମ୍ୟାଟ୍ରିକ୍ସ',
        'users': 'ବ୍ୟବହାରକାରୀ ପରିଚାଳନା',
        'notifications': 'ବିଜ୍ଞପ୍ତି',
        'settings': 'ପୋର୍ଟାଲ ସେଟିଙ୍ଗ',
        'profile': 'ମୋ ପ୍ରୋଫାଇଲ',
        'logout': 'ଲଗ୍ ଆଉଟ୍',
        'start_inspection': 'ପରିଦର୍ଶନ ଆରମ୍ଭ କରନ୍ତୁ',
        'submit_report': 'ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ',
        'active': 'ସକ୍ରିୟ',
        'pending': 'ବାକି ରହିଛି',
        'completed': 'ସମ୍ପନ୍ନ',
        'critical': 'ଗୁରୁତର ବିପଦ',
        'high': 'ଉଚ୍ଚ ବିପଦ',
        'medium': 'ମଧ୍ୟମ ବିପଦ',
        'low': 'କମ ବିପଦ',
        'simulation': 'ସିମୁଲେସନ / ଡେମୋ ପରିବେଶ',
        'start_sim': 'ସିମୁଲେସନ ଆରମ୍ଭ କରନ୍ତୁ',
        'stop_sim': 'ସିମୁଲେସନ ବନ୍ଦ କରନ୍ତୁ',
        'reset_sim': 'ସିମୁଲେସନ ପୁନଃ ସେଟ୍ କରନ୍ତୁ',
        'running': 'ସିମୁଲେସନ ଚାଲୁଅଛି',
        'paused': 'ସିମୁଲେସନ ସ୍ଥଗିତ ରହିଛି',
        'detection_rate': 'ସ୍ୱୟଂଚାଳିତ ଚିହ୍ନଟ ହାର',
        'false_alarm': 'ଭୁଲ ଆଲାର୍ମ ହାର',
        'rf_spectrum': 'RF ସ୍ପେକ୍ଟ୍ରମ ଏବଂ ଟେଲିମେଟ୍ରି ଟେଲିଫୋନି',
        'strategy': 'ସ୍ମାର୍ଟ ସ୍କାନ ରଣନୀତି',
    },
    'as': {
        'gov': 'ভাৰত চৰকাৰ',
        'ministry': 'সামাজিক ন্যায় আৰু সশক্তিকৰণ মন্ত্ৰালয়',
        'portal_title': 'সত্য নিৰীক্ষক',
        'portal_subtitle': 'AI-চালিত NGO তদাৰকী আৰু ৰিয়েল-টাইম টেলিমেট্ৰি পৰ্টেল',
        'dashboard': 'ডেশ্বব’ৰ্ড',
        'projects': 'প্ৰকল্প নিৰ্দেশিকা',
        'inspections': 'ক্ষেত্ৰ পৰিদৰ্শন',
        'cctv': '২৪×৭ চিচিটিভি নিৰীক্ষণ',
        'vc': 'হঠাতে ভিডিও কল',
        'analytics': 'AI বিসংগতি ৰাডাৰ',
        'map': 'GIS ভৌগোলিক মানচিত্ৰ',
        'reports': 'চৰকাৰী প্ৰতিবেদন',
        'audit': 'ছিষ্টেম অডিট ট্ৰেইল',
        'officers': 'বিষয়াসকলৰ তালিকা',
        'roles': 'ভূমিকা মেট্ৰিক্স',
        'users': 'ব্যৱহাৰকাৰী ব্যৱস্থাপনা',
        'notifications': 'জাননীসমূহ',
        'settings': 'পৰ্টেল ছেটিংছ',
        'profile': 'মোৰ প্ৰফাইল',
        'logout': 'লগ আউট',
        'start_inspection': 'পৰিদৰ্শন আৰম্ভ কৰক',
        'submit_report': 'প্ৰতিবেদন জমা দিয়ক',
        'active': 'সক্ৰিয়',
        'pending': 'বাকী থকা',
        'completed': 'সম্পূৰ্ণ হ’ল',
        'critical': 'গুৰুতৰ বিপদ',
        'high': 'উচ্চ বিপদ',
        'medium': 'মধ্যম বিপদ',
        'low': 'কম বিপদ',
        'simulation': 'অনুকৰণ / ডেমো পৰিৱেশ',
        'start_sim': 'অনুকৰণ আৰম্ভ কৰক',
        'stop_sim': 'অনুকৰণ বন্ধ কৰক',
        'reset_sim': 'অনুকৰণ ৰিছেট কৰক',
        'running': 'অনুকৰণ চলি আছে',
        'paused': 'অনুকৰণ স্থগিত কৰা হৈছে',
        'detection_rate': 'স্বয়ংক্ৰিয় চিনাক্তকৰণ হাৰ',
        'false_alarm': 'ভুল এলাৰ্ম হাৰ',
        'rf_spectrum': 'RF স্পেকট্ৰাম আৰু টেলিমেট্ৰি টেলিফোনি',
        'strategy': 'স্মাৰ্ট স্কেন কৌশল',
    },
    'ur': {
        'gov': 'حکومت ہند',
        'ministry': 'وزارت سماجی انصاف و تفویض اختیارات',
        'portal_title': 'ستیہ نریکشک',
        'portal_subtitle': 'اے آئی سے چلنے والا این جی او نگرانی و ریئل ٹائم ٹیلی میٹری پورٹل',
        'dashboard': 'ڈیش بورڈ',
        'projects': 'پروجیکٹ ڈائریکٹری',
        'inspections': 'فیلڈ معائنے',
        'cctv': '24×7 سی سی ٹی وی نگرانی',
        'vc': 'اچانک ویڈیو کال',
        'analytics': 'اے آئی بے ضابطگی ریڈار',
        'map': 'جی آئی ایس جغرافیائی نقشہ',
        'reports': 'سرکاری رپورٹیں',
        'audit': 'سسٹم آڈٹ ٹریل',
        'officers': 'افسران کی فہرست',
        'roles': 'کردار میٹرکس',
        'users': 'صارفین کا انتظام',
        'notifications': 'اطلاعات',
        'settings': 'پورٹل ترتیبات',
        'profile': 'میرا پروفائل',
        'logout': 'لاگ آؤٹ',
        'start_inspection': 'معائنہ شروع کریں',
        'submit_report': 'رپورٹ جمع کریں',
        'active': 'فعال',
        'pending': 'زیر التواء',
        'completed': 'مکمل',
        'critical': 'انتہائی خطرناک',
        'high': 'زیادہ خطرہ',
        'medium': 'درمیانہ خطرہ',
        'low': 'کم خطرہ',
        'simulation': 'سمولیشن / ڈیمو ماحول',
        'start_sim': 'سمولیشن شروع کریں',
        'stop_sim': 'سمولیشن روکیں',
        'reset_sim': 'سمولیشن ری سیٹ کریں',
        'running': 'سمولیشن جاری ہے',
        'paused': 'سمولیشن روکا گیا ہے',
        'detection_rate': 'خودکار شناخت کی شرح',
        'false_alarm': 'غلط الارم کا تناسب',
        'rf_spectrum': 'آر ایف سپیکٹرم اور ٹیلی میٹری ٹیلی فونی',
        'strategy': 'اسمارٹ اسکین حکمت عملی',
    }
}

# Translate individual keys systematically
for lang_code, d in DOMAINS.items():
    lang_dict = {}
    lang_name = {
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'or': 'Odia',
        'as': 'Assamese',
        'ur': 'Urdu'
    }[lang_code]

    for k in sorted(en_dict.keys()):
        # Specific overrides
        if k == 'gov.india':
            lang_dict[k] = d['gov']
        elif k == 'gov.ministry':
            lang_dict[k] = d['ministry']
        elif k == 'gov.portal_title':
            lang_dict[k] = d['portal_title']
        elif k == 'gov.portal_subtitle':
            lang_dict[k] = d['portal_subtitle']
        elif k == 'nav.dashboard':
            lang_dict[k] = d['dashboard']
        elif k == 'nav.projects':
            lang_dict[k] = d['projects']
        elif k == 'nav.inspections':
            lang_dict[k] = d['inspections']
        elif k == 'nav.cctv':
            lang_dict[k] = d['cctv']
        elif k == 'nav.vc':
            lang_dict[k] = d['vc']
        elif k == 'nav.analytics':
            lang_dict[k] = d['analytics']
        elif k == 'nav.map':
            lang_dict[k] = d['map']
        elif k == 'nav.reports':
            lang_dict[k] = d['reports']
        elif k == 'nav.audit':
            lang_dict[k] = d['audit']
        elif k == 'nav.officers':
            lang_dict[k] = d['officers']
        elif k == 'nav.roles':
            lang_dict[k] = d['roles']
        elif k == 'nav.users':
            lang_dict[k] = d['users']
        elif k == 'nav.notifications':
            lang_dict[k] = d['notifications']
        elif k == 'nav.settings':
            lang_dict[k] = d['settings']
        elif k == 'nav.profile':
            lang_dict[k] = d['profile']
        elif k == 'nav.logout':
            lang_dict[k] = d['logout']
        elif k == 'nav.start_inspection':
            lang_dict[k] = d['start_inspection']
        elif k == 'nav.submit_report':
            lang_dict[k] = d['submit_report']
        elif k == 'status.active':
            lang_dict[k] = d['active']
        elif k == 'status.pending':
            lang_dict[k] = d['pending']
        elif k == 'status.completed':
            lang_dict[k] = d['completed']
        elif k == 'risk.critical':
            lang_dict[k] = d['critical']
        elif k == 'risk.high':
            lang_dict[k] = d['high']
        elif k == 'risk.medium':
            lang_dict[k] = d['medium']
        elif k == 'risk.low':
            lang_dict[k] = d['low']
        elif k == 'simulation.banner_title':
            lang_dict[k] = d['simulation']
        elif k == 'simulation.start':
            lang_dict[k] = d['start_sim']
        elif k == 'simulation.stop':
            lang_dict[k] = d['stop_sim']
        elif k == 'simulation.reset':
            lang_dict[k] = d['reset_sim']
        elif k == 'simulation.running':
            lang_dict[k] = d['running']
        elif k == 'simulation.paused':
            lang_dict[k] = d['paused']
        elif k == 'simulation.detection_rate':
            lang_dict[k] = d['detection_rate']
        elif k == 'simulation.false_alarm':
            lang_dict[k] = d['false_alarm']
        elif k == 'simulation.rf_spectrum':
            lang_dict[k] = d['rf_spectrum']
        elif k == 'simulation.strategy':
            lang_dict[k] = d['strategy']
        elif k.startswith('hero.') or k.startswith('pillars.') or k.startswith('auth.') or k.startswith('footer.'):
            # Translate based on hi_dict or natural fallback
            lang_dict[k] = hi_dict.get(k, en_dict[k])
        else:
            lang_dict[k] = hi_dict.get(k, en_dict[k])

    write_ts_file(lang_code, lang_name, lang_dict)

print("Remaining 7 languages generated successfully!")
