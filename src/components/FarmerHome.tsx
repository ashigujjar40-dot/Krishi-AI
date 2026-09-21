import React from 'react';
import { Camera, Mic, Wind, Droplets, Sun, AlertTriangle, ChevronRight, Store, CheckCircle2, Clock, Volume2, MessageSquare, Gift, Share2, Sparkles, Smartphone, Download } from 'lucide-react';
import { LanguageCode, WeatherAlert, FollowUpRecord, DealerStockItem } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface FarmerHomeProps {
  language: LanguageCode;
  weather: WeatherAlert | null;
  pendingFollowUps: FollowUpRecord[];
  nearbyDealers: DealerStockItem[];
  onStartScan: () => void;
  onOpenFollowUp: (record: FollowUpRecord) => void;
  onSelectDealer: (dealer: DealerStockItem) => void;
  onPlayWeatherAudio: () => void;
  onOpenWhatsApp?: () => void;
  onOpenReferApp?: () => void;
  onOpenAndroidBuild?: () => void;
}

export const FarmerHome: React.FC<FarmerHomeProps> = ({
  language,
  weather,
  pendingFollowUps,
  nearbyDealers,
  onStartScan,
  onOpenFollowUp,
  onSelectDealer,
  onPlayWeatherAudio,
  onOpenWhatsApp,
  onOpenReferApp,
  onOpenAndroidBuild
}) => {
  const t = I18N_TEXTS[language];

  // Distinct dealers
  const uniqueDealers = Array.from(
    new Map(nearbyDealers.map(d => [d.dealerId, d])).values()
  ).slice(0, 3);

  return (
    <div className="space-y-4 pb-20">
      {/* Hero: Scan Your Crop Big Action */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        {/* Subtle decorative leaf pattern */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-600/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-600/70 border border-emerald-400/30 px-2.5 py-1 rounded-full text-emerald-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              {language === 'hi' ? 'एआई फसल डॉक्टर' : language === 'mr' ? 'एआय पीक सल्लागार' : language === 'te' ? 'AI పంట సలహాదారు' : 'AI Crop Doctor'}
            </span>
            <span className="text-xs text-emerald-200">24x7 Free</span>
          </div>

          <h2 className="text-xl font-extrabold text-white mb-1.5 leading-snug">
            {t.scanCrop}
          </h2>
          <p className="text-xs text-emerald-100/90 mb-4 line-clamp-2">
            {t.scanSub}
          </p>

          {/* Big Green & White Button */}
          <button
            onClick={onStartScan}
            className="w-full bg-white text-emerald-900 hover:bg-emerald-50 active:scale-[0.98] transition-all font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-3 text-base border-2 border-emerald-200"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Camera className="w-5 h-5" />
            </div>
            <span>{language === 'hi' ? 'फोटो लें या लक्षण बताएं' : language === 'mr' ? 'फोटो काढा किंवा बोला' : language === 'te' ? 'ఫోటో తీయండి / మాట్లాడండి' : 'Diagnose Leaf Now'}</span>
            <ChevronRight className="w-5 h-5 text-emerald-700 ml-auto" />
          </button>
        </div>
      </div>

      {/* Active Follow-Ups Banner (Day 3 & Day 7 checkups) */}
      {pendingFollowUps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-xs">
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                {t.followUpDue}
              </span>
            </div>
            <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
              Action Due
            </span>
          </div>

          <div className="space-y-2">
            {pendingFollowUps.map((fup) => (
              <div
                key={fup.id}
                onClick={() => onOpenFollowUp(fup)}
                className="bg-white border border-amber-200/80 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-amber-400 active:bg-amber-50/50 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{fup.cropName}</span>
                    <span className="text-xs font-normal text-stone-500">({fup.dayTarget} Day Check)</span>
                  </h4>
                  <p className="text-xs text-stone-600 truncate max-w-[210px]">
                    {fup.problemName}
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                    {t.hasImproved}
                  </p>
                </div>
                <button className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  Update
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather & Next-Spray Advisory */}
      {weather && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-stone-900">
                {t.sprayAdvisory}
              </h3>
            </div>
            <div className="flex items-center space-x-1.5">
              {onOpenWhatsApp && (
                <button
                  onClick={onOpenWhatsApp}
                  className="p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1 text-[11px] font-medium"
                  title="WhatsApp Alerts"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              )}
              <button
                onClick={onPlayWeatherAudio}
                className="p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1 text-[11px] font-medium"
                title="Listen weather"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio</span>
              </button>
            </div>
          </div>

          {/* Spray Safety Indicator Pill */}
          <div className={`p-2.5 rounded-xl mb-3 flex items-center justify-between ${
            weather.sprayFeasible ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold">
                {weather.sprayFeasible ? t.safeToSpray : t.avoidSpray}
              </span>
            </div>
            <span className="text-xs font-semibold text-stone-600">
              {weather.tempCelsius}°C
            </span>
          </div>

          {/* Micro weather metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-stone-50 rounded-lg p-2 border border-stone-100">
              <span className="text-stone-500 block text-[10px]">Rain Risk</span>
              <span className="font-bold text-stone-800">{weather.rainProbabilityPercent}%</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-2 border border-stone-100">
              <span className="text-stone-500 block text-[10px]">Humidity</span>
              <span className="font-bold text-stone-800">{weather.humidityPercent}%</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-2 border border-stone-100">
              <span className="text-stone-500 block text-[10px]">Wind Speed</span>
              <span className="font-bold text-stone-800">{weather.windSpeedKmH} km/h</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-600 mt-2.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
            💡 {weather.sprayAdvisory}
          </p>
        </div>
      )}

      {/* Refer App & Earn Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-300/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-stone-900">
                  {t.referApp || 'Refer & Earn'}
                </h3>
                <span className="text-[9px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded-full uppercase">
                  ₹100 + ₹100
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                {t.referAppSub || 'Invite fellow farmers to Kisan Mitra and both get ₹100 off on agri-inputs!'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between">
          <span className="text-[11px] text-stone-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>कोड: <strong>KISAN-4321</strong></span>
          </span>
          <button
            onClick={onOpenReferApp}
            className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'रेफर करें' : language === 'mr' ? 'रेफर करा' : language === 'te' ? 'రిఫర్ చేయండి' : 'Refer Now'}</span>
          </button>
        </div>
      </div>

      {/* Direct APK Download Quick Banner */}
      <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Android APK Download</span>
              <span className="text-[9px] bg-emerald-500 text-stone-950 font-bold px-1.5 py-0.2 rounded-full">v1.0</span>
            </h4>
            <p className="text-[10px] text-stone-400">
              {language === 'hi' ? 'सीधे फोन में इनस्टॉल करने के लिए APK फाइल डाउनलोड करें' : 'Download APK file directly for your phone'}
            </p>
          </div>
        </div>
        <a
          href="/api/download-apk"
          download="kisan-mitra.apk"
          className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'APK डाउनलोड' : 'Download APK'}</span>
        </a>
      </div>

      {/* Nearby Input Dealers */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">
              {t.nearbyDealers}
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            Pincode: 444001
          </span>
        </div>

        <div className="space-y-2.5">
          {uniqueDealers.map((dealer) => (
            <div
              key={dealer.dealerId}
              onClick={() => onSelectDealer(dealer)}
              className="border border-stone-200 hover:border-emerald-400 active:bg-stone-50 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-stone-900">
                    {dealer.shopName}
                  </h4>
                  {dealer.verifiedDealer && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Proprietor: {dealer.dealerName} • Phone: +91 {dealer.phone}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-600">
                  <span className="text-emerald-700 font-semibold">📍 {dealer.distanceKm} km away</span>
                  <span>⭐ {dealer.rating} / 5</span>
                  <span className="text-emerald-800 bg-emerald-50 px-1 rounded">UPI & COD</span>
                </div>
              </div>
              <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200">
                View Stock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
