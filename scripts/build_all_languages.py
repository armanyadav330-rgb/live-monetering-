import json
import os

with open('src/i18n/extracted_existing.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

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
    for k, v in sorted(lang_dict.items()):
        escaped_v = str(v).replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
        lines.append(f"  '{k}': '{escaped_v}',")
    lines.append("};")
    lines.append(f"export default {lang_code};")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"Wrote {out_path} with {len(lang_dict)} keys")

# Bengali additions
bn_extra = {
  'hero.badge': 'ভারত সরকার • সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রণালয়',
  'hero.title': 'সত্য পরিদর্শক · জাতীয় প্রাতিষ্ঠানিক নজরদারি ও পরিদর্শন কমান্ড গ্রিড',
  'hero.dept': 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন বিভাগ (DoSJE)',
  'hero.desc': 'দেশব্যাপী অনুদানপ্রাপ্ত বৃদ্ধাশ্রম, মাদকমুক্তি কেন্দ্র এবং পুনর্বাসন প্রতিষ্ঠানে ২৪×৭ লাইভ সিসিটিভি নজরদারি, বায়োমেট্রিক উপস্থিতি এবং অন-সাইট পরিদর্শনের ডিজিটাল প্ল্যাটফর্ম।',
  'hero.super_admin_title': 'সুপার অ্যাডমিন',
  'hero.super_admin_desc': 'সম্পূর্ণ জাতীয় গ্রিড নিয়ন্ত্রণ, ব্যবহারকারী ভূমিকা ও অডিট কনসোল',
  'hero.super_admin_login': 'লগইন করুন (সুপার অ্যাডমিন)',
  'hero.inspector_title': 'পরিদর্শন কর্মকর্তা',
  'hero.inspector_desc': 'সারপ্রাইজ ভিডিও কল, ফিল্ড প্রমাণ ও পরিদর্শন রিপোর্ট',
  'hero.inspector_login': 'লগইন করুন (পরিদর্শক)',
  'hero.district_title': 'জেলা সমাজকল্যাণ প্রশাসন',
  'hero.district_desc': 'আঞ্চলিক অসঙ্গতি পর্যালোচনা ও অনুদান যাচাই',
  'hero.district_login': 'লগইন করুন (জেলা কর্তৃপক্ষ)',
  'hero.ministry_title': 'কেন্দ্রীয় মন্ত্রণালয়',
  'hero.ministry_desc': 'জাতীয় অডিট, বাজেট ও সিএজি অনুমোদন',
  'hero.ministry_login': 'লগইন করুন (মন্ত্রণালয়)',

  'pillars.title': 'প্ল্যাটফর্মের মূল স্তম্ভ ও উদ্দেশ্য',
  'pillars.subtitle': 'অনুদানপ্রাপ্ত প্রতিষ্ঠানে সম্পূর্ণ স্বচ্ছতা, নিরাপত্তা ও বিধিবদ্ধ সম্মতি নিশ্চিতকরণ।',
  'pillars.cctv_badge': 'লাইভ সক্রিয়',
  'pillars.cctv_title': '২৪×৭ লাইভ সিসিটিভি নজরদারি',
  'pillars.cctv_desc': 'সহায়তাপ্রাপ্ত প্রতিষ্ঠানসমূহ থেকে সুরক্ষিত লাইভ ক্যামেরা ফিড ও স্বয়ংক্রিয় অসঙ্গতি সতর্কতা।',
  'pillars.inspections_badge': 'অডিট প্রস্তুত',
  'pillars.inspections_title': 'অন-সাইট ডিজিটাল পরিদর্শন',
  'pillars.inspections_desc': 'মানসম্মত ফিল্ড অডিট চেকলিস্ট, জিপিএস-স্ট্যাম্পযুক্ত ছবির প্রমাণ ও ডিজিটাল ডসিয়ার।',
  'pillars.biometric_badge': 'সিএজি অনুগত',
  'pillars.biometric_title': 'বায়োমেট্রিক উপস্থিতি অডিট',
  'pillars.biometric_desc': 'আধার-যাচাইকৃত সুবিধাভোগী গণনা পুনর্মিলন ও সিএজি অনুগত স্বচ্ছ ডিজিটাল রেকর্ড।',

  'nav.key_modules': 'প্রধান মডিউল',
  'nav.how_it_works': 'কার্যপদ্ধতি',
  'nav.surveillance_grid': 'নজরদারি গ্রিড',
  'nav.cluster_status': 'ক্লাস্টার স্থিতি',
  'nav.active_grid': 'সক্রিয় ও যাচাইকৃত গ্রিড',
  'nav.system_support': 'সিস্টেম সহায়তা / যোগাযোগ',
  'nav.operational': '৯৯.৯৯% সক্রিয়',

  'footer.ministry': 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রণালয় · ভারত সরকার',
  'footer.subtitle': 'জাতীয় প্রাতিষ্ঠানিক নজরদারি ও পরিদর্শন গ্রিড',
  'footer.privacy': 'গোপনীয়তা নীতি',
  'footer.terms': 'শর্তাবলী',
  'footer.copyright': 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন বিভাগ, ভারত সরকার। সর্বস্বত্ব সংরক্ষিত।',
  'footer.compliance': 'GIGW ৩.০ এবং STQC অনুগত',
  'footer.node_status': 'এনআইসি সার্বভৌম গ্রিড অনলাইন',

  'auth.modal_title': 'সরকারি পোর্টাল অনুমোদন',
  'auth.modal_subtitle': 'আপনার পরিচয়পত্র লিখুন অথবা মূল্যায়নের জন্য পূর্বনির্ধারিত সরকারি ভূমিকা নির্বাচন করুন।',
  'auth.tab_signin': 'ভূমিকা ভিত্তিক সাইন ইন',
  'auth.tab_credentials': 'অফিসিয়াল পরিচয়পত্র',
  'auth.label_role': 'নির্ধারিত ভূমিকা প্রোফাইল',
  'auth.label_email': 'অফিসিয়াল এনআইসি / সরকারি ইমেইল',
  'auth.label_password': 'নিরাপত্তা পাসওয়ার্ড',
  'auth.remember_me': 'এই ডিভাইসে সেশন মনে রাখুন',
  'auth.btn_login': 'অনুমোদন দিন ও গ্রিডে প্রবেশ করুন',
  'auth.btn_authenticating': 'এনআইসি পরিচয়পত্র যাচাই হচ্ছে...',
  'auth.test_persona_hint': 'তাত্ক্ষণিক ১-ক্লিক মূল্যায়নের জন্য উপরে যেকোনো ভূমিকা নির্বাচন করুন',
  'auth.security_notice': 'আইটি আইন ২০০০ এর অধীনে শুধুমাত্র অনুমোদিত প্রবেশাধিকার। সকল সেশন ক্রিপ্টোগ্রাফিক্যালি লগ করা হয়।',
  'auth.error_invalid': 'ভুল পরিচয়পত্র। অনুগ্রহ করে অনুমোদিত সরকারি ভূমিকা নির্বাচন করুন।',

  'simulation.banner_title': 'সিমুলেশন / ডেমো পরিবেশ',
  'simulation.banner_default': 'ডেমো মোডে পরিচালিত: সিসিটিভি ভিডিও স্ট্রিম, ওয়েবআরটিসি চ্যানেল এবং উপস্থিতি টেলিমেট্রি কোনও অর্থপ্রদত্ত পরিকাঠামো ছাড়াই সিমুলেট করা হয়েছে।',
  'simulation.ai_active': 'জেমিনি ৩.৮ ফ্ল্যাশ ও লিফলেট সক্রিয়',
  'simulation.start': 'সিমুলেশন শুরু করুন',
  'simulation.stop': 'সিমুলেশন বন্ধ করুন',
  'simulation.reset': 'সিমুলেশন রিসেট করুন',
  'simulation.running': 'সিমুলেশন চলছে',
  'simulation.stopped': 'সিমুলেশন বন্ধ আছে',
  'simulation.paused': 'সিমুলেশন স্থগিত',
  'simulation.status': 'সিমুলেশন অবস্থা',
  'simulation.detection_rate': 'স্বয়ংক্রিয় সনাক্তকরণ হার',
  'simulation.false_alarm': 'মিথ্যা অ্যালার্ম হার',
  'simulation.intercept_time': 'অসঙ্গতি সনাক্তকরণের সময়',
  'simulation.ai_decision': 'এআই সিদ্ধান্ত ম্যাট্রিক্স',
  'simulation.rf_spectrum': 'আরএফ স্পেকট্রাম ও টেলিমেট্রি টেলিফোনি',
  'simulation.strategy': 'স্মার্ট স্ক্যান কৌশল',
  'simulation.strategy_desc': 'টেলিমেট্রি অসঙ্গতি সনাক্তকরণের জন্য গতিশীল ফ্রিকোয়েন্সি হপিং ও রিইনফোর্সমেন্ট লার্নিং',
  'simulation.ai_recommendation': 'এআই সুপারিশ',
  'simulation.ai_recommendation_desc': 'বর্তমান নেটওয়ার্ক টেলিমেট্রির ভিত্তিতে ক্যালিব্রেট করা সর্বোত্তম স্ক্যানিং ফ্রিকোয়েন্সি',
  'simulation.activity_log': 'সিমুলেশন কার্যকলাপ লগ',
  'simulation.telemetry_active': 'টেলিমেট্রি স্ট্রিম সিঙ্ক্রোনাইজড',
  'simulation.cctv_active': 'সিসিটিভি সিমুলেশন সক্রিয়: জিপিইউ-ত্বরিত এইচটিএমএল৫ ক্যানভাস দ্বারা লাইভ আরটিএসপি স্ট্রিম পরিবেশিত।',
  'simulation.sandbox_toggle': 'স্যান্ডবক্স ও টেলিফোনি সিমুলেশন মোড',
  'simulation.sandbox_desc': 'প্রকৃত নোটিশ জারি না করে সিসিটিভি হার্টবিট, ভিওআইপি কল ও ফিল্ড অফিসারদের বাস্তবসম্মত সিমুলেশনের অনুমতি দেয়।',

  'charts.algorithmic_scoring': 'অ্যালগরিদমিক স্কোরিং',
  'charts.active_portfolios': 'সক্রিয় পোর্টফোলিও',
  'charts.projects_count': 'প্রকল্প সংখ্যা',
  'charts.beneficiaries_count': 'সুবিধাভোগী সংখ্যা',
  'charts.schemes_footer': 'পিএম-অজয়, স্মাইল, শ্রেয়াস ও সিনিয়র সিটিজেন কল্যাণ প্রকল্প অন্তর্ভুক্ত',
  'charts.count': 'গণনা',
  'charts.projects': 'প্রকল্পসমূহ',
  'charts.score': 'স্কোর',
  'charts.risk_level': 'ঝুঁকি স্তর',

  'dashboard.critical_entities_title': 'তদারকির জন্য জরুরি উচ্চ-ঝুঁকির প্রতিষ্ঠান',
  'dashboard.critical_entities_desc': 'বায়োমেট্রিক অমিল, সিসিটিভি ডাউনটাইম বা বিলম্বিত অডিটযুক্ত প্রতিষ্ঠান।',
  'dashboard.view_all_projects': 'সকল প্রকল্প দেখুন',
  'dashboard.view_role_report': 'ভূমিকা-নির্দিষ্ট রিপোর্ট দেখুন',
  'dashboard.dossier_id': 'ডসিয়ার আইডি',
  'dashboard.scope_ngo': 'অনুমোদিত এনজিও পরিধি: কেন্দ্র #{id} · পৃথক প্রতিষ্ঠান মেট্রিক্স ও অডিট ফিড',
  'dashboard.scope_inspector': 'ফিল্ড ইন্সপেক্টর পরিধি: {region} অঞ্চলে মাঠ যাচাই ও সারপ্রাইজ ভিসি',
  'dashboard.scope_district': 'জেলা প্রশাসন পরিধি: {district} জেলা, {state} রাজ্য',
  'dashboard.scope_ministry': 'কর্মসূচি অধিদপ্তর: কেন্দ্রীয় খাত পিএম-অজয়, স্মাইল ও আদর্শ গ্রাম তদারকি',
  'dashboard.scope_super_admin': 'জাতীয় শীর্ষ কেন্দ্রীয় পর্যবেক্ষণ সেল: সমন্বিত মাস্টার ডেটাবেস তদারকি (সর্বভারতীয়)',
  'dashboard.stat_sub_projects': 'সামাজিক ন্যায়বিচার প্রকল্প',
  'dashboard.stat_sub_cctv': '২৪×৭ লাইভ ফিড',
  'dashboard.stat_sub_inspections': 'অডিট ও পরিদর্শন',
  'dashboard.stat_sub_alerts': 'সম্মতি রাডার',
  'dashboard.gps_verified': 'জিপিএস যাচাইকৃত',

  'app.initializing': 'সত্য পরিদর্শক শুরু হচ্ছে...',
  'app.loading_sub': 'নিরাপদ স্কিম ও টেলিমেট্রি রেজিস্ট্রি লোড হচ্ছে।',
  'app.search_placeholder': 'প্রকল্প, কর্মকর্তা, প্রতিষ্ঠান, জেলা খুঁজুন...',
  'app.unauthorized_title': 'প্রবেশাধিকার সীমাবদ্ধ',
  'app.unauthorized_desc': 'আপনার বর্তমান ভূমিকার এই মডিউল দেখার অনুমতি নেই।',
  'app.back_to_dashboard': 'ড্যাশবোর্ডে ফিরে যান',
  'app.language_changed': 'ভাষা সফলভাবে পরিবর্তন করা হয়েছে',
  'app.more_languages': 'আরও ভারতীয় ভাষা (২২+ ভাষা ডিরেক্টরি)...',
  'app.select_language': 'ভাষা নির্বাচন করুন',
}

full_bn = { **existing['bn'], **bn_extra }
write_ts_file('bn', 'Bengali', full_bn)

print("Bengali completed.")
