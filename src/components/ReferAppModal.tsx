import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Gift,
  Users,
  Award,
  ChevronRight,
  MessageSquare,
  Sparkles,
  X,
  Send,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { LanguageCode } from '../types.ts';

interface ReferAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  userPhone?: string;
  userName?: string;
}

export const ReferAppModal: React.FC<ReferAppModalProps> = ({
  isOpen,
  onClose,
  language,
  userPhone = '9876543210',
  userName = 'किसान भाई'
}) => {
  const [copied, setCopied] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  if (!isOpen) return null;

  // Generate a clean referral code based on user phone or name
  const cleanPhone = userPhone.replace(/\D/g, '').slice(-4) || '2026';
  const referralCode = `KISAN-${cleanPhone}`;
  const appShareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kisanmitra.app';
  const referralLink = `${appShareUrl}?ref=${referralCode}`;

  // Multi-language share messages for Indian farmers
  const shareMessages: Record<LanguageCode, { headline: string; body: string; rewardNote: string }> = {
    hi: {
      headline: 'किसान मित्र ऐप - अपने साथी किसानों को जोड़ें',
      body: `राम-राम किसान भाई! 🌾\nमैंने अपनी फसल की जांच और खाद-दवाई के लिए *किसान साथी (Kisan Mitra)* ऐप उपयोग किया है। इसमें पत्ती की फोटो खींचते ही बीमारी का पक्का इलाज और नजदीकी दुकानदार से सीधी डिलीवरी मिलती है।\n\n👇 अभी ऐप डाउनलोड करें या खोलें:\n${referralLink}\n\n🎁 मेरा रेफरल कोड उपयोग करें: *${referralCode}*\n(आपको और मुझे दोनों को पहली खाद-दवाई ऑर्डर पर ₹100 की छूट मिलेगी)`,
      rewardNote: 'हर सफल रेफरल पर आपको ₹100 का एग्री-इनपुट वाउचर और आपके साथी को ₹100 का डिस्काउंट मिलता है।'
    },
    en: {
      headline: 'Refer Kisan Mitra to Fellow Farmers',
      body: `Namaste Farmer Friend! 🌾\nI am using *Kisan Mitra / Krishi Saathi* AI app to scan crop diseases and buy authentic agri-inputs from local dealers.\n\n👇 Open & Install the app here:\n${referralLink}\n\n🎁 Use my referral code: *${referralCode}*\n(Get ₹100 discount on your first fertilizer or pesticide order!)`,
      rewardNote: 'Earn ₹100 Agri-Credit voucher for each farmer friend who joins and places their first order.'
    },
    mr: {
      headline: 'शेतकरी मित्रांना रेफर करा - बक्षीस मिळवा',
      body: `राम-राम शेतकरी मित्रा! 🌾\nमी पिकावरील कीड-रोग तपासणीसाठी *किसान मित्र* एआय ॲप वापरत आहे. फोटो काढून लगेच खात्रीशीर औषध फवारणी सल्ला मिळतो.\n\n👇 ॲप लगेच उघडा:\n${referralLink}\n\n🎁 माझा रेफरल कोड वापरा: *${referralCode}*\n(पहिल्या खत-औषध खरेदीवर ₹100 ची सवलत मिळवा)`,
      rewardNote: 'प्रत्येक यशस्वी संदर्भावर (Referral) तुम्हाला आणि तुमच्या मित्राला ₹100 चे कृषी व्हाउचर मिळते.'
    },
    te: {
      headline: 'రైతు మిత్రులకు రిఫర్ చేయండి - రివార్డులు పొందండి',
      body: `నమస్కారం రైతు మిత్రమా! 🌾\nనేను నా పంట తెగుళ్లను గుర్తించడానికి మరియు స్థానిక డీలర్ల నుండి మందులు ఆర్డర్ చేయడానికి *కిసాన్ మిత్ర* యాప్‌ను వాడుతున్నాను.\n\n👇 యాప్‌ని ఇప్పుడే తెరవండి:\n${referralLink}\n\n🎁 నా రిఫరల్ కోడ్ వాడండి: *${referralCode}*\n(మీ మొదటి ఆర్డర్‌పై ₹100 తగ్గింపు పొందండి)`,
      rewardNote: 'ప్రతి విజయవంతమైన రిఫరల్‌పై మీకు మరియు మీ స్నేహితుడికి ₹100 వ్యవసాయ వోచర్ లభిస్తుంది.'
    }
  };

  const currentMsg = shareMessages[language] || shareMessages.hi;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMsg.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(currentMsg.body);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kisan Mitra - AI Crop Doctor & Input Store',
          text: currentMsg.body,
          url: referralLink
        });
      } catch (e) {
        handleWhatsAppShare();
      }
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
        {/* Header with Festive Green Gradient */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-t-3xl flex items-center justify-between border-b border-emerald-600">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-1.5 leading-tight">
                <span>{language === 'hi' ? 'किसान रेफर व कमाई' : language === 'mr' ? 'रेफर करा आणि कमवा' : language === 'te' ? 'రిఫర్ & రివార్డ్స్' : 'Refer & Earn'}</span>
                <span className="text-[10px] bg-amber-400 text-stone-900 px-1.5 py-0.2 rounded-full font-black">
                  ₹100 + ₹100
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                {language === 'hi' ? 'साथी किसानों की मदद करें, दोनों इनाम पाएं' : 'Share with farmers & both earn vouchers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Reward Banner */}
          <div className="bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3.5 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-stone-900 text-sm">
                  {language === 'hi' ? 'दोनों को ₹100 की छूट' : language === 'mr' ? 'दोघांनाही ₹100 ची सूट' : language === 'te' ? 'ఇద్దరికీ ₹100 తగ్గింపు' : 'Both Get ₹100 Agri-Voucher'}
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {currentMsg.rewardNote}
                </p>
              </div>
            </div>

            {/* Visual 3-step progress */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-200/60 text-center">
              <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-black text-emerald-800 block">1. लिंक भेजें</span>
                <span className="text-[9px] text-stone-500">WhatsApp पर शेयर करें</span>
              </div>
              <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-black text-emerald-800 block">2. साथी जुड़ेगा</span>
                <span className="text-[9px] text-stone-500">ऐप से फसल जांचेगा</span>
              </div>
              <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-black text-amber-700 block">3. वाउचर पाएं</span>
                <span className="text-[9px] text-stone-500">खाद-दवाई पर ₹100 ऑफ</span>
              </div>
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="bg-stone-50 border-2 border-dashed border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                {language === 'hi' ? 'आपका रेफरल कोड' : language === 'mr' ? 'तुमचा रेफरल कोड' : language === 'te' ? 'మీ రిఫరల్ కోడ్' : 'Your Referral Code'}
              </span>
              <span className="text-lg font-black text-emerald-900 font-mono tracking-wide">
                {referralCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>कॉपी हुआ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>कॉपी करें</span>
                </>
              )}
            </button>
          </div>

          {/* WhatsApp One-Tap Share Action */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>
              {language === 'hi'
                ? 'व्हाट्सएप पर किसानों को भेजें'
                : language === 'mr'
                ? 'व्हॉट्सॲपवर मित्रांना पाठवा'
                : language === 'te'
                ? 'వాట్సాప్‌లో రైతులకు షేర్ చేయండి'
                : 'Share via WhatsApp'}
            </span>
          </button>

          {/* System Native Share / Other Apps */}
          <button
            onClick={handleNativeShare}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors border border-stone-200"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'hi' ? 'अन्य ऐप्स से शेयर करें (SMS / Telegram)' : 'Share via Other Apps'}
            </span>
          </button>

          {/* Message Preview */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                {language === 'hi' ? 'व्हाट्सएप मैसेज प्रीव्यू' : 'Message Preview'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <Send className="w-3 h-3" /> Auto-Formatted
              </span>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-2.5 text-[11px] text-stone-700 leading-relaxed font-sans whitespace-pre-line border-l-4 border-l-emerald-600 shadow-2xs">
              {currentMsg.body}
            </div>
          </div>

          {/* Referral Stats / Summary */}
          <div className="bg-emerald-900 text-white rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">
                  {language === 'hi' ? 'आपके रेफरल' : 'Your Referrals'}
                </span>
                <span className="text-sm font-black">
                  3 किसान जुड़े • ₹300 वाउचर क्रेडिट
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-700 px-2 py-1 rounded-lg font-bold text-emerald-100">
              सक्रिय
            </span>
          </div>

          {/* FAQ Toggle */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="w-full p-3 flex items-center justify-between text-left font-bold text-stone-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'रेफरल नियम व सवाल' : 'Referral FAQs & Terms'}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${showFaq ? 'rotate-90' : ''}`} />
            </button>
            {showFaq && (
              <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-600 space-y-1.5">
                <p>• <strong>कौन रेफर कर सकता है?</strong> कोई भी पंजीकृत किसान या डीलर अपने साथी किसान को जोड़ सकता है।</p>
                <p>• <strong>छूट कब मिलेगी?</strong> जैसे ही आपके दोस्त पहली बार किसी नजदीकी दुकानदार से खाद या कीटनाशक ऑर्डर करेंगे, ₹100 आपके और उनके खाते में जुड़ जाएंगे।</p>
                <p>• <strong>वाउचर की वैधता:</strong> वाउचर कृषि साथी के सभी अधिकृत डीलरों पर रिडीम किया जा सकता है।</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between rounded-b-3xl">
          <span className="text-[11px] text-stone-500 font-medium">
            🌾 किसान साथी - आत्मनिर्भर किसान
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
