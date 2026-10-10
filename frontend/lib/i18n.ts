export type Locale = 'en' | 'hi' | 'gu'

const phrases: Record<string, [string, string, string]> = {
  // Brand & Taglines
  tagline: ['Better decisions. Better harvests.', 'बेहतर निर्णय। बेहतर फसल।', 'વધુ સારા નિર્ણયો. વધુ સારી ઉપજ.'],
  hero1: ['Know where to sell.', 'जानें कहाँ बेचें।', 'જાણો ક્યાં વેચવું.'],
  hero2: ['Know when to sell.', 'जानें कब बेचें।', 'જાણો ક્યારે વેચવું.'],
  hero3: ['Know what you’ll', 'जानें आपको वास्तव में', 'જાણો તમને ખરેખર'],
  hero4: ['actually earn.', 'कितना मिलेगा।', 'કેટલું મળશે.'],
  heroBody: [
    'Your hard work deserves a better return. Compare markets, understand the costs, and find the right buyers — all in one place.',
    'आपकी मेहनत का बेहतर मूल्य मिलना चाहिए। मंडियों की तुलना करें, लागत समझें और सही खरीदार खोजें — एक ही जगह।',
    'તમારી મહેનતને વધુ સારું વળતર મળવું જોઈએ. બજારો સરખાવો, ખર્ચ સમજો અને યોગ્ય ખરીદદારો શોધો — એક જ જગ્યાએ.',
  ],
  findMarket: ['Find the best market', 'सबसे अच्छी मंडी खोजें', 'શ્રેષ્ઠ બજાર શોધો'],
  how: ['How it works', 'यह कैसे काम करता है', 'આ કેવી રીતે કામ કરે છે'],
  watchHow: ['See how it works', 'देखें यह कैसे काम करता है', 'જુઓ કેવી રીતે કામ કરે છે'],
  farmers: ['For farmers', 'किसानों के लिए', 'ખેડૂતો માટે'],
  fpos: ['For FPOs', 'FPO के लिए', 'FPO માટે'],
  about: ['About us', 'हमारे बारे में', 'અમારા વિશે'],
  signIn: ['Sign in', 'साइन इन', 'સાઇન ઇન'],
  getStarted: ['Get started', 'शुरू करें', 'શરૂ કરો'],
  freeExplore: ['Free to explore', 'मुफ़्त में देखें', 'મફતમાં શોધો'],
  builtIndia: ['Built for Indian agriculture', 'भारतीय कृषि के लिए', 'ભારતીય કૃષિ માટે'],
  yourLanguage: ['In your language', 'आपकी भाषा में', 'તમારી ભાષામાં'],

  // Navigation & Shell Headers
  Home: ['Home', 'होम', 'હોમ'],
  Overview: ['Overview', 'सारांश', 'ઝાંખી'],
  Market: ['Market', 'मंडी', 'બજાર'],
  Markets: ['Markets', 'मंडियाँ', 'બજારો'],
  'My Produce': ['My Produce', 'मेरी फसलें', 'મારો પાક'],
  'My lots': ['My lots', 'मेरे लॉट', 'મારા લોટ'],
  Lots: ['Lots', 'लॉट', 'લોટ'],
  Buyers: ['Buyers', 'खरीदार', 'ખરીદદારો'],
  'Find Buyers': ['Find Buyers', 'खरीदार खोजें', 'ખરીદદારો શોધો'],
  Offers: ['Offers', 'प्रस्ताव', 'પ્રસ્તાવો'],
  Logistics: ['Logistics', 'परिवहन', 'લોજિસ્ટિક્સ'],
  Transactions: ['Transactions', 'लेन-देन', 'વ્યવહારો'],
  Alerts: ['Alerts', 'सूचनाएँ', 'સૂચનાઓ'],
  Profile: ['Profile', 'प्रोफ़ाइल', 'પ્રોફાઇલ'],
  Settings: ['Settings', 'सेटिंग्स', 'સેટિંગ્સ'],
  Logout: ['Logout', 'लॉग आउट', 'લોગ આઉટ'],

  // FPO Navigation Labels
  Procurement: ['Procurement', 'खरीद प्रबंधन', 'ખરીદી સંચાલન'],
  'Aggregated Lots': ['Aggregated Lots', 'एकत्रित लॉट', 'એકત્રિત લોટ'],
  'Buyer Match': ['Buyer Match', 'खरीदार मिलान', 'ખરીદદાર મેચ'],
  'Settlements & Bahi': ['Settlements & Bahi', 'हिसाब व किसान बही', 'હિસાબ અને કિસાન વહી'],

  // Workspaces
  'Farmer Workspace': ['Farmer Workspace', 'किसान कार्यक्षेत्र', 'ખેડૂત કાર્યક્ષેત્ર'],
  'FPO Manager Workspace': ['FPO Manager Workspace', 'FPO प्रबंधक कार्यक्षेत्र', 'FPO મેનેજર કાર્યક્ષેત્ર'],
  'KrishiIntel Console': ['KrishiIntel Console', 'कृषिइंटेल कंसोल', 'કૃષિઇન્ટેલ કન્સોલ'],
  'ADMIN ACCESS': ['ADMIN ACCESS', 'व्यवस्थापक पहुंच', 'એડમિન ઍક્સેસ'],
  'Farmer Decision Dashboard': ['Farmer Decision Dashboard', 'किसान निर्णय डैशबोर्ड', 'ખેડૂત નિર્ણય ડેશબોર્ડ'],
  'FPO Co-operative Operations Console': ['FPO Co-operative Operations Console', 'FPO सहकारी संचालन कंसोल', 'FPO સહકારી સંચાલન કન્સોલ'],
  'Good Morning': ['Good Morning', 'शुभ प्रभात', 'શુભ સવાર'],
  'harvestStatusDesc': ['Here is your harvest status and today\'s top market selling recommendations.', 'यहाँ आपकी फसल की स्थिति और आज की बिक्री सिफारिशें हैं।', 'અહીં તમારા પાકની સ્થિતિ અને આજની વેચાણ ભલામણો છે.'],
  'fpoConsoleDesc': ['Aggregating member produce, managing procurement workflows, and matching bulk institutional buyers.', 'सदस्य उपज का एकत्रीकरण, खरीद का प्रबंधन और थोक खरीदारों से मिलान।', 'સભ્ય પાકનું એકત્રીકરણ, ખરીદી સંચાલન અને જથ્થાબંધ ખરીદદારો સાથે મેચ.'],
  '+ Add New Harvest Lot': ['+ Add New Harvest Lot', '+ नया फसल लॉट जोड़ें', '+ નવો પાક લોટ ઉમેરો'],
  'Manage Procurement': ['Manage Procurement', 'खरीद का प्रबंधन करें', 'ખરીદી સંચાલન કરો'],

  // Question Cards & Dashboards
  'WHAT DO I HAVE?': ['WHAT DO I HAVE?', 'मेरे पास क्या है?', 'મારી પાસે શું છે?'],
  'WHERE TO SELL?': ['WHERE TO SELL?', 'कहाँ बेचें?', 'ક્યાં વેચવું?'],
  'ESTIMATED NET IN-HAND': ['ESTIMATED NET IN-HAND', 'अनुमानित शुद्ध प्राप्ति', 'અંદાજિત ચોખ્ખું વળતર'],
  'BUYER OFFERS': ['BUYER OFFERS', 'खरीदार प्रस्ताव', 'ખરીદદાર પ્રસ્તાવો'],
  'No Ready Produce': ['No Ready Produce', 'कोई तैयार उपज नहीं', 'કોઈ તૈયાર પાક નથી'],
  'Register your first lot': ['Register your first lot', 'अपना पहला लॉट पंजीकृत करें', 'તમારો પહેલો લોટ નોંધાવો'],
  'View My Produce Lots': ['View My Produce Lots', 'मेरे फसल लॉट देखें', 'મારા પાક લોટ જુઓ'],
  'Compare Mandi Realizations': ['Compare Mandi Realizations', 'मंडी प्राप्ति की तुलना करें', 'બજાર વળતર સરખાવો'],
  'After transport & handling deductions': ['After transport & handling deductions', 'परिवहन व हमाली कटौती के बाद', 'વહન અને હમાલી કપાત પછી'],
  'View Calculation Breakdown': ['View Calculation Breakdown', 'गणना विवरण देखें', 'ગણતરી વિગતો જુઓ'],
  'Active Offers': ['Active Offers', 'सक्रिय प्रस्ताव', 'સક્રિય પ્રસ્તાવો'],
  'Waiting for buyer offers': ['Waiting for buyer offers', 'खरीदार प्रस्तावों की प्रतीक्षा है', 'ખરીદદાર પ્રસ્તાવોની રાહ જોઈ રહ્યા છીએ'],
  'Review Buyer Offers': ['Review Buyer Offers', 'प्रस्ताव समीक्षा करें', 'પ્રસ્તાવોની સમીક્ષા કરો'],

  // Market Analysis Section
  'Market Intelligence & Mandi Comparison': ['Market Intelligence & Mandi Comparison', 'मंडी बुद्धिमत्ता व तुलना', 'બજાર બુદ્ધિમત્તા અને સરખામણી'],
  'Net Realization Calculator Query': ['Net Realization Calculator Query', 'शुद्ध प्राप्ति कैलकुलेटर', 'ચોખ્ખું વળતર કેલ્ક્યુલેટર'],
  'Run Market Analysis': ['Run Market Analysis', 'मंडी का विश्लेषण करें', 'બજારનું વિશ્લેષણ કરો'],
  'APMC Mandi Net Realization Comparison': ['APMC Mandi Net Realization Comparison', 'एपीएमसी मंडी शुद्ध प्राप्ति तुलना', 'APMC બજાર ચોખ્ખું વળતર સરખામણી'],
  'Ranked by highest net cash return in your pocket.': ['Ranked by highest net cash return in your pocket.', 'आपकी जेब में उच्चतम शुद्ध नकद प्राप्ति के आधार पर श्रेणीबद्ध।', 'તમારા ખિસ્સામાં સૌથી વધુ ચોખ્ખી રોકડ રકમના આધારે વર્ગીકૃત.'],
  'Markets Evaluated': ['Markets Evaluated', 'मंडियों का मूल्यांकन', 'બજારોનું મૂલ્યાંકન'],
  'Mandi Name': ['Mandi Name', 'मंडी का नाम', 'બજારનું નામ'],
  Distance: ['Distance', 'दूरी', 'અંતર'],
  'Gross Rate (/qtl)': ['Gross Rate (/qtl)', 'सकल दर (/क्विंटल)', 'કુલ ભાવ (/ક્વિન્ટલ)'],
  'Freight Deduction': ['Freight Deduction', 'भाड़ा कटौती', 'ભાડું કપાત'],
  'Cess & Handling': ['Cess & Handling', 'सेस व हमाली', 'શેસ અને હમાલી'],
  'Opportunity Score': ['Opportunity Score', 'अवसर स्कोर', 'તક સ્કોર'],
  'Estimated Net In-Hand': ['Estimated Net In-Hand', 'अनुमानित शुद्ध प्राप्ति', 'અંદાજિત ચોખ્ખું વળતર'],
  Action: ['Action', 'कार्रवाई', 'પગલાં'],
  'BEST CHOICE': ['BEST CHOICE', 'सर्वश्रेष्ठ विकल्प', 'શ્રેષ્ઠ વિકલ્પ'],
  'Kisan Bahi Slip': ['Kisan Bahi Slip', 'किसान बही पर्ची', 'કિસાન વહી સ્લિપ'],

  // Opportunity Score & Advice
  'Opportunity Score Breakdown': ['Opportunity Score Breakdown', 'अवसर स्कोर विवरण', 'તક સ્કોર વિગતો'],
  'scoringModelDesc': ['Our scoring model evaluates 5 transparent metrics rather than a hidden AI score:', 'हमारा मॉडल छिपे हुए AI स्कोर के बजाय 5 पारदर्शी मानकों का मूल्यांकन करता है:', 'અમારું મોડેલ છુપાયેલા AI સ્કોરના બદલે 5 પારદર્શક ધોરણોનું મૂલ્યાંકન કરે છે:'],
  'Price Signal Strength': ['Price Signal Strength', 'मूल्य संकेत शक्ति', 'ભાવ સંકેત શક્તિ'],
  'Buyer Availability': ['Buyer Availability', 'खरीदार उपलब्धता', 'ખરીદદાર ઉપલબ્ધતા'],
  'Logistics Convenience': ['Logistics Convenience', 'परिवहन सुविधा', 'લોજિસ્ટિક્સ સુવિધા'],
  'Sell Now vs. Wait Advice': ['Sell Now vs. Wait Advice', 'अभी बेचें बनाम प्रतीक्षा सलाह', 'હમણાં વેચો વિરુદ્ધ રાહ જોવાની સલાહ'],
  'Recommendation:': ['Recommendation:', 'सिफारिश:', 'ભલામણ:'],
  'Disclaimer:': ['Disclaimer:', 'अस्वीकरण:', 'અસ્વીકરણ:'],

  // Web Evidence & News Signals
  'Supporting Web Market Evidence & News Signals': ['Supporting Web Market Evidence & News Signals', 'वेब मंडी साक्ष्य व समाचार संकेत', 'વેબ બજાર પુરાવા અને સમાચાર સંકેતો'],
  'Verify Source': ['Verify Source', 'स्रोतः सत्यापित करें', 'સ્રોત ચકાસો'],
  'GOOGLE NEWS': ['GOOGLE NEWS', 'गूगल समाचार', 'ગુગલ ન્યૂઝ'],
  'GOOGLE SEARCH': ['GOOGLE SEARCH', 'गूगल खोज', 'ગુગલ સર્ચ'],
  'DEMO SIGNAL': ['DEMO SIGNAL', 'डेमो संकेत', 'ડેમો સંકેત'],

  // FPO Dashboard Metric Cards & Action Tiles
  'MEMBER FARMERS': ['MEMBER FARMERS', 'सदस्य किसान', 'સભ્ય ખેડૂતો'],
  'TOTAL PRODUCE VOLUME': ['TOTAL PRODUCE VOLUME', 'कुल उपज मात्रा', 'કુલ પાક જથ્થો'],
  'ACTIVE BUYER OFFERS': ['ACTIVE BUYER OFFERS', 'सक्रिय खरीदार प्रस्ताव', 'સક્રિય ખરીદદાર પ્રસ્તાવો'],
  'FLEET IN TRANSIT': ['FLEET IN TRANSIT', 'परिवहन में बेड़ा', 'રસ્તામાં રહેલ વાહનો'],
  'Active Co-op Members': ['Active Co-op Members', 'सक्रिय सहकारी सदस्य', 'સક્રિય સહકારી સભ્યો'],
  'Harvest Lots Pooled': ['Harvest Lots Pooled', 'एकत्रित फसल लॉट', 'એકત્રિત પાક લોટ'],
  'Bulk Institutional Demand': ['Bulk Institutional Demand', 'थोक संस्थागत मांग', 'જથ્થાબંધ સંસ્થાકીય માંગ'],
  'APMC Dispatches Tracked': ['APMC Dispatches Tracked', 'मंडी प्रेषण ट्रैकिंग', 'બજાર ટ્રેક વાહનો'],
  'Member Procurement': ['Member Procurement', 'सदस्य खरीद', 'સભ્ય ખરીદી'],
  'Lot Aggregation & Pooling': ['Lot Aggregation & Pooling', 'लॉट एकत्रीकरण व पूलिंग', 'લોટ એકત્રીકરણ અને પૂલિંગ'],
  'WhatsApp Realization Ledger': ['WhatsApp Realization Ledger', 'व्हाट्सएप बही खाता', 'વોટ્સએપ વહી ખાતું'],
  'Open Procurement Queue': ['Open Procurement Queue', 'खरीद कतार खोलें', 'ખરીદી ક્યૂ ખોલો'],
  'Manage Aggregated Pools': ['Manage Aggregated Pools', 'एकत्रित पूल प्रबंधित करें', 'એકત્રિત પૂલ સંચાલિત કરો'],
  'Generate Shared Ledger': ['Generate Shared Ledger', 'साझा बही बनाएँ', 'સામાજિક વહી બનાવો'],
  'Recent Member Farmer Harvest Submissions': ['Recent Member Farmer Harvest Submissions', 'हालिया किसान फसल जमा', 'તાજેતરના ખેડૂત પાક લોટ'],
  'View All Lots': ['View All Lots', 'सभी लॉट देखें', 'બધા લોટ જુઓ'],
  'Lot Number': ['Lot Number', 'लॉट संख्या', 'લોટ નંબર'],
  'Farmer Name': ['Farmer Name', 'किसान का नाम', 'ખેડૂતનું નામ'],
  'Grade Quality': ['Grade Quality', 'गुणवत्ता ग्रेड', 'ગુણવત્તા ગ્રેડ'],

  // Admin Navigation & Metrics
  'User Directory': ['User Directory', 'उपयोगकर्ता निर्देशिका', 'વપરાશકર્તા ડિરેક્ટરી'],
  Farmers: ['Farmers', 'किसान', 'ખેડૂતો'],
  FPOs: ['FPOs', 'एफपीओ', 'FPO'],
  'Harvest Lots': ['Harvest Lots', 'फसल लॉट', 'પાક લોટ'],
  'Fleet Live Track': ['Fleet Live Track', 'लाइव बेड़ा ट्रैकिंग', 'લાઇવ વાહન ટ્રેકિંગ'],
  'Audit Logs': ['Audit Logs', 'सुरक्षा ऑडिट लॉग', 'સુરક્ષા ઓડિટ લૉગ્સ'],
  'System Health': ['System Health', 'सिस्टम स्थिति', 'સિસ્ટમ હેલ્થ'],
  'Platform Governance Overview': ['Platform Governance Overview', 'मंच प्रशासन अवलोकन', 'પ્લેટફોર્મ ગવર્નન્સ ઝાંખી'],
  'Live database transaction metrics, active user distribution, fleet tracking, and security audit logs.': [
    'Live database transaction metrics, active user distribution, fleet tracking, and security audit logs.',
    'लाइव डेटाबेस मेट्रिक्स, उपयोगकर्ता वितरण, बेड़ा ट्रैकिंग और सुरक्षा ऑडिट लॉग।',
    'લાઇવ ડેટાબેઝ મેટ્રિક્સ, વપરાશકર્તા વિતરણ, વાહન ટ્રેકિંગ અને સુરક્ષા ઓડિટ લૉગ્સ.',
  ],
  'Check System Health': ['Check System Health', 'सिस्टम स्थिति जांचें', 'સિસ્ટમ ચકાસો'],
  'TOTAL REGISTERED USERS': ['TOTAL REGISTERED USERS', 'कुल पंजीकृत उपयोगकर्ता', 'કુલ નોંધાયેલા વપરાશકર્તાઓ'],
  'VERIFIED BUYERS': ['VERIFIED BUYERS', 'सत्यापित खरीदार', 'ચકાસાયેલ ખરીદદારો'],
  'POOLED PRODUCE VOLUME': ['POOLED PRODUCE VOLUME', 'एकत्रित उपज मात्रा', 'એકત્રિત પાક જથ્થો'],
  'TRANSACTION VALUE': ['TRANSACTION VALUE', 'कुल लेन-देन मूल्य', 'કુલ વ્યવહાર મૂલ્ય'],
  'Recent Security Audit Logs': ['Recent Security Audit Logs', 'हालिया सुरक्षा ऑडिट लॉग', 'તાજેતરના સુરક્ષા ઓડિટ લૉગ્સ'],
  'View Full Audit Trail': ['View Full Audit Trail', 'पूरा ऑडिट देखें', 'સંપૂર્ણ ઓડિટ જુઓ'],

  // SerpApi Badges & Data Sources
  'LIVE WEB EVIDENCE': ['LIVE WEB EVIDENCE', 'लाइव वेब साक्ष्य', 'લાઇવ વેબ પુરાવા'],
  'CACHED WEB EVIDENCE': ['CACHED WEB EVIDENCE', 'कैश किया गया वेब साक्ष्य', 'કેશ કરેલ વેબ પુરાવા'],
  'OFFICIAL MARKET DATA': ['OFFICIAL MARKET DATA', 'आधिकारिक मंडी डेटा', 'સત્તાવાર બજાર માહિતી'],
  'DEMO DATA': ['DEMO DATA', 'डेमो डेटा', 'ડેમો માહિતી'],
  'ESTIMATED VALUE': ['ESTIMATED VALUE', 'अनुमानित मूल्य', 'અંદાજિત મૂલ્ય'],
  'CANDIDATE ONLY': ['CANDIDATE ONLY', 'केवल उम्मीदवार', 'માત્ર ઉમેદવાર'],
  UNVERIFIED: ['UNVERIFIED', 'असत्यापित', 'અચકાસાયેલ'],
  VERIFIED: ['VERIFIED', 'सत्यापित', 'ચકાસાયેલ'],

  // Opportunity Score Badges
  'Top Net Realization': ['Top Net Realization', 'सर्वश्रेष्ठ निवल प्राप्ति', 'ઉચ્ચતમ ચોખ્ખું વળતર'],
  'Balanced Option': ['Balanced Option', 'संतुलित विकल्प', 'સંતુલિત વિકલ્પ'],
  'High Transit Loss Risk': ['High Transit Loss Risk', 'उच्च परिवहन क्षति जोखिम', 'ઉચ્ચ વહન નુકસાન જોખમ'],
  Recommended: ['Recommended', 'अनुशंसित', 'ભલામણ કરેલ'],

  // Authentication Screens
  'Account Authentication': ['Account Authentication', 'खाता प्रमाणीकरण', 'ખાતા ચકાસણી'],
  'Sign in to access your role-specific agricultural workspace.': [
    'Sign in to access your role-specific agricultural workspace.',
    'अपने भूमिका-विशिष्ट कृषि कार्यक्षेत्र में पहुंच के लिए साइन इन करें।',
    'તમારા કાર્યક્ષેત્રમાં પ્રવેશવા માટે સાઇન ઇન કરો.',
  ],
  'Selected Role:': ['Selected Role:', 'चयनित भूमिका:', 'પસંદ કરેલ ભૂમિકા:'],
  'Mobile Number / Email Address': ['Mobile Number / Email Address', 'मोबाइल नंबर / ईमेल आईडी', 'મોબાઈલ નંબર / ઈમેલ સરનામું'],
  Password: ['Password', 'पासवर्ड', 'પાસવર્ડ'],
  'Login as FARMER': ['Login as FARMER', 'किसान के रूप में लॉग इन करें', 'ખેડૂત તરીકે લોગ ઈન કરો'],
  'Login as FPO MANAGER': ['Login as FPO MANAGER', 'FPO प्रबंधक के रूप में लॉग इन करें', 'FPO મેનેજર તરીકે લોગ ઈન કરો'],
  'Login as ADMIN': ['Login as ADMIN', 'व्यवस्थापक के रूप में लॉग इन करें', 'એડમિન તરીકે લોગ ઈન કરો'],
  "Don't have an account yet? Create Account": [
    "Don't have an account yet? Create Account",
    'खाता नहीं है? नया खाता बनाएँ',
    'ખાતું નથી? નવું ખાતું બનાવો',
  ],
  'Change Role Selection': ['Change Role Selection', 'भूमिका बदलें', 'ભૂમિકા બદલો'],

  // Registration & User Inputs
  'Full Name': ['Full Name', 'पूरा नाम', 'પૂરું નામ'],
  'Mobile Number': ['Mobile Number', 'मोबाइल नंबर', 'મોબાઈલ નંબર'],
  'District / City': ['District / City', 'जिला / शहर', 'જીલ્લો / શહેર'],
  State: ['State', 'राज्य', 'રાજ્ય'],
  'Total Land (Acres)': ['Total Land (Acres)', 'कुल भूमि (एकड़)', 'કુલ જમીન (એકર)'],
  'FPO Name': ['FPO Name', 'FPO का नाम', 'FPO નું નામ'],
  'FPO Registration Number': ['FPO Registration Number', 'FPO पंजीकरण संख्या', 'FPO નોંધણી નંબર'],
  Register: ['Register', 'पंजीकरण करें', 'રજીસ્ટર કરો'],

  // Crops & Units
  Tomato: ['Tomato', 'टमाटर', 'ટામેટાં'],
  Onion: ['Onion', 'प्याज', 'ડુંગળી'],
  Potato: ['Potato', 'आलू', 'બટાકા'],
  Wheat: ['Wheat', 'गेहूँ', 'ઘઉં'],
  Cotton: ['Cotton', 'कपास', 'કપાસ'],
  Groundnut: ['Groundnut', 'मूंगफली', 'મગફળી'],
  Mustard: ['Mustard', 'सरसों', 'રાયડો'],
  Crop: ['Crop', 'फसल', 'પાક'],
  Quantity: ['Quantity', 'मात्रा', 'જથ્થો'],
  Location: ['Location', 'स्थान', 'સ્થાન'],
  Grade: ['Grade', 'ग्रेड', 'ગ્રેડ'],
  Quintal: ['Quintal (100 kg)', 'क्विंटल (100 किग्रा)', 'ક્વિન્ટલ (100 કિલો)'],
  kg: ['kg', 'किग्रा', 'કિલો'],

  // Common UI Buttons & Labels
  'Analyze market': ['Analyze market', 'मंडी का विश्लेषण करें', 'બજારનું વિશ્લેષણ કરો'],
  'Search buyers or locations': ['Search buyers or locations', 'खरीदार या स्थान खोजें', 'ખરીદદારો કે સ્થાન શોધો'],
  Status: ['Status', 'स्थिति', 'સ્થિતિ'],
  Actions: ['Actions', 'कार्रवाई', 'પગલાં'],
  Active: ['Active', 'सक्रिय', 'સક્રિય'],
  Pending: ['Pending', 'लंबित', 'બાકી'],
  Accepted: ['Accepted', 'स्वीकृत', 'સ્વીકારેલ'],
  Rejected: ['Rejected', 'अस्वीकृत', 'નકારેલ'],
  Completed: ['Completed', 'पूर्ण', 'પૂર્ણ'],
  Save: ['Save', 'सहेजें', 'સાચવો'],
  Cancel: ['Cancel', 'रद्द करें', 'રદ કરો'],
  Refresh: ['Refresh', 'रिफ्रेश करें', 'રીફ્રેશ કરો'],
  Details: ['Details', 'विवरण', 'વિગતો'],
  View: ['View', 'देखें', 'જુઓ'],
  Edit: ['Edit', 'संपादित करें', 'ફેરફાર કરો'],

  // Net Realization Breakdown Terms
  'Gross Sale Value': ['Gross Sale Value', 'सकल बिक्री मूल्य', 'કુલ વેચાણ મૂલ્ય'],
  'Transport Freight': ['Transport Freight', 'परिवहन भाड़ा', 'પરિવહન ભાડું'],
  'Handling & Loading Fees': ['Handling & Loading Fees', 'हमाली और लोडिंग शुल्क', 'હમાલી અને લોડિંગ ચાર્જ'],
  'APMC Mandi Cess': ['APMC Mandi Cess', 'मंडी शुल्क (सेस)', 'બજાર સમિતિ શેસ'],
  'Moisture & Spoilage Loss': ['Moisture & Spoilage Loss', 'नमी व पारगमन क्षति', 'ભેજ અને બગાડ નુકસાન'],
  'Net In-Hand Return': ['Net In-Hand Return', 'शुद्ध हाथ में प्राप्ति', 'ચોખ્ખું હાથમાં વળતર'],

  // Buyer Types
  Wholesaler: ['Wholesaler', 'थोक विक्रेता', 'જથ્થાબંધ વેપારી'],
  Trader: ['Trader', 'व्यापारी', 'વેપારી'],
  Processor: ['Processor', 'प्रसंस्करणकर्ता', 'પ્રોસેસર'],
  Retailer: ['Retailer', 'खुदरा विक्रेता', 'રિટેલર'],

  // Footer & Misc
  footerDesc: ['Market clarity. From the ground up.', 'ज़मीन से जुड़ी मंडी की समझ।', 'જમીનથી જોડાયેલી બજારની સમજ.'],
  rights: [
    '© 2026 KrishiIntel. Made for the people who grow.',
    '© 2026 KrishiIntel. अन्नदाताओं के लिए।',
    '© 2026 KrishiIntel. ઉગાડનારાઓ માટે।',
  ],
}

export function translate(key: string, locale: Locale): string {
  if (!key) return ''
  const trimmed = key.trim()
  const value = phrases[trimmed]
  if (value) {
    return value[locale === 'hi' ? 1 : locale === 'gu' ? 2 : 0]
  }
  return key
}
