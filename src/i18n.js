import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.file_complaint": "File Complaint",
      "nav.track_status": "Track Status",
      "nav.officer_portal": "Officer Portal",
      "nav.analytics": "Analytics",
      "nav.login": "Officer Login",
      "hero.title": "AI-Powered Grievance Redressal",
      "hero.subtitle": "Report issues instantly. Our AI automatically routes your complaint to the right department for lightning-fast resolution.",
      "hero.report_btn": "Report an Issue",
      "hero.track_btn": "Track Progress",
      "form.identity": "Identity",
      "form.details": "Details",
      "form.verification": "Verification",
      "form.fullName": "Full Name",
      "form.mobile": "Mobile Number",
      "form.state": "State",
      "form.district": "District",
      "form.continue": "Continue",
      "chatbot.placeholder": "Ask anything...",
    }
  },
  hi: {
    translation: {
      "nav.home": "होम",
      "nav.file_complaint": "शिकायत दर्ज करें",
      "nav.track_status": "स्थिति ट्रैक करें",
      "nav.officer_portal": "अधिकारी पोर्टल",
      "nav.analytics": "विश्लेषण",
      "nav.login": "अधिकारी लॉगिन",
      "hero.title": "AI-संचालित शिकायत निवारण",
      "hero.subtitle": "तुरंत समस्याओं की रिपोर्ट करें। हमारा AI आपकी शिकायत को सही विभाग में भेजता है।",
      "hero.report_btn": "समस्या दर्ज करें",
      "hero.track_btn": "प्रगति ट्रैक करें",
      "form.identity": "पहचान",
      "form.details": "विवरण",
      "form.verification": "सत्यापन",
      "form.fullName": "पूरा नाम",
      "form.mobile": "मोबाइल नंबर",
      "form.state": "राज्य",
      "form.district": "ज़िला",
      "form.continue": "जारी रखें",
      "chatbot.placeholder": "कुछ भी पूछें...",
    }
  },
  kn: {
    translation: {
      "nav.home": "ಮುಖಪುಟ",
      "nav.file_complaint": "ದೂರು ದಾಖಲಿಸಿ",
      "nav.track_status": "ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "nav.officer_portal": "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
      "nav.analytics": "ವಿಶ್ಲೇಷಣೆ",
      "nav.login": "ಅಧಿಕಾರಿ ಲಾಗಿನ್",
      "hero.title": "AI-ಆಧಾರಿತ ದೂರು ಪರಿಹಾರ",
      "hero.subtitle": "ಸಮಸ್ಯೆಗಳನ್ನು ತಕ್ಷಣ ವರದಿ ಮಾಡಿ. ನಮ್ಮ AI ಸರಿಯಾದ ಇಲಾಖೆಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಳುಹಿಸುತ್ತದೆ.",
      "hero.report_btn": "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
      "hero.track_btn": "ಪ್ರಗತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "form.identity": "ಗುರುತು",
      "form.details": "ವಿವರಗಳು",
      "form.verification": "ಪರಿಶೀಲನೆ",
      "form.fullName": "ಪೂರ್ಣ ಹೆಸರು",
      "form.mobile": "ಮೊಬೈಲ್ ನಂಬರ್",
      "form.state": "ರಾಜ್ಯ",
      "form.district": "ಜಿಲ್ಲೆ",
      "form.continue": "ಮುಂದುವರಿಸಿ",
      "chatbot.placeholder": "ಏನಾದರೂ ಕೇಳಿ...",
    }
  },
  mr: {
    translation: {
      "nav.home": "मुख्यपृष्ठ",
      "nav.file_complaint": "तक्रार नोंदवा",
      "nav.track_status": "स्थिती मागोवा घ्या",
      "nav.officer_portal": "अधिकारी पोर्टल",
      "nav.analytics": "विश्लेषण",
      "nav.login": "अधिकारी लॉगिन",
      "hero.title": "AI-सक्षम तक्रार निवारण",
      "hero.subtitle": "समस्या त्वरित नोंदवा. आमचे AI तुमची तक्रार योग्य विभागात पाठवते.",
      "hero.report_btn": "समस्या नोंदवा",
      "hero.track_btn": "प्रगतीचा मागोवा घ्या",
      "form.identity": "ओळख",
      "form.details": "तपशील",
      "form.verification": "पडताळणी",
      "form.fullName": "पूर्ण नाव",
      "form.mobile": "मोबाईल नंबर",
      "form.state": "राज्य",
      "form.district": "जिल्हा",
      "form.continue": "पुढे जा",
      "chatbot.placeholder": "काहीही विचारा...",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
