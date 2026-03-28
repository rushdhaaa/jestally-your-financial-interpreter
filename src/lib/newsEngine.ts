import { NewsItem, Priority, ISL_VOCABULARY } from "@/types/news";

// All headlines with per-language translations
const HEADLINES: {
  en: string; hi: string; ta: string; te: string; bn: string;
  category: string; priority: Priority;
}[] = [
  {
    en: "RBI Holds Repo Rate Steady at 6.5% Amid Global Uncertainty",
    hi: "वैश्विक अनिश्चितता के बीच RBI ने रेपो रेट 6.5% पर स्थिर रखा",
    ta: "உலகளாவிய நிச்சயமின்மை மத்தியில் RBI ரெப்போ விகிதத்தை 6.5% ஆக நிலைநிறுத்தியது",
    te: "ప్రపంచ అనిశ్చితత మధ్య RBI రెపో రేటును 6.5%కి స్థిరంగా ఉంచింది",
    bn: "বৈশ্বিক অনিশ্চয়তার মধ্যে RBI রেপো রেট 6.5%-এ স্থির রাখল",
    category: "Economy", priority: "High",
  },
  {
    en: "Reliance Industries Shares Surge 4% on Strong Q3 Results",
    hi: "मजबूत Q3 नतीजों से रिलायंस इंडस्ट्रीज के शेयर 4% उछले",
    ta: "வலுவான Q3 முடிவுகளால் ரிலையன்ஸ் இண்டஸ்ட்ரீஸ் பங்குகள் 4% உயர்வு",
    te: "బలమైన Q3 ఫలితాలపై రిలయన్స్ ఇండస్ట్రీస్ షేర్లు 4% పెరిగాయి",
    bn: "শক্তিশালী Q3 ফলাফলে রিলায়েন্স ইন্ডাস্ট্রিজের শেয়ার 4% বৃদ্ধি",
    category: "Markets", priority: "High",
  },
  {
    en: "Gold Prices Hit Record High as Dollar Weakens",
    hi: "डॉलर कमजोर होने से सोने की कीमत रिकॉर्ड ऊंचाई पर",
    ta: "டாலர் பலவீனமடையும்போது தங்கம் விலை சரிதிக் உயர்வை எட்டியது",
    te: "డాలర్ బలహీనపడటంతో బంగారం ధర రికార్డు గరిష్ఠానికి చేరింది",
    bn: "ডলার দুর্বল হওয়ায় সোনার দাম রেকর্ড উচ্চতায়",
    category: "Commodities", priority: "High",
  },
  {
    en: "SENSEX Crosses 80,000 Mark for First Time in History",
    hi: "SENSEX ने पहली बार ऐतिहासिक 80,000 का आंकड़ा पार किया",
    ta: "SENSEX வரலாற்றில் முதல்முறையாக 80,000 மதிப்பைத் தாண்டியது",
    te: "SENSEX చరిత్రలో మొదటిసారిగా 80,000 మార్కును దాటింది",
    bn: "ইতিহাসে প্রথমবারের মতো SENSEX ৮০,০০০ পার করল",
    category: "Markets", priority: "High",
  },
  {
    en: "Adani Group Stocks Rally After Port Deal Announcement",
    hi: "पोर्ट डील की घोषणा के बाद अडानी ग्रुप के शेयरों में तेजी",
    ta: "துறைமுக ஒப்பந்த அறிவிப்புக்குப் பிறகு அதானி குழும பங்குகள் உயர்வு",
    te: "పోర్ట్ డీల్ ప్రకటన తర్వాత అదానీ గ్రూప్ స్టాక్స్ పెరిగాయి",
    bn: "পোর্ট চুক্তির ঘোষণার পর আদানি গ্রুপের শেয়ার ঊর্ধ্বমুখী",
    category: "Markets", priority: "Medium",
  },
  {
    en: "IT Sector Growth Slows as Global Demand Softens",
    hi: "वैश्विक मांग कमजोर पड़ने से IT क्षेत्र की वृद्धि धीमी",
    ta: "உலகளாவிய தேவை குறைவால் IT துறை வளர்ச்சி மந்தமடைந்தது",
    te: "గ్లోబల్ డిమాండ్ తగ్గడంతో IT రంగం వృద్ధి మందగించింది",
    bn: "বৈশ্বিক চাহিদা কমায় IT খাতের প্রবৃদ্ধি শ্লথ হলো",
    category: "Technology", priority: "Medium",
  },
  {
    en: "Crude Oil Prices Fall Below $70 Per Barrel",
    hi: "कच्चे तेल की कीमतें 70 डॉलर प्रति बैरल से नीचे गिरीं",
    ta: "கச்சா எண்ணெய் விலை பீப்பாய்க்கு $70-க்கும் கீழே சரிந்தது",
    te: "క్రూడ్ ఆయిల్ ధరలు బ్యారెల్‌కు $70 కంటే తక్కువకు పడిపోయాయి",
    bn: "অপরিশোধিত তেলের দাম প্রতি ব্যারেলে $70-এর নিচে নামল",
    category: "Commodities", priority: "Medium",
  },
  {
    en: "India GDP Growth Rate Revised Upward to 7.2%",
    hi: "भारत की GDP वृद्धि दर को संशोधित कर 7.2% किया गया",
    ta: "இந்தியாவின் GDP வளர்ச்சி விகிதம் 7.2% ஆக மேல்நோக்கி திருத்தப்பட்டது",
    te: "భారత GDP వృద్ధి రేటు 7.2%కి పైకి సవరించబడింది",
    bn: "ভারতের GDP প্রবৃদ্ধির হার ৭.২%-এ ঊর্ধ্বমুখী সংশোধন",
    category: "Economy", priority: "High",
  },
  {
    en: "Bank Nifty Drops 500 Points on Rate Hike Fears",
    hi: "ब्याज दर बढ़ने की आशंका से Bank Nifty 500 अंक गिरा",
    ta: "வட்டி விகித உயர்வு அச்சத்தால் Bank Nifty 500 புள்ளிகள் சரிந்தது",
    te: "రేట్ హైక్ భయాలతో Bank Nifty 500 పాయింట్లు పడిపోయింది",
    bn: "সুদের হার বৃদ্ধির আশঙ্কায় Bank Nifty ৫০০ পয়েন্ট পড়ল",
    category: "Markets", priority: "High",
  },
  {
    en: "Tata Motors EV Sales Rise 45% Year Over Year",
    hi: "टाटा मोटर्स की EV बिक्री साल-दर-साल 45% बढ़ी",
    ta: "டாட்டா மோட்டார்ஸ் EV விற்பனை ஆண்டுக்கு ஆண்டு 45% உயர்வு",
    te: "టాటా మోటర్స్ EV అమ్మకాలు ఏటా 45% పెరిగాయి",
    bn: "টাটা মোটর্সের EV বিক্রি বছরে বছরে ৪৫% বৃদ্ধি",
    category: "Auto", priority: "Medium",
  },
  {
    en: "Rupee Strengthens Against Dollar to 82.5 Level",
    hi: "रुपया डॉलर के मुकाबले मजबूत होकर 82.5 पर पहुंचा",
    ta: "ரூபாய் டாலருக்கு எதிராக வலுப்பெற்று 82.5 நிலையை எட்டியது",
    te: "రూపాయి డాలర్‌కు వ్యతిరేకంగా బలపడి 82.5 స్థాయికి చేరింది",
    bn: "রুপি ডলারের বিপরীতে শক্তিশালী হয়ে ৮২.৫ স্তরে পৌঁছাল",
    category: "Forex", priority: "Medium",
  },
  {
    en: "Infosys Reports Strong Profit Growth in Q3",
    hi: "इन्फोसिस ने Q3 में मजबूत मुनाफा वृद्धि दर्ज की",
    ta: "இன்ஃபோசிஸ் Q3-ல் வலுவான லாப வளர்ச்சியை அறிவித்தது",
    te: "ఇన్ఫోసిస్ Q3లో బలమైన లాభ వృద్ధిని నమోదు చేసింది",
    bn: "ইনফোসিস Q3-তে শক্তিশালী মুনাফা প্রবৃদ্ধি জানাল",
    category: "Technology", priority: "Medium",
  },
  {
    en: "Government Tax Collection Surpasses Target by 12%",
    hi: "सरकार का कर संग्रह लक्ष्य से 12% अधिक रहा",
    ta: "அரசாங்க வரி வசூல் இலக்கை 12% தாண்டியது",
    te: "ప్రభుత్వ పన్ను వసూళ్ళు లక్ష్యాన్ని 12% మించాయి",
    bn: "সরকারের কর সংগ্রহ লক্ষ্যমাত্রার চেয়ে ১২% বেশি",
    category: "Economy", priority: "Low",
  },
  {
    en: "HDFC Bank Loan Portfolio Grows 18% in FY24",
    hi: "HDFC बैंक का लोन पोर्टफोलियो FY24 में 18% बढ़ा",
    ta: "HDFC வங்கி கடன் போர்ட்ஃபோலியோ FY24-ல் 18% வளர்ந்தது",
    te: "HDFC బ్యాంక్ లోన్ పోర్ట్‌ఫోలియో FY24లో 18% పెరిగింది",
    bn: "HDFC ব্যাংকের ঋণ পোর্টফোলিও FY24-এ ১৮% বৃদ্ধি",
    category: "Banking", priority: "Medium",
  },
  {
    en: "Steel Prices Rise on Strong Demand from Infrastructure",
    hi: "इंफ्रास्ट्रक्चर की मजबूत मांग से स्टील की कीमतें बढ़ीं",
    ta: "உள்கட்டமைப்பு தேவையால் எஃகு விலைகள் உயர்ந்தன",
    te: "మౌలిక సదుపాయాల డిమాండ్‌తో స్టీల్ ధరలు పెరిగాయి",
    bn: "অবকাঠামোর শক্তিশালী চাহিদায় ইস্পাতের দাম বাড়ল",
    category: "Commodities", priority: "Low",
  },
  {
    en: "Startup Funding Drops 30% in Q1 2024",
    hi: "Q1 2024 में स्टार्टअप फंडिंग 30% घटी",
    ta: "Q1 2024-ல் ஸ்டார்டப் நிதி 30% குறைந்தது",
    te: "Q1 2024లో స్టార్టప్ ఫండింగ్ 30% తగ్గింది",
    bn: "Q1 2024-এ স্টার্টআপ ফান্ডিং ৩০% হ্রাস",
    category: "Startups", priority: "Low",
  },
  {
    en: "Nifty 50 Hits All-Time High Crossing 24,000",
    hi: "Nifty 50 ने 24,000 पार कर नया रिकॉर्ड बनाया",
    ta: "Nifty 50 சரிதிக் உயர்வை எட்டி 24,000 ஐ கடந்தது",
    te: "Nifty 50 24,000ని దాటి అన్ని కాలాల గరిష్ఠాన్ని తాకింది",
    bn: "Nifty 50 সর্বকালের সর্বোচ্চ ২৪,০০০ পার করল",
    category: "Markets", priority: "High",
  },
  {
    en: "India Trade Deficit Narrows to $15 Billion",
    hi: "भारत का व्यापार घाटा घटकर 15 अरब डॉलर रहा",
    ta: "இந்தியாவின் வர்த்தக பற்றாக்குறை $15 பில்லியனாக குறைந்தது",
    te: "భారత వాణిజ్య లోటు $15 బిలియన్‌కు తగ్గింది",
    bn: "ভারতের বাণিজ্য ঘাটতি $১৫ বিলিয়নে নেমে এল",
    category: "Economy", priority: "Medium",
  },
  {
    en: "SBI Reports Record Profit of ₹18,000 Crore",
    hi: "SBI ने ₹18,000 करोड़ का रिकॉर्ड मुनाफा दर्ज किया",
    ta: "SBI ₹18,000 கோடி சரிதிக் லாபம் அறிவித்தது",
    te: "SBI ₹18,000 కోట్ల రికార్డు లాభాన్ని నమోదు చేసింది",
    bn: "SBI ₹১৮,০০০ কোটির রেকর্ড মুনাফা ঘোষণা করল",
    category: "Banking", priority: "High",
  },
  {
    en: "Global Market Rally Lifts World Stock Indices",
    hi: "वैश्विक बाजार में तेजी से दुनिया भर के शेयर सूचकांक उठे",
    ta: "உலகளாவிய சந்தை ஏற்றம் உலக பங்கு குறியீடுகளை தூக்கி நிறுத்தியது",
    te: "గ్లోబల్ మార్కెట్ ర్యాలీ ప్రపంచ స్టాక్ సూచీలను పైకి తీసుకెళ్ళింది",
    bn: "বৈশ্বিক বাজারের ঊর্ধ্বগতি বিশ্বের শেয়ার সূচকগুলি উপরে তুলল",
    category: "Global", priority: "Medium",
  },
];

