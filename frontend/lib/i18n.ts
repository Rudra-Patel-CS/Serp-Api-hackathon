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

  // Workspaces
  'Farmer Workspace': ['Farmer Workspace', 'किसान कार्यक्षेत्र', 'ખેડૂત કાર્યક્ષેત્ર'],
  'FPO Manager Workspace': ['FPO Manager Workspace', 'FPO प्रबंधक कार्यक्षेत्र', 'FPO મેનેજર કાર્યક્ષેત્ર'],
  'KrishiIntel Console': ['KrishiIntel Console', 'कृषिइंटेल कंसोल', 'કૃષિઇન્ટેલ કન્સોલ'],
  'ADMIN ACCESS': ['ADMIN ACCESS', 'व्यवस्थापक पहुंच', 'એડમિન ઍક્સેસ'],

  // Admin Navigation
  'User Directory': ['User Directory', 'उपयोगकर्ता निर्देशिका', 'વપરાશકર્તા ડિરેક્ટરી'],
  Farmers: ['Farmers', 'किसान', 'ખેડૂતો'],
  FPOs: ['FPOs', 'एफपीओ', 'FPO'],
  'Harvest Lots': ['Harvest Lots', 'फसल लॉट', 'પાક લોટ'],
  'Fleet Live Track': ['Fleet Live Track', 'लाइव बेड़ा ट्रैकिंग', 'લાઇવ વાહન ટ્રેકિંગ'],
  'Audit Logs': ['Audit Logs', 'सुरक्षा ऑडिट लॉग', 'સુરક્ષા ઓડિટ લૉગ્સ'],
  'System Health': ['System Health', 'सिस्टम स्थिति', 'સિસ્ટમ હેલ્થ'],

  // Admin Dashboard Headlines & Cards
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

  // Common UI Buttons & Badges
  'Analyze market': ['Analyze market', 'मंडी का विश्लेषण करें', 'બજારનું વિશ્લેષણ કરો'],
  'Search buyers or locations': ['Search buyers or locations', 'खरीदार या स्थान खोजें', 'ખરીદદારો કે સ્થાન શોધો'],
  Status: ['Status', 'स्थिति', 'સ્થિતિ'],
  Actions: ['Actions', 'कार्रवाई', 'પગલાં'],
  Active: ['Active', 'सक्रिय', 'સક્રિય'],
  Pending: ['Pending', 'लंबित', 'બાકી'],
  Accepted: ['Accepted', 'स्वीकृत', 'સ્વીકારેલ'],
  Rejected: ['Rejected', 'अस्वीकृत', 'નકારેલ'],
  Completed: ['Completed', 'पूर्ण', 'પૂર્ણ'],

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
