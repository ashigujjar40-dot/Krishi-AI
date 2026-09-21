import { LanguageCode } from './types.ts';

export interface Translations {
  appName: string;
  tagline: string;
  scanCrop: string;
  scanSub: string;
  takePhoto: string;
  uploadPhoto: string;
  describeVoice: string;
  selectCrop: string;
  diagnoseNow: string;
  diagnosing: string;
  confidence: string;
  severity: string;
  mild: string;
  moderate: string;
  severe: string;
  symptoms: string;
  treatments: string;
  organicFirst: string;
  chemicalTreatment: string;
  dose: string;
  timing: string;
  safety: string;
  preHarvestInterval: string;
  disclaimerText: string;
  findDealers: string;
  nearbyDealers: string;
  inStock: string;
  outOfStock: string;
  buyNow: string;
  addToCart: string;
  cart: string;
  checkout: string;
  orders: string;
  myOrders: string;
  home: string;
  profile: string;
  switchRole: string;
  farmer: string;
  dealer: string;
  agronomist: string;
  followUpDue: string;
  hasImproved: string;
  improved: string;
  same: string;
  worse: string;
  escalatedToAgronomist: string;
  sprayAdvisory: string;
  safeToSpray: string;
  avoidSpray: string;
  listenAdvice: string;
  stopAudio: string;
  pincode: string;
  phone: string;
  loginOtp: string;
  sendOtp: string;
  verifyOtp: string;
  welcomeBack: string;
  daysWaiting: string;
  referApp: string;
  referAppSub: string;
}

