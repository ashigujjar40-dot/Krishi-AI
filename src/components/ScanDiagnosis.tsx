import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertOctagon,
  HelpCircle,
  Clock,
  ArrowRight,
  ShoppingBag,
  RotateCcw,
  CheckCircle,
  X
} from 'lucide-react';
import { LanguageCode, CropDiagnosisResult, TreatmentOption } from '../types.ts';
import { INDIAN_CROPS } from '../data/agriData.ts';
import { I18N_TEXTS } from '../i18n.ts';
import { createSpeechRecognizer } from '../utils/speech.ts';

interface ScanDiagnosisProps {
  language: LanguageCode;
  onDiagnosisComplete: (result: CropDiagnosisResult) => void;
  onOrderProduct: (productName: string) => void;
  onPlaySpeech: (text: string) => void;
  onStopSpeech: () => void;
  isSpeaking: boolean;
}

export const ScanDiagnosis: React.FC<ScanDiagnosisProps> = ({
  language,
  onDiagnosisComplete,
  onOrderProduct,
  onPlaySpeech,
  onStopSpeech,
  isSpeaking
}) => {
  const t = I18N_TEXTS[language];

  // Diagnosis input states
  const [selectedCrop, setSelectedCrop] = useState<string>('Cotton');
  const [images, setImages] = useState<string[]>([]);
  const [symptomsText, setSymptomsText] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<CropDiagnosisResult | null>(null);
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<'organic' | 'chemical'>('organic');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Handle Photo Uploads (1-3 photos)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 3 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Voice recognition toggle
  const toggleVoiceInput = () => {
    if (isRecordingVoice) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecordingVoice(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      language,
      (transcript) => {
        setSymptomsText(prev => prev ? `${prev} ${transcript}` : transcript);
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsRecordingVoice(false);
      },
      () => {
        setIsRecordingVoice(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        recognitionRef.current = recognizer;
        setIsRecordingVoice(true);
      } catch (err) {
        console.error('Failed to start voice recognition', err);
      }
    } else {
      alert('Voice recording not supported in this browser. Please type symptoms or upload photo.');
    }
  };

  // Run AI diagnosis
  const handleDiagnose = async () => {
    if (images.length === 0 && !symptomsText.trim()) {
      alert('Please upload at least 1 photo or speak/type your symptoms.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          symptoms: symptomsText,
          images,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.diagnosis) {
        setDiagnosisResult(data.diagnosis);
        onDiagnosisComplete(data.diagnosis);
      } else {
        throw new Error(data.error || 'Diagnosis failed');
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      alert('Could not complete diagnosis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setDiagnosisResult(null);
    setImages([]);
    setSymptomsText('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* If Result is generated, display Full Results & Recommendations Screen */}
      {diagnosisResult ? (
        <div className="space-y-4">
          {/* Header pill & Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another Plant</span>
            </button>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diagnosed</span>
            </span>
          </div>

          {/* Diagnosis Summary Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {diagnosisResult.cropName} • {diagnosisResult.problemType.toUpperCase().replace('_', ' ')}
                </span>
                <h3 className="text-lg font-extrabold text-stone-900 leading-snug">
                  {diagnosisResult.problemNameTranslated || diagnosisResult.problemName}
                </h3>
                {diagnosisResult.problemNameTranslated && (
                  <p className="text-xs text-stone-600 font-medium">
                    {diagnosisResult.problemName}
                  </p>
                )}
                {diagnosisResult.scientificName && (
                  <p className="text-[11px] text-stone-400 italic">
                    {diagnosisResult.scientificName}
                  </p>
                )}
              </div>

              {/* Audio Playback button */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    onStopSpeech();
                  } else {
                    const textToRead = diagnosisResult.audioSummaryText ||
                      `${diagnosisResult.cropName} में ${diagnosisResult.problemNameTranslated || diagnosisResult.problemName}। जैविक उपाय और अनुशंसित दवाई देखें।`;
                    onPlaySpeech(textToRead);
                  }
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm ${
                  isSpeaking
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                }`}
                title="Voice read diagnosis"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span>{isSpeaking ? t.stopAudio : t.listenAdvice}</span>
              </button>
            </div>

            {/* Confidence & Severity Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-[10px] text-stone-500 block uppercase font-medium">
                  {t.confidence}
                </span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-base font-extrabold text-stone-900">
                    {diagnosisResult.confidence}%
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    diagnosisResult.confidence >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {diagnosisResult.confidence >= 80 ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-[10px] text-stone-500 block uppercase font-medium">
                  {t.severity}
                </span>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 mt-0.5 rounded-lg ${
                  diagnosisResult.severity === 'severe'
                    ? 'bg-rose-100 text-rose-800'
                    : diagnosisResult.severity === 'moderate'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {diagnosisResult.severity === 'mild' ? t.mild : diagnosisResult.severity === 'moderate' ? t.moderate : t.severe}
                </span>
              </div>
            </div>

            {/* Low Confidence / Needs Expert Review Alert */}
            {diagnosisResult.needsExpertReview && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
                <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Follow-up check recommended:</span>
                  <p className="mt-0.5">Confidence is moderate. Our human agronomist Dr. Sunita is reviewing this case.</p>
                </div>
              </div>
            )}

            {/* Symptoms list */}
            {diagnosisResult.symptomsObserved && diagnosisResult.symptomsObserved.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <span>{t.symptoms}</span>
                </h4>
                <ul className="space-y-1">
                  {diagnosisResult.symptomsObserved.map((symp, i) => (
                    <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{symp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Treatment Options Tabs: Organic First, Then Approved Chemical */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">
                {t.treatments}
              </h3>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                CIBRC Compliant
              </span>
            </div>

            {/* 2-Tab Switcher: Organic vs Chemical */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setActiveTreatmentTab('organic')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTreatmentTab === 'organic'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🌿 {t.organicFirst}
              </button>
              <button
                onClick={() => setActiveTreatmentTab('chemical')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTreatmentTab === 'chemical'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🧪 {t.chemicalTreatment}
              </button>
            </div>

            {/* Display Filtered Treatment */}
            {diagnosisResult.treatments
              .filter(tItem => tItem.type === activeTreatmentTab || (activeTreatmentTab === 'organic' && tItem.type === 'cultural'))
              .map((item, idx) => (
                <div key={idx} className="border border-stone-200 rounded-xl p-3.5 space-y-2.5 bg-stone-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {item.title}
                      </span>
                      <h4 className="text-sm font-extrabold text-stone-900">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-stone-600">
                        Active Ingredient: <span className="font-semibold">{item.activeIngredient}</span>
                      </p>
                    </div>
                    {item.estimatedCostInr && (
                      <span className="text-xs font-extrabold text-stone-800 bg-white border border-stone-200 px-2 py-1 rounded-lg">
                        ₹{item.estimatedCostInr}
                      </span>
                    )}
                  </div>

                  {/* Dosage & Timing */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-stone-100">
                      <span className="text-[10px] text-stone-500 block font-semibold">{t.dose}</span>
                      <span className="font-medium text-stone-800">{item.dosePerAcre}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-100">
                      <span className="text-[10px] text-stone-500 block font-semibold">{t.timing}</span>
                      <span className="font-medium text-stone-800">{item.applicationTiming}</span>
                    </div>
                  </div>

                  {/* Waiting Period / PHI */}
                  {item.waitingPeriodDays !== undefined && (
                    <div className="text-[11px] bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{t.preHarvestInterval}: <strong>{item.waitingPeriodDays} {t.daysWaiting}</strong></span>
                    </div>
                  )}

                  {/* Safety & PPE */}
                  {item.safetyPrecautions && item.safetyPrecautions.length > 0 && (
                    <div className="text-xs">
                      <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.safety}:</span>
                      </span>
                      <p className="text-stone-600 mt-0.5 text-[11px]">
                        {item.safetyPrecautions.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Order Button to local dealers */}
                  <button
                    onClick={() => onOrderProduct(item.productName)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.findDealers}</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              ))}

            {/* Regulatory Disclaimer (Mandatory) */}
            <div className="bg-stone-100 text-stone-600 text-[10px] p-2.5 rounded-xl border border-stone-200">
              <p className="leading-relaxed">
                ⚠️ <strong>{t.disclaimerText}</strong>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Scan Input Form */
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {t.scanCrop}
              </h3>
              <p className="text-xs text-stone-500">
                {t.scanSub}
              </p>
            </div>

            {/* Step 1: Select Crop */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                1. {t.selectCrop}
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {INDIAN_CROPS.map((c) => {
                  const isSelected = selectedCrop.toLowerCase() === c.id || selectedCrop === c.name;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCrop(c.name.split(' ')[0])}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-sm">{c.icon}</span>
                      <span>
                        {language === 'hi' ? c.nameHi : language === 'mr' ? c.nameMr : language === 'te' ? c.nameTe : c.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Upload 1-3 Photos */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                2. {t.uploadPhoto} ({images.length}/3)
              </label>

              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-inner">
                    <img src={img} alt="Crop leaf" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-stone-900/80 text-white rounded-full p-1 hover:bg-rose-600 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center p-2 text-center bg-emerald-50/50 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-emerald-700 mb-1" />
                    <span className="text-[11px] font-bold text-emerald-800 leading-tight">
                      {images.length === 0 ? t.takePhoto : 'Add More'}
                    </span>
                    <span className="text-[9px] text-stone-500">Tap to upload</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Step 3: Voice / Text Symptom Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  3. {language === 'hi' ? 'लक्षण बताएं (बोलकर या लिखकर)' : language === 'mr' ? 'लक्षणे सांगा (बोलून किंवा लिहून)' : 'Describe Symptoms (Voice / Text)'}
                </label>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all border ${
                    isRecordingVoice
                      ? 'bg-red-500 text-white border-red-600 animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{isRecordingVoice ? 'Listening...' : t.describeVoice}</span>
                </button>
              </div>

              <textarea
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                rows={2}
                placeholder={
                  language === 'hi'
                    ? 'उदा. पत्तियां पीली पड़ रही हैं और किनारे सूख रहे हैं...'
                    : language === 'mr'
                    ? 'उदा. पानाच्या कडा करपत आहेत व बारीक किडी दिसत आहेत...'
                    : 'e.g. Yellow spots on upper leaves, curling edges, sudden wilting...'
                }
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none bg-stone-50/50"
              />
            </div>

            {/* Diagnose CTA Button */}
            <button
              onClick={handleDiagnose}
              disabled={isAnalyzing || (images.length === 0 && !symptomsText.trim())}
              className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm transition-all ${
                isAnalyzing || (images.length === 0 && !symptomsText.trim())
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.diagnosing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>{t.diagnoseNow}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
