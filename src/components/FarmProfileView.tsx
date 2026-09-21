import React, { useState } from 'react';
import { Sprout, MapPin, Calendar, Plus, Droplet, History, ShoppingBag, ShieldCheck, ChevronRight, MessageSquare, Bell, CheckCircle2, Gift, Share2, Sparkles } from 'lucide-react';
import { FarmField, CropDiagnosisResult, Order, LanguageCode } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface FarmProfileViewProps {
  language: LanguageCode;
  fields: FarmField[];
  diagnosesHistory: CropDiagnosisResult[];
  ordersHistory: Order[];
  onAddField: (field: Omit<FarmField, 'id'>) => Promise<void>;
  onSelectPastDiagnosis: (diag: CropDiagnosisResult) => void;
  onOpenWhatsApp: () => void;
  onOpenReferApp?: () => void;
}

export const FarmProfileView: React.FC<FarmProfileViewProps> = ({
  language,
  fields,
  diagnosesHistory,
  ordersHistory,
  onAddField,
  onSelectPastDiagnosis,
  onOpenWhatsApp,
  onOpenReferApp
}) => {
  const t = I18N_TEXTS[language];

  const [isAddingField, setIsAddingField] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldCrop, setFieldCrop] = useState('Cotton');
  const [areaAcres, setAreaAcres] = useState('3.0');
  const [sowingDate, setSowingDate] = useState('2026-06-15');
  const [soilType, setSoilType] = useState('Medium Black Clay');
  const [irrigationType, setIrrigationType] = useState<'drip' | 'sprinkler' | 'flood' | 'rainfed'>('drip');
  const [pincode, setPincode] = useState('444001');

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddField({
      name: fieldName || `${fieldCrop} Plot`,
      crop: fieldCrop,
      areaAcres: parseFloat(areaAcres) || 2.5,
      sowingDate,
      soilType,
      irrigationType,
      pincode,
      lastSprayDate: new Date().toISOString().split('T')[0]
    });
    setIsAddingField(false);
    setFieldName('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Profile Overview Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            🌾
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Balwant Singh (किसान भाई)
            </h3>
            <p className="text-xs text-stone-500">
              +91 9876543210 • Pincode: 444001 (Akola, MH)
            </p>
          </div>
        </div>

        {/* Quick Land & Field Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase">Total Land</span>
            <span className="font-extrabold text-stone-900">
              {fields.reduce((acc, f) => acc + f.areaAcres, 0)} Acres
            </span>
          </div>
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase">Active Fields</span>
            <span className="font-extrabold text-stone-900">{fields.length}</span>
          </div>
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100">
            <span className="text-[10px] text-stone-500 block uppercase">Diagnoses</span>
            <span className="font-extrabold text-stone-900">{diagnosesHistory.length}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Notifications & Privacy Hub */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                WhatsApp Farm Notifications
              </h3>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Twilio / MSG91 Service Active</span>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWhatsApp}
            className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1"
          >
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-600 border border-stone-100 space-y-1">
          <p className="text-[11px]">
            Receive automated WhatsApp messages for <strong>Order Status Updates</strong>, <strong>Weather/Spray Advisories</strong>, and <strong>Day 3 & 7 Crop Follow-ups</strong>.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[10px] font-bold text-stone-500">
            <span>🔒 Privacy First</span>
            <span>•</span>
            <span>🚫 Zero Spam</span>
            <span>•</span>
            <span>⚡ Instant Status</span>
          </div>
        </div>
      </div>

      {/* Refer App Card in Profile */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-300 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'साथी किसानों को रेफर करें' : language === 'mr' ? 'शेतकरी मित्रांना रेफर करा' : 'Refer App to Farmers'}</span>
                <span className="text-[10px] bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded-full font-black">
                  ₹100
                </span>
              </h3>
              <p className="text-[11px] text-stone-600">
                {language === 'hi' ? 'शेयर करें और दोनों पाएं ₹100 का एग्री-वाउचर' : 'Share and both earn ₹100 discount vouchers'}
              </p>
            </div>
          </div>
          {onOpenReferApp && (
            <button
              onClick={onOpenReferApp}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रेफर करें' : 'Refer'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Fields / Plots Management */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>My Farm Fields & Crops</span>
          </h3>
          <button
            onClick={() => setIsAddingField(!isAddingField)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Field</span>
          </button>
        </div>

        {isAddingField && (
          <form onSubmit={handleCreateField} className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2.5 text-xs">
            <h4 className="font-bold text-stone-800">Register New Plot</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block">Field Name</label>
                <input
                  type="text"
                  placeholder="e.g. Riverbank Plot"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block">Primary Crop</label>
                <input
                  type="text"
                  value={fieldCrop}
                  onChange={(e) => setFieldCrop(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block">Area (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block">Sowing Date</label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingField(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-bold"
              >
                Save Field
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="border border-stone-200 rounded-xl p-3 flex items-center justify-between text-xs hover:border-emerald-300 transition-colors"
            >
              <div>
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{field.name}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                    {field.crop}
                  </span>
                </h4>
                <p className="text-stone-500 mt-0.5 text-[11px]">
                  {field.areaAcres} Acres • Sown: {field.sowingDate} • {field.irrigationType.toUpperCase()} Irrigation
                </p>
                {field.lastSprayDate && (
                  <p className="text-emerald-700 text-[10px] font-medium mt-0.5">
                    Last Spray: {field.lastSprayDate}
                  </p>
                )}
              </div>
              <span className="text-[11px] font-bold text-stone-400">PIN: {field.pincode}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis History per field */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
          <History className="w-4 h-4 text-emerald-700" />
          <span>Past Plant Diagnoses & Records</span>
        </h3>

        {diagnosesHistory.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-4">No past crop scans saved.</p>
        ) : (
          <div className="space-y-2">
            {diagnosesHistory.map((diag) => (
              <div
                key={diag.id}
                onClick={() => onSelectPastDiagnosis(diag)}
                className="border border-stone-200 hover:border-emerald-400 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900">
                      {diag.problemNameTranslated || diag.problemName}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      diag.problemType === 'pest' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {diag.problemType}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Crop: {diag.cropName} • Confidence: {diag.confidence}% • {new Date(diag.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seasonal Advisory & Safety Alert */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5">
        <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Indian Agronomy Advisory & Pest Alert</span>
        </h4>
        <p className="text-[11px] leading-relaxed">
          Kharif crop season vigilance: Monitor lower leaves for sucking pest damage in Cotton and Paddy blast in humid weather. Strictly avoid banned chemicals like Endosulfan or Monocrotophos. Always rotate chemical modes of action to prevent pest resistance.
        </p>
      </div>
    </div>
  );
};
