const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync('src/i18n/extracted_existing.json', 'utf8'));

// Base English dictionary containing existing keys + comprehensive new keys
const enExtra = {
  // Hero section
  'hero.badge': 'Government of India • Ministry of Social Justice and Empowerment',
  'hero.title': 'Satya Nirakshak · National Surveillance & Inspection Command Grid',
  'hero.dept': 'Department of Social Justice and Empowerment (DoSJE)',
  'hero.desc': 'A unified digital oversight portal enabling 24×7 live CCTV monitoring, biometric attendance verification, and on-site field inspections across grant-in-aid institutions nationwide.',
  'hero.super_admin_title': 'Super Admin',
  'hero.super_admin_desc': 'Full national grid control, user roles & audit console',
  'hero.super_admin_login': 'Login as Super Admin',
  'hero.inspector_title': 'Inspection Officers',
  'hero.inspector_desc': 'Surprise video calls, field evidence & audit reports',
  'hero.inspector_login': 'Login as Inspector',
  'hero.district_title': 'District Authorities',
  'hero.district_desc': 'Regional anomaly reviews & grant checks',
  'hero.district_login': 'Login as Authority',
  'hero.ministry_title': 'Central Ministry Apex',
  'hero.ministry_desc': 'National audit, budget & CAG clearance',
  'hero.ministry_login': 'Login as Ministry',

  // Pillars & How it works
  'pillars.title': 'Core Platform Pillars',
  'pillars.subtitle': 'Ensuring total transparency, beneficiary safety, and statutory compliance across India.',
  'pillars.cctv_badge': 'Live Feeds Active',
  'pillars.cctv_title': '24×7 Live CCTV Monitoring',
  'pillars.cctv_desc': 'Secure real-time camera streams and automated anomaly detection across assisted institutions.',
  'pillars.inspections_badge': 'Field Audits Ready',
  'pillars.inspections_title': 'On-Site Field Inspections',
  'pillars.inspections_desc': 'Standardized field audit checklists, GPS-stamped photo evidence, and digital inspection dossiers.',
  'pillars.biometric_badge': 'CAG Compliant',
  'pillars.biometric_title': 'Biometric Attendance Audit',
  'pillars.biometric_desc': 'Aadhaar-authenticated beneficiary headcount reconciliation and CAG-compliant audit trails.',

  // Navigation additions
  'nav.key_modules': 'Key Modules',
  'nav.how_it_works': 'How It Works',
  'nav.surveillance_grid': 'Surveillance Grid',
  'nav.cluster_status': 'Cluster Status',
  'nav.active_grid': 'Active & Verified Grid',
  'nav.system_support': 'System Support / Assistance',
  'nav.operational': '99.99% Operational',

  // Footer additions
  'footer.ministry': 'Ministry of Social Justice and Empowerment · Government of India',
  'footer.subtitle': 'National Surveillance & Inspection Grid',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms & Conditions',
  'footer.copyright': 'Department of Social Justice and Empowerment, Government of India. All Rights Reserved.',
  'footer.compliance': 'GIGW 3.0 & STQC Compliant',
  'footer.node_status': 'NIC Sovereign Grid Online',

  // Auth modal
  'auth.modal_title': 'Government Portal Authorization',
  'auth.modal_subtitle': 'Enter your credentials or choose a pre-configured government role persona to test.',
  'auth.tab_signin': 'Role Persona Sign In',
  'auth.tab_credentials': 'Official Credentials',
  'auth.label_role': 'Designated Role Profile',
  'auth.label_email': 'Official NIC / Gov Email ID',
  'auth.label_password': 'Security Credential / Password',
  'auth.remember_me': 'Remember session on this device',
  'auth.btn_login': 'Authorize & Access Grid',
  'auth.btn_authenticating': 'Verifying NIC Credentials...',
  'auth.test_persona_hint': 'Select any role above for instant 1-click evaluation',
  'auth.security_notice': 'Authorized official access only under IT Act 2000. All sessions are cryptographically logged.',
  'auth.error_invalid': 'Invalid credentials. Please select an authorized government persona.',

  // Simulation & ML / RF Telemetry
  'simulation.banner_title': 'SIMULATION / DEMO ENVIRONMENT',
  'simulation.banner_default': 'Operating in Free-First Demo Mode: CCTV video streams, WebRTC conference channels, and attendance telemetry are simulated for testing without paid infrastructure.',
  'simulation.ai_active': 'Gemini 3.8 Flash & Leaflet active',
  'simulation.start': 'Start Simulation',
  'simulation.stop': 'Stop Simulation',
  'simulation.reset': 'Reset Simulation',
  'simulation.running': 'Simulation Running',
  'simulation.stopped': 'Simulation Stopped',
  'simulation.paused': 'Simulation Paused',
  'simulation.status': 'Simulation Status',
  'simulation.detection_rate': 'Automated Detection Rate',
  'simulation.false_alarm': 'False Alarm Variance',
  'simulation.intercept_time': 'Anomaly Intercept Time',
  'simulation.ai_decision': 'AI Decision Matrix',
  'simulation.rf_spectrum': 'RF Spectrum & Telemetry Telephony',
  'simulation.strategy': 'Smart Scan Strategy',
  'simulation.strategy_desc': 'Dynamic frequency hopping and reinforcement learning for telemetry anomaly interception',
  'simulation.ai_recommendation': 'AI Recommendation',
  'simulation.ai_recommendation_desc': 'Optimal cluster scanning frequency calibrated based on current network telemetry',
  'simulation.activity_log': 'Simulation Activity Log',
  'simulation.telemetry_active': 'Telemetry Streams Synchronized',
  'simulation.cctv_active': 'CCTV Simulation Active: Live RTSP streams rendered via GPU-accelerated HTML5 Canvas with simulated multi-person presence and telemetry watermarks.',
  'simulation.sandbox_toggle': 'Sandbox & Telephony Simulation Mode',
  'simulation.sandbox_desc': 'Allows safe realistic simulation of CCTV heartbeats, VoIP calls, and simulated field officer positions without triggering actual statutory notices.',

  // Charts
  'charts.algorithmic_scoring': 'Algorithmic Scoring',
  'charts.active_portfolios': 'Active Portfolios',
  'charts.projects_count': 'Projects Count',
  'charts.beneficiaries_count': 'Beneficiaries Count',
  'charts.schemes_footer': 'Encompassing PM-AJAY, SMILE, SHREYAS, NAPDDR, & Senior Citizen Welfare Initiatives',
  'charts.count': 'Count',
  'charts.projects': 'Projects',
  'charts.score': 'Score',
  'charts.risk_level': 'Risk Level',

  // Dashboard additions
  'dashboard.critical_entities_title': 'Critical Risk Entities Requiring Oversight',
  'dashboard.critical_entities_desc': 'Facilities flagged by automated biometric variance, CCTV downtime, or overdue audits.',
  'dashboard.view_all_projects': 'View All Projects',
  'dashboard.view_role_report': 'View Role-Specific Report',
  'dashboard.dossier_id': 'Dossier ID',
  'dashboard.scope_ngo': 'Authorized NGO Scope: Center #{id} · Isolated Facility Metrics & Audit Feed',
  'dashboard.scope_inspector': 'Field Inspectorate Scope: Ground Verifications & Random VC in {region}',
  'dashboard.scope_district': 'District Administration Scope: District {district}, State of {state}',
  'dashboard.scope_ministry': 'Programme Directorate: Central Sector PM-AJAY, SMILE & Adarsh Gram Oversight',
  'dashboard.scope_super_admin': 'National Apex Central Monitoring Cell: Consolidated Master Database Oversight (All-India)',
  'dashboard.stat_sub_projects': 'DoSJE Projects',
  'dashboard.stat_sub_cctv': '24×7 Feeds',
  'dashboard.stat_sub_inspections': 'Audits & Visits',
  'dashboard.stat_sub_alerts': 'Compliance Radar',
  'dashboard.gps_verified': 'GPS Verified',

  // App & Language selector
  'app.initializing': 'Initializing Satya Nirakshak...',
  'app.loading_sub': 'Loading secure schemes and telemetry registries.',
  'app.search_placeholder': 'Search projects, officers, facilities, districts...',
  'app.unauthorized_title': 'Access Restricted',
  'app.unauthorized_desc': 'Your current role does not have authorization to view this module.',
  'app.back_to_dashboard': 'Return to Dashboard',
  'app.language_changed': 'Language switched successfully',
  'app.more_languages': 'More Indian Languages (22+ Bhasha Directory)...',
  'app.select_language': 'Select Language',
};

// Full merged English dictionary
const fullEn = { ...existing.en, ...enExtra };

console.log('Total English keys:', Object.keys(fullEn).length);