// Summaries per language
const SUMMARIES: Record<string, Record<string, string>> = {
  Economy: {
    en: "This economic development is impacting markets and households across India. Analysts are closely watching the ripple effects on growth.",
    hi: "यह आर्थिक घटना भारत भर के बाजारों और परिवारों को प्रभावित कर रही है। विश्लेषक विकास पर प्रभावों की बारीकी से निगरानी कर रहे हैं।",
    ta: "இந்த பொருளாதார வளர்ச்சி இந்தியா முழுவதும் சந்தைகளையும் குடும்பங்களையும் பாதிக்கிறது. வளர்ச்சியில் அலை விளைவுகளை ஆய்வாளர்கள் கவனமாக கண்காணிக்கின்றனர்.",
    te: "ఈ ఆర్థిక పరిణామం భారతదేశంలోని మార్కెట్లు మరియు కుటుంబాలను ప్రభావితం చేస్తోంది. వృద్ధిపై అలల ప్రభావాలను విశ్లేషకులు జాగ్రత్తగా పరిశీలిస్తున్నారు.",
    bn: "এই অর্থনৈতিক উন্নয়ন ভারত জুড়ে বাজার ও পরিবারগুলিকে প্রভাবিত করছে। বিশ্লেষকরা প্রবৃদ্ধিতে তরঙ্গ প্রভাব নিবিড়ভাবে পর্যবেক্ষণ করছেন।",
  },
  Markets: {
    en: "Markets are reacting sharply to this development. Traders and investors are recalibrating their portfolios in response.",
    hi: "बाजार इस घटनाक्रम पर तेजी से प्रतिक्रिया दे रहे हैं। व्यापारी और निवेशक अपने पोर्टफोलियो को समायोजित कर रहे हैं।",
    ta: "இந்த வளர்ச்சிக்கு சந்தைகள் கூர்மையாக எதிர்வினை ஆற்றுகின்றன. வர்த்தகர்கள் மற்றும் முதலீட்டாளர்கள் தங்கள் போர்ட்ஃபோலியோக்களை மறுசீரமைக்கின்றனர்.",
    te: "మార్కెట్లు ఈ పరిణామానికి తీవ్రంగా స్పందిస్తున్నాయి. వ్యాపారులు మరియు పెట్టుబడిదారులు తమ పోర్ట్‌ఫోలియోలను మళ్ళీ సర్దుబాటు చేసుకుంటున్నారు.",
    bn: "বাজার এই উন্নয়নে তীব্রভাবে প্রতিক্রিয়া দেখাচ্ছে। ব্যবসায়ীরা এবং বিনিয়োগকারীরা তাদের পোর্টফোলিও পুনর্বিন্যাস করছেন।",
  },
  Commodities: {
    en: "Commodity price movement is affecting everyday costs for Indian households and businesses alike.",
    hi: "कमोडिटी कीमतों में बदलाव भारतीय परिवारों और व्यापारों की रोजमर्रा की लागत को प्रभावित कर रहा है।",
    ta: "பொருட்களின் விலை மாற்றம் இந்திய குடும்பங்கள் மற்றும் வணிகங்களின் அன்றாட செலவுகளை பாதிக்கிறது.",
    te: "వస్తువుల ధర కదలిక భారతీయ కుటుంబాలు మరియు వ్యాపారాల రోజువారీ ఖర్చులను ప్రభావితం చేస్తోంది.",
    bn: "পণ্যের দামের পরিবর্তন ভারতীয় পরিবার ও ব্যবসা উভয়ের দৈনন্দিন খরচকে প্রভাবিত করছে।",
  },
  Technology: {
    en: "The technology sector is seeing significant shifts that could reshape employment and investment patterns across India.",
    hi: "प्रौद्योगिकी क्षेत्र में बड़े बदलाव हो रहे हैं जो भारत भर में रोजगार और निवेश के पैटर्न को नया रूप दे सकते हैं।",
    ta: "தொழில்நுட்ப துறையில் குறிப்பிடத்தக்க மாற்றங்கள் நிகழ்கின்றன, இது இந்தியா முழுவதும் வேலைவாய்ப்பு மற்றும் முதலீட்டு முறைகளை மாற்றலாம்.",
    te: "టెక్నాలజీ రంగంలో గణనీయమైన మార్పులు చోటుచేసుకుంటున్నాయి, ఇవి భారతదేశంలో ఉపాధి మరియు పెట్టుబడి నమూనాలను మార్చవచ్చు.",
    bn: "প্রযুক্তি খাতে উল্লেখযোগ্য পরিবর্তন দেখা যাচ্ছে যা সারা ভারতে কর্মসংস্থান ও বিনিয়োগের ধারা পুনর্গঠন করতে পারে।",
  },
  Banking: {
    en: "This banking development directly affects loan rates, deposits, and financial services for millions of Indians.",
    hi: "यह बैंकिंग घटनाक्रम लाखों भारतीयों के लिए ऋण दरों, जमा और वित्तीय सेवाओं को सीधे प्रभावित करता है।",
    ta: "இந்த வங்கி வளர்ச்சி கோடிக்கணக்கான இந்தியர்களுக்கான கடன் விகிதங்கள், வைப்புத்தொகைகள் மற்றும் நிதி சேவைகளை நேரடியாக பாதிக்கிறது.",
    te: "ఈ బ్యాంకింగ్ పరిణామం కోట్లాది మంది భారతీయులకు రుణ రేట్లు, డిపాజిట్లు మరియు ఆర్థిక సేవలను నేరుగా ప్రభావితం చేస్తుంది.",
    bn: "এই ব্যাংকিং উন্নয়ন কোটি কোটি ভারতীয়দের জন্য ঋণের হার, আমানত এবং আর্থিক সেবাকে সরাসরি প্রভাবিত করে।",
  },
  Auto: {
    en: "The automobile sector is shifting gears, with implications for consumers, manufacturers, and fuel prices nationwide.",
    hi: "ऑटोमोबाइल क्षेत्र में बड़ा बदलाव आ रहा है, जिसका देशभर में उपभोक्ताओं, निर्माताओं और ईंधन कीमतों पर असर पड़ेगा।",
    ta: "வாகன துறை மாற்றங்களை சந்திக்கிறது, இது நாடு முழுவதும் நுகர்வோர், உற்பத்தியாளர்கள் மற்றும் எரிபொருள் விலைகளை பாதிக்கும்.",
    te: "ఆటోమొబైల్ రంగం మారుతోంది, దేశవ్యాప్తంగా వినియోగదారులు, తయారీదారులు మరియు ఇంధన ధరలపై పరిణామాలు ఉంటాయి.",
    bn: "অটোমোবাইল খাত পরিবর্তনের মধ্যে রয়েছে, সারা দেশে ভোক্তা, উৎপাদনকারী ও জ্বালানির দামে প্রভাব পড়বে।",
  },
  Forex: {
    en: "Currency movement is influencing import costs, export competitiveness, and the purchasing power of Indian households.",
    hi: "मुद्रा में उतार-चढ़ाव आयात लागत, निर्यात प्रतिस्पर्धा और भारतीय परिवारों की क्रय शक्ति को प्रभावित कर रहा है।",
    ta: "நாணய மாற்றம் இறக்குமதி செலவுகள், ஏற்றுமதி போட்டித்திறன் மற்றும் இந்திய குடும்பங்களின் கொள்முதல் சக்தியை பாதிக்கிறது.",
    te: "కరెన్సీ కదలిక దిగుమతి వ్యయాలు, ఎగుమతి పోటీతత్వం మరియు భారతీయ కుటుంబాల కొనుగోలు శక్తిని ప్రభావితం చేస్తోంది.",
    bn: "মুদ্রার গতিবিধি আমদানি খরচ, রপ্তানি প্রতিযোগিতামূলকতা এবং ভারতীয় পরিবারের ক্রয়ক্ষমতাকে প্রভাবিত করছে।",
  },
  Startups: {
    en: "India's startup ecosystem is experiencing turbulence, affecting jobs, innovation, and venture capital activity.",
    hi: "भारत का स्टार्टअप इकोसिस्टम उथल-पुथल से गुजर रहा है, जो नौकरियों, नवाचार और वेंचर कैपिटल गतिविधि को प्रभावित कर रहा है।",
    ta: "இந்தியாவின் ஸ்டார்டப் சுற்றுச்சூழல் கொந்தளிப்பை அனுபவிக்கிறது, வேலை வாய்ப்புகள், கண்டுபிடிப்பு மற்றும் முதலீட்டு நடவடிக்கைகளை பாதிக்கிறது.",
    te: "భారత స్టార్టప్ పర్యావరణ వ్యవస్థ అలజడిని అనుభవిస్తోంది, ఉద్యోగాలు, ఆవిష్కరణ మరియు వెంచర్ క్యాపిటల్ కార్యకలాపాలను ప్రభావితం చేస్తోంది.",
    bn: "ভারতের স্টার্টআপ ইকোসিস্টেম ঝড়ঝাপটার মধ্যে রয়েছে, চাকরি, উদ্ভাবন এবং ভেঞ্চার ক্যাপিটাল কার্যকলাপকে প্রভাবিত করছে।",
  },
  Global: {
    en: "Global economic forces are shaping India's market outlook, with international investors watching closely.",
    hi: "वैश्विक आर्थिक ताकतें भारत के बाजार परिदृश्य को आकार दे रही हैं और अंतरराष्ट्रीय निवेशक इसे ध्यान से देख रहे हैं।",
    ta: "உலகளாவிய பொருளாதார சக்திகள் இந்தியாவின் சந்தை கண்ணோட்டத்தை வடிவமைக்கின்றன, சர்வதேச முதலீட்டாளர்கள் கவனமாக கண்காணிக்கின்றனர்.",
    te: "గ్లోబల్ ఆర్థిక శక్తులు భారత మార్కెట్ దృక్పథాన్ని రూపొందిస్తున్నాయి, అంతర్జాతీయ పెట్టుబడిదారులు జాగ్రత్తగా గమనిస్తున్నారు.",
    bn: "বৈশ্বিক অর্থনৈতিক শক্তি ভারতের বাজারের দৃষ্টিভঙ্গি গড়ে তুলছে, আন্তর্জাতিক বিনিয়োগকারীরা নিবিড়ভাবে পর্যবেক্ষণ করছেন।",
  },
};