export const I18N_TEXTS: Record<LanguageCode, Translations> = {
  en: {
    appName: "Krishi Saathi",
    tagline: "AI Crop Doctor & Local Agri-Input Store",
    scanCrop: "Scan Your Crop",
    scanSub: "Upload leaf photos or speak symptoms for instant AI diagnosis",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload 1-3 Photos",
    describeVoice: "Tap to Speak Symptoms",
    selectCrop: "Select Crop",
    diagnoseNow: "Diagnose Problem",
    diagnosing: "Consulting AI Agronomist...",
    confidence: "Confidence",
    severity: "Severity",
    mild: "Mild (Early Stage)",
    moderate: "Moderate (Spreading)",
    severe: "Severe (Immediate Action Needed)",
    symptoms: "Observed Symptoms",
    treatments: "Recommended Treatment",
    organicFirst: "Organic & Cultural (Eco-friendly)",
    chemicalTreatment: "Approved Chemical Spray",
    dose: "Dosage per Acre",
    timing: "Best Timing",
    safety: "Safety & PPE",
    preHarvestInterval: "Waiting Period (PHI)",
    disclaimerText: "Important: Always follow printed label instructions. Only use CIBRC registered products. Consult an agronomist for severe outbreaks.",
    findDealers: "Order from Nearby Dealers",
    nearbyDealers: "Nearby Input Shops",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    buyNow: "Order Now",
    addToCart: "Add to Cart",
    cart: "Cart",
    checkout: "Proceed to Checkout",
    orders: "My Orders",
    myOrders: "Order History",
    home: "Home",
    profile: "Farm Profile",
    switchRole: "Switch Mode",
    farmer: "Farmer",
    dealer: "Dealer Store",
    agronomist: "Admin / Agronomist",
    followUpDue: "Day 3 / 7 Health Checkup",
    hasImproved: "How is your crop now?",
    improved: "Improved",
    same: "No Change",
    worse: "Worse (Escalate)",
    escalatedToAgronomist: "Case flagged for Agronomist review! Our expert will assist.",
    sprayAdvisory: "Spray Weather Advisory",
    safeToSpray: "Safe for Spraying",
    avoidSpray: "Rain/Wind Risk - Avoid Spraying",
    listenAdvice: "Listen in Audio",
    stopAudio: "Stop Audio",
    pincode: "Pincode",
    phone: "Mobile Number",
    loginOtp: "Farmer Login",
    sendOtp: "Get OTP",
    verifyOtp: "Verify & Enter",
    welcomeBack: "Namaste, Farmer Friend!",
    daysWaiting: "days before harvest",
    referApp: "Refer & Earn",
    referAppSub: "Invite farmers & earn ₹100 vouchers"
  },
  hi: {
    appName: "कृषि साथी",
    tagline: "एआई फसल डॉक्टर और नजदीकी खाद-दवाई दुकान",
    scanCrop: "फसल की जांच करें",
    scanSub: "पत्ती की फोटो खींचें या बोलकर समस्या बताएं",
    takePhoto: "फोटो लें",
    uploadPhoto: "1-3 फोटो अपलोड करें",
    describeVoice: "बोलकर लक्षण बताएं",
    selectCrop: "फसल चुनें",
    diagnoseNow: "बीमारी की जांच करें",
    diagnosing: "एआई कृषि वैज्ञानिक विश्लेषण कर रहे हैं...",
    confidence: "सटीकता",
    severity: "गंभीरता",
    mild: "हल्की (शुरुआती स्तर)",
    moderate: "मध्यम (फैल रही है)",
    severe: "गंभीर (तुरंत उपचार जरूरी)",
    symptoms: "पहचाने गए लक्षण",
    treatments: "अनुशंसित उपचार",
    organicFirst: "जैविक व देसी उपाय (पहले करें)",
    chemicalTreatment: "मान्यता प्राप्त रासायनिक छिड़काव",
    dose: "प्रति एकड़ खुराक",
    timing: "छिड़काव का सही समय",
    safety: "सुरक्षा व सावधानियां",
    preHarvestInterval: "तुड़ाई से पहले का अंतराल (PHI)",
    disclaimerText: "महत्वपूर्ण: दवा के लेबल पर दिए निर्देशों का पालन करें। केवल भारत सरकार (CIBRC) द्वारा मान्य दवाएं ही उपयोग करें।",
    findDealers: "नजदीकी दुकानदार से मंगाएं",
    nearbyDealers: "पास की कृषि दुकानें",
    inStock: "उपलब्ध है",
    outOfStock: "खत्म है",
    buyNow: "अभी खरीदें",
    addToCart: "कार्ट में जोड़ें",
    cart: "थैला (कार्ट)",
    checkout: "ऑर्डर पूरा करें",
    orders: "मेरे ऑर्डर",
    myOrders: "ऑर्डर विवरण",
    home: "होम",
    profile: "खेत की जानकारी",
    switchRole: "मोड बदलें",
    farmer: "किसान",
    dealer: "दुकानदार",
    agronomist: "कृषि विशेषज्ञ",
    followUpDue: "दिन 3 / 7 फसल सुधार जांच",
    hasImproved: "फसल की स्थिति कैसी है?",
    improved: "सुधार हुआ",
    same: "वैसा ही है",
    worse: "और बिगड़ा (विशेषज्ञ से पूछें)",
    escalatedToAgronomist: "यह मामला कृषि वैज्ञानिक को भेजा गया है। वे जल्द सलाह देंगे।",
    sprayAdvisory: "मौसम व छिड़काव सलाह",
    safeToSpray: "छिड़काव के लिए अनुकूल मौसम",
    avoidSpray: "बारिश/हवा का खतरा - छिड़काव न करें",
    listenAdvice: "सलाह सुनें (आवाज में)",
    stopAudio: "आवाज रोकें",
    pincode: "पिनकोड",
    phone: "मोबाइल नंबर",
    loginOtp: "किसान लॉगिन",
    sendOtp: "ओटीपी भेजें",
    verifyOtp: "ओटीपी सत्यापित करें",
    welcomeBack: "नमस्ते, किसान भाई!",
    daysWaiting: "दिन तुड़ाई से पूर्व प्रतीक्षा",
    referApp: "रेफर करें और कमाएं",
    referAppSub: "किसानों को जोड़ें और ₹100 वाउचर पाएं"
  },
  mr: {
    appName: "कृषी साथी",
    tagline: "एआय पीक सल्लागार आणि स्थानिक कृषी सेवा केंद्र",
    scanCrop: "पिकाचे स्कॅन करा",
    scanSub: "पानाचा फोटो काढा किंवा लक्षणे बोलून सांगा",
    takePhoto: "फोटो काढा",
    uploadPhoto: "१-३ फोटो अपलोड करा",
    describeVoice: "लक्षणे बोलून सांगा",
    selectCrop: "पीक निवडा",
    diagnoseNow: "रोग निदान करा",
    diagnosing: "एआय कृषी तज्ज्ञ तपासणी करत आहेत...",
    confidence: "अचूकता",
    severity: "तीव्रता",
    mild: "सौम्य (सुरुवातीची पायरी)",
    moderate: "मध्यम",
    severe: "तीव्र (त्वरित उपायांची गरज)",
    symptoms: "दिसून आलेली लक्षणे",
    treatments: "उपाययोजना",
    organicFirst: "जैविक आणि नैसर्गिक उपाय",
    chemicalTreatment: "अधिकृत रासायनिक फवारणी",
    dose: "प्रति एकरी प्रमाण",
    timing: "फवारणीची योग्य वेळ",
    safety: "सुरक्षा आणि खबरदारी",
    preHarvestInterval: "कापणीपूर्वी प्रतीक्षा काळ",
    disclaimerText: "महत्त्वाचे: बाटलीवरील लेबल सूचनांचे पालन करा. फक्त भारतात अधिकृत (CIBRC) औषधेच वापरा.",
    findDealers: "जवळच्या दुकानातून मागवा",
    nearbyDealers: "जवळची कृषी केंद्रे",
    inStock: "उपलब्ध आहे",
    outOfStock: "संपले आहे",
    buyNow: "आता ऑर्डर करा",
    addToCart: "कार्टमध्ये टाका",
    cart: "कार्ट",
    checkout: "ऑर्डर पूर्ण करा",
    orders: "माझ्या ऑर्डर्स",
    myOrders: "ऑर्डर इतिहास",
    home: "मुख्य पान",
    profile: "शेती माहिती",
    switchRole: "भूमिका बदला",
    farmer: "शेतकरी",
    dealer: "कृषी केंद्र (दुकानदार)",
    agronomist: "कृषी शास्त्रज्ञ",
    followUpDue: "दिवस ३ / ७ पीक तपासणी",
    hasImproved: "पिकात सुधारणा झाली का?",
    improved: "सुधारणा झाली",
    same: "काही बदल नाही",
    worse: "अजून बिघडले (तज्ज्ञांना पाठवा)",
    escalatedToAgronomist: "प्रकरण कृषी शास्त्रज्ञांकडे पाठवले आहे!",
    sprayAdvisory: "फवारणी हवामान सल्ला",
    safeToSpray: "फवारणीसाठी अनुकूल",
    avoidSpray: "पाऊस/वारा शक्यता - फवारणी टाळा",
    listenAdvice: "आवाजात सल्ला ऐका",
    stopAudio: "आवाज थांबवा",
    pincode: "पिनकोड",
    phone: "मोबाईल नंबर",
    loginOtp: "शेतकरी प्रवेश",
    sendOtp: "ओटीपी पाठवा",
    verifyOtp: "प्रवेश करा",
    welcomeBack: "नमस्कार, बळीराजा!",
    daysWaiting: "दिवस काढणीपूर्वी विश्रांती",
    referApp: "रेफर करा आणि कमवा",
    referAppSub: "शेतकरी मित्रांना जोडा आणि ₹100 व्हाउचर मिळवा"
  },
  te: {
    appName: "కృషి సాథి",
    tagline: "AI పంట వైద్యుడు & స్థానిక ఎరువుల దుకాణం",
    scanCrop: "పంటను స్కాన్ చేయండి",
    scanSub: "ఆకు ఫోటో తీయండి లేదా సమస్యను మాట్లాడి చెప్పండి",
    takePhoto: "ఫోటో తీయండి",
    uploadPhoto: "1-3 ఫోటోలు అప్‌లోడ్ చేయండి",
    describeVoice: "లక్షణాలు మాట్లాడండి",
    selectCrop: "పంటను ఎంచుకోండి",
    diagnoseNow: "సమస్యను గుర్తించండి",
    diagnosing: "AI వ్యవసాయ నిపుణుడు పరిశీలిస్తున్నారు...",
    confidence: "ఖచ్చితత్వం",
    severity: "తీవ్రత",
    mild: "తేలికపాటి",
    moderate: "మధ్యస్థం",
    severe: "తీవ్రమైనది (వెంటనే చికిత్స అవసరం)",
    symptoms: "గుర్తించిన లక్షణాలు",
    treatments: "సిఫార్సు చేయబడిన మందులు",
    organicFirst: "సేంద్రీయ & సహజ నివారణలు",
    chemicalTreatment: "ఆమోదించబడిన రసాయన పిచికారీ",
    dose: "ఎకరానికి మోతాదు",
    timing: "సరైన సమయం",
    safety: "రక్షణ చర్యలు",
    preHarvestInterval: "కోతకు ముందు నిరీక్షణ సమయం (PHI)",
    disclaimerText: "ముఖ్య గమనిక: లేబుల్ సూచనలను ఖచ్చితంగా పాటించండి. భారత ప్రభుత్వ CIBRC ఆమోదిత మందులను మాత్రమే వాడండి.",
    findDealers: "సమీప డీలర్ల నుండి ఆర్డర్ చేయండి",
    nearbyDealers: "సమీప వ్యవసాయ దుకాణాలు",
    inStock: "అందుబాటులో ఉంది",
    outOfStock: "స్టాక్ లేదు",
    buyNow: "ఇప్పుడే ఆర్డర్ చేయండి",
    addToCart: "కార్ట్‌కు జోడించండి",
    cart: "కార్ట్",
    checkout: "చెక్‌అవుట్",
    orders: "నా ఆర్డర్లు",
    myOrders: "ఆర్డర్ వివరాలు",
    home: "హోమ్",
    profile: "పొలం ప్రొఫైల్",
    switchRole: "మోడ్ మార్చండి",
    farmer: "రైతు",
    dealer: "డీలర్ దుకాణం",
    agronomist: "వ్యవసాయ శాస్త్రవేత్త",
    followUpDue: "రోజు 3 / 7 పంట తనిఖీ",
    hasImproved: "పంట పరిస్థితి ఎలా ఉంది?",
    improved: "మెరుగైంది",
    same: "మార్పు లేదు",
    worse: "మరింత తీవ్రమైంది",
    escalatedToAgronomist: "ఈ సమస్య వ్యవసాయ నిపుణుడికి పంపబడింది!",
    sprayAdvisory: "పిచికారీ వాతావరణ సమాచారం",
    safeToSpray: "పిచికారీకి అనుకూలం",
    avoidSpray: "వర్షం/గాలి ప్రమాదం - పిచికారీ వద్దు",
    listenAdvice: "వాయిస్ వినండి",
    stopAudio: "ఆపండి",
    pincode: "పిన్‌కోడ్",
    phone: "ఫోన్ నంబర్",
    loginOtp: "రైతు లాగిన్",
    sendOtp: "OTP పంపండి",
    verifyOtp: "ధృవీకరించండి",
    welcomeBack: "నమస్కారం, రైతు మిత్రమా!",
    daysWaiting: "రోజులు కోతకు ముందు వ్యవధి",
    referApp: "రిఫర్ & రివార్డ్స్",
    referAppSub: "రైతులను ఆహ్వానించండి & ₹100 వోచర్లు పొందండి"
  }
};
