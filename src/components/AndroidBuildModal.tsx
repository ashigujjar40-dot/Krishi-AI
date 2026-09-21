import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode } from '../types.ts';

interface AndroidBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  language: LanguageCode;
}

export const AndroidBuildModal: React.FC<AndroidBuildModalProps> = ({
  isOpen,
  onClose,
  canInstallPwa,
  onInstallPwa,
  language
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedTrouble, setExpandedTrouble] = useState<string | null>('sdk');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white rounded-t-3xl flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-1.5 leading-tight">
                <span>Native Android APK & Build</span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                Package: com.kisanmitra.app • Gradle Ready
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Status Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-xs">
                Native Android Project Synced
              </h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Capacitor native Android project is generated in <code>/android</code> with full Gradle wrapper, Camera, Mic, and GPS permissions.
              </p>
            </div>
          </div>

          {/* Direct APK Download Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>Direct APK Download</span>
                    <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-1.5 py-0.2 rounded-full">
                      v1.0.0
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-200">
                    kisan-mitra.apk (Ready to download)
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed">
              Click below to download the application APK directly to your phone or computer.
            </p>

            <a
              href="/api/download-apk"
              download="kisan-mitra.apk"
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black py-3 rounded-xl shadow flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download APK File (kisan-mitra.apk)</span>
            </a>
          </div>

          {/* Option 1: Instant PWA Install on Physical Phone */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-stone-900">1. Instant Phone Install (PWA)</h4>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Zero Setup
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Open this app URL in mobile Chrome on your physical Android phone and tap below to install as a standalone app on your home screen.
            </p>
            <button
              onClick={onInstallPwa}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{canInstallPwa ? 'Install on Android Phone Now' : 'Add to Home Screen (Mobile Chrome)'}</span>
            </button>
          </div>

          {/* Option 2: Build Native APK on PC */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-stone-900">2. Generate .APK via Terminal / Gradle</h4>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">
                CLI
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Export/Download project from AI Studio, unzip, and run these commands to build the installable debug APK:
            </p>

            <div className="bg-stone-900 text-stone-100 p-2.5 rounded-xl font-mono text-[11px] relative">
              <pre className="overflow-x-auto whitespace-pre leading-relaxed">
{`npm run build
npx cap sync android
cd android
./gradlew assembleDebug`}
              </pre>
              <button
                onClick={() => copyToClipboard(`npm run build\nnpx cap sync android\ncd android\n./gradlew assembleDebug`, 1)}
                className="absolute top-2 right-2 bg-stone-800 hover:bg-stone-700 text-stone-300 p-1.5 rounded-md text-[10px] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[10px] text-stone-500 font-mono">
              Output APK: android/app/build/outputs/apk/debug/app-debug.apk
            </p>
          </div>

          {/* Option 3: GitHub Actions Cloud Build */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-stone-900">3. Free Cloud APK (GitHub Actions)</h4>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                No PC Needed
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Export to GitHub using AI Studio Settings. Your repo includes <code>.github/workflows/android-build.yml</code> which compiles <code>app-debug.apk</code> automatically in GitHub Artifacts on push!
            </p>
          </div>

          {/* Troubleshooting Section (Self-Fixing Instructions) */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>APK / Build समस्याओं का समाधान (Self-Fixing)</span>
            </div>

            <div className="space-y-2">
              {/* SDK Not Found */}
              <div className="border border-stone-200 bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedTrouble(expandedTrouble === 'sdk' ? null : 'sdk')}
                  className="w-full text-left px-3 py-2 font-bold text-stone-800 flex items-center justify-between text-[11px]"
                >
                  <span>1. SDK location not found error</span>
                  {expandedTrouble === 'sdk' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {expandedTrouble === 'sdk' && (
                  <div className="p-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-700 space-y-1">
                    <p><code>android/local.properties</code> फ़ाइल बनाएं और अपना Android SDK पथ डालें:</p>
                    <code className="block bg-stone-200 p-1.5 rounded text-[10px] font-mono">
                      sdk.dir=C:\\Users\\YOUR_NAME\\AppData\\Local\\Android\\Sdk
                    </code>
                  </div>
                )}
              </div>

              {/* Java Version Mismatch */}
              <div className="border border-stone-200 bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedTrouble(expandedTrouble === 'java' ? null : 'java')}
                  className="w-full text-left px-3 py-2 font-bold text-stone-800 flex items-center justify-between text-[11px]"
                >
                  <span>2. Java Version / Class file major version error</span>
                  {expandedTrouble === 'java' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {expandedTrouble === 'java' && (
                  <div className="p-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-700 space-y-1">
                    <p>Gradle 8 के लिए <strong>Java JDK 17</strong> अनिवार्य है। Android Studio Settings &gt; Gradle JDK में जाकर JDK 17 सेलेक्ट करें।</p>
                  </div>
                )}
              </div>

              {/* App Not Installed on Phone */}
              <div className="border border-stone-200 bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedTrouble(expandedTrouble === 'install' ? null : 'install')}
                  className="w-full text-left px-3 py-2 font-bold text-stone-800 flex items-center justify-between text-[11px]"
                >
                  <span>3. फोन पर "App Not Installed" का एरर</span>
                  {expandedTrouble === 'install' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {expandedTrouble === 'install' && (
                  <div className="p-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-700 space-y-1">
                    <p>• यदि पहले कोई पुराना ऐप इनस्टॉल था तो पहले उसे <strong>Uninstall</strong> करें।</p>
                    <p>• Android Settings &gt; Install Unknown Apps में Chrome या Files ऐप को परमिशन दें।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between rounded-b-3xl">
          <span className="text-[11px] text-stone-500">
            Guide file: <code>ANDROID_BUILD_GUIDE.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