const DEFAULT_SUMMARY = {
  en: "Breaking: This development is impacting markets across India. Analysts are watching closely.",
  hi: "ब्रेकिंग: यह घटना भारत भर के बाजारों को प्रभावित कर रही है।",
  ta: "முக்கியச் செய்தி: இந்த வளர்ச்சி இந்தியா முழுவதும் சந்தைகளை பாதிக்கிறது.",
  te: "బ్రేకింగ్: ఈ పరిణామం భారతదేశంలో మార్కెట్లను ప్రభావితం చేస్తోంది.",
  bn: "ব্রেকিং: এই উন্নয়ন সারা ভারতের বাজারকে প্রভাবিত করছে।",
};

const IMPACT_TEMPLATES: Record<string, Record<string, string>> = {
  Economy: {
    en: "This may affect your savings and loan interest rates",
    hi: "इसका असर आपकी बचत और कर्ज की ब्याज दरों पर पड़ सकता है",
    ta: "இது உங்கள் சேமிப்பு மற்றும் கடன் வட்டி விகிதங்களை பாதிக்கலாம்",
    te: "ఇది మీ పొదుపు మరియు రుణ వడ్డీ రేట్లను ప్రభావించవచ్చు",
    bn: "এটি আপনার সঞ্চয় এবং ঋণের সুদের হারকে প্রভাবিত করতে পারে",
  },
  Markets: {
    en: "Market move — your investment portfolio value may change",
    hi: "बाजार में हलचल — आपके निवेश पोर्टफोलियो की कीमत बदल सकती है",
    ta: "சந்தை நகர்வு — உங்கள் முதலீட்டு போர்ட்ஃபோலியோ மதிப்பு மாறலாம்",
    te: "మార్కెట్ కదలిక — మీ పెట్టుబడి పోర్ట్‌ఫోలియో విలువ మారవచ్చు",
    bn: "বাজারের গতিবিধি — আপনার বিনিয়োগ পোর্টফোলিওর মূল্য পরিবর্তন হতে পারে",
  },
  Commodities: {
    en: "Commodity price change — your daily purchases may cost more or less",
    hi: "कमोडिटी कीमत बदलाव — आपकी रोजाना की खरीदारी महंगी या सस्ती हो सकती है",
    ta: "பொருட்களின் விலை மாற்றம் — உங்கள் தினசரி கொள்முதல் விலை மாறலாம்",
    te: "వస్తువుల ధర మార్పు — మీ రోజువారీ కొనుగోళ్ళ ధర మారవచ్చు",
    bn: "পণ্যের দামের পরিবর্তন — আপনার দৈনন্দিন কেনাকাটা সস্তা বা দামি হতে পারে",
  },
  Banking: {
    en: "Banking change — your EMI, FD rates or savings account returns may be affected",
    hi: "बैंकिंग बदलाव — आपकी EMI, FD दरें या बचत खाते का रिटर्न प्रभावित हो सकता है",
    ta: "வங்கி மாற்றம் — உங்கள் EMI, FD விகிதங்கள் அல்லது சேமிப்பு கணக்கு வருவாய் பாதிக்கப்படலாம்",
    te: "బ్యాంకింగ్ మార్పు — మీ EMI, FD రేట్లు లేదా సేవింగ్స్ అకౌంట్ రిటర్న్‌లు ప్రభావితమవుతాయి",
    bn: "ব্যাংকিং পরিবর্তন — আপনার EMI, FD হার বা সঞ্চয় অ্যাকাউন্টের রিটার্ন প্রভাবিত হতে পারে",
  },
};

