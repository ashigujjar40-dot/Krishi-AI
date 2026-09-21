import React from 'react';
import { Home, ScanLine, ShoppingBag, User } from 'lucide-react';
import { LanguageCode } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

export type FarmerTab = 'home' | 'scan' | 'orders' | 'profile';

interface BottomNavProps {
  activeTab: FarmerTab;
  onSelectTab: (tab: FarmerTab) => void;
  language: LanguageCode;
  orderBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  language,
  orderBadgeCount = 0
}) => {
  const t = I18N_TEXTS[language];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-200 shadow-lg safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'home'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] leading-tight">{t.home}</span>
          {activeTab === 'home' && (
            <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full" />
          )}
        </button>

        {/* Tab 2: Scan (Hero centerpiece) */}
        <button
          onClick={() => onSelectTab('scan')}
          className={`flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'scan'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-2 -mt-4 rounded-full shadow-md transition-transform ${
            activeTab === 'scan'
              ? 'bg-emerald-700 text-white scale-110 shadow-emerald-700/30'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}>
            <ScanLine className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight font-medium text-emerald-900">
            {language === 'hi' ? 'जांच करें' : language === 'mr' ? 'स्कॅन' : language === 'te' ? 'స్కాన్' : 'Scan'}
          </span>
        </button>

        {/* Tab 3: Orders */}
        <button
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'orders'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 mb-0.5 ${activeTab === 'orders' ? 'stroke-[2.5]' : ''}`} />
            {orderBadgeCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {orderBadgeCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-tight">{t.orders}</span>
          {activeTab === 'orders' && (
            <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full" />
          )}
        </button>

        {/* Tab 4: Farm Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'profile'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] leading-tight">{t.profile}</span>
          {activeTab === 'profile' && (
            <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full" />
          )}
        </button>
      </div>
    </nav>
  );
};
