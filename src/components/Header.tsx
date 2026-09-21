import React from 'react';
import { UserRole, LanguageCode } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';
import { Sprout, ShoppingBag, VolumeX, Download, RefreshCw, UserCheck, MessageSquare, Smartphone, Share2 } from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  language: LanguageCode;
  cartCount: number;
  isAudioPlaying: boolean;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onStopAudio: () => void;
  onOpenCart: () => void;
  onOpenWhatsApp: () => void;
  onOpenAndroidBuild: () => void;
  onOpenReferApp?: () => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  onChangeRole: (role: UserRole) => void;
  userName: string;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  language,
  cartCount,
  isAudioPlaying,
  canInstallPwa,
  onInstallPwa,
  onStopAudio,
  onOpenCart,
  onOpenWhatsApp,
  onOpenAndroidBuild,
  onOpenReferApp,
  onChangeLanguage,
  onChangeRole,
  userName,
  onOpenAuth
}) => {
  const t = I18N_TEXTS[language];

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-emerald-100 shadow-inner">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                {t.appName}
              </h1>
              <span className="text-[10px] bg-emerald-700 text-emerald-200 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                {role}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 truncate max-w-[140px]">
              {userName}
            </p>
          </div>
        </div>

        {/* Right Actions: Audio, WhatsApp Alerts, PWA Install, Language, Role, Cart */}
        <div className="flex items-center space-x-1.5">
          {isAudioPlaying && (
            <button
              onClick={onStopAudio}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg animate-pulse"
              title={t.stopAudio}
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}

          {/* WhatsApp Alerts Center Button */}
          <button
            onClick={onOpenWhatsApp}
            className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 rounded-lg transition-colors relative"
            title="WhatsApp Alerts"
          >
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-emerald-800 animate-pulse"></span>
          </button>

          {/* Refer App Button */}
          {onOpenReferApp && (
            <button
              onClick={onOpenReferApp}
              className="p-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-lg transition-all flex items-center gap-1 text-[11px] font-bold px-2 shadow-xs"
              title={t.referApp || 'Refer App'}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रेफर' : language === 'mr' ? 'रेफर' : 'Refer'}</span>
            </button>
          )}

          {/* Android Native APK & Build Center Button */}
          <button
            onClick={onOpenAndroidBuild}
            className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold px-2"
            title="Native Android APK & Build"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
            <span>APK</span>
          </button>

          {canInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="p-1.5 bg-emerald-700/90 hover:bg-emerald-600 text-emerald-100 rounded-lg flex items-center text-xs gap-1 font-medium px-2"
              title="Install App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">App</span>
            </button>
          )}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
            className="bg-emerald-900/80 border border-emerald-700 text-emerald-100 text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-400"
          >
            <option value="hi">हिन्दी</option>
            <option value="en">English</option>
            <option value="mr">मराठी</option>
            <option value="te">తెలుగు</option>
          </select>

          {/* Mode / Role Switcher Quick Pill */}
          <div className="relative group">
            <select
              value={role}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-emerald-700/70 border border-emerald-600 text-white text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-400"
            >
              <option value="farmer">🧑‍🌾 {t.farmer}</option>
              <option value="dealer">🏬 {t.dealer}</option>
              <option value="agronomist">🔬 {t.agronomist}</option>
            </select>
          </div>

          {/* Cart Icon (for Farmers) */}
          {role === 'farmer' && (
            <button
              onClick={onOpenCart}
              className="relative p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              title={t.cart}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