const DEFAULT_IMPACT: Record<string, string> = {
  en: "This news may impact your personal finances",
  hi: "इस खबर का आपके वित्त पर असर हो सकता है",
  ta: "இந்தச் செய்தி உங்கள் நிதியை பாதிக்கலாம்",
  te: "ఈ వార్త మీ ఆర్థిక వ్యవహారాలపై ప్రభావం చూపవచ్చు",
  bn: "এই খবরটি আপনার আর্থিক অবস্থাকে প্রভাবিত করতে পারে",
};

let usedIndices = new Set<number>();

// lang: "en" | "hi" | "ta" | "te" | "bn"
export function generateNewsItem(lang: string = "en"): NewsItem {
  if (usedIndices.size >= HEADLINES.length) usedIndices.clear();
  let idx: number;
  do { idx = Math.floor(Math.random() * HEADLINES.length); } while (usedIndices.has(idx));
  usedIndices.add(idx);

  const template = HEADLINES[idx];
  const l = (["en","hi","ta","te","bn"].includes(lang) ? lang : "en") as "en"|"hi"|"ta"|"te"|"bn";

  const headline = template[l] || template.en;
  const summaryMap = SUMMARIES[template.category] || DEFAULT_SUMMARY;
  const summary = summaryMap[l] || summaryMap.en;
  const impactMap = IMPACT_TEMPLATES[template.category] || DEFAULT_IMPACT;
  const impactSummaries = Object.fromEntries(
    Object.entries(impactMap)
  ) as Record<string, string>;

  const words = template.en.toUpperCase().split(/\s+/);
  const concepts = ISL_VOCABULARY.filter(v =>
    words.some(w => w === v.toUpperCase() || w.includes(v.toUpperCase()))
  );

  return {
    id: `news-${Date.now()}-${idx}`,
    headline,
    summary,
    timestamp: new Date(),
    priority: template.priority,
    category: template.category,
    isLive: template.priority === "High",
    impactSummaries,
    concepts: concepts.length > 0 ? concepts : ["Market", "Change"],
    lang: l,
  };
}

export const MARKET_DATA = [
  { symbol: "NIFTY 50",  value: "24,167.65", change: "+0.83%", up: true },
  { symbol: "SENSEX",    value: "79,476.19", change: "+0.72%", up: true },
  { symbol: "USD/INR",   value: "83.42",     change: "-0.12%", up: false },
  { symbol: "GOLD",      value: "₹72,450",   change: "+1.24%", up: true },
  { symbol: "CRUDE OIL", value: "$78.32",    change: "-0.45%", up: false },
  { symbol: "SILVER",    value: "₹85,200",   change: "+0.67%", up: true },
  { symbol: "BANK NIFTY",value: "51,234.80", change: "+0.95%", up: true },
  { symbol: "NIFTY IT",  value: "37,892.15", change: "-0.31%", up: false },
];