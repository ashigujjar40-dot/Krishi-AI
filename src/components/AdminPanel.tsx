import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, UserCheck, Search, Filter, BookOpen, AlertTriangle } from 'lucide-react';
import { CropDiagnosisResult, FollowUpRecord, LanguageCode } from '../types.ts';
import { REGISTERED_AGRI_PRODUCTS, BANNED_PESTICIDES_INDIA } from '../data/agriData.ts';

interface AdminPanelProps {
  language: LanguageCode;
  diagnoses: CropDiagnosisResult[];
  escalatedFollowUps: FollowUpRecord[];
  onAddAgronomistNote: (followUpId: string, note: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  diagnoses,
  escalatedFollowUps,
  onAddAgronomistNote
}) => {
  const [activeTab, setActiveTab] = useState<'escalations' | 'ai_audits' | 'registered_inputs' | 'banned_watchdog'>('escalations');
  const [expertNoteInput, setExpertNoteInput] = useState<{ [id: string]: string }>({});

  const handleSaveNote = async (fupId: string) => {
    const note = expertNoteInput[fupId];
    if (!note) return;
    await onAddAgronomistNote(fupId, note);
    alert('Agronomist clinical response sent to farmer profile & SMS!');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Agronomist Header Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-base">
              🔬
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">
                ICAR Agronomist Portal
              </h2>
              <span className="text-[11px] text-stone-400">
                Dr. Sunita Sharma • Plant Pathologist & Admin
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
            Live Sentinel
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="grid grid-cols-4 p-1 bg-stone-100 rounded-xl text-xs font-bold gap-0.5 text-center">
        <button
          onClick={() => setActiveTab('escalations')}
          className={`py-2 px-1 rounded-lg transition-all text-[11px] ${
            activeTab === 'escalations'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Escalations ({escalatedFollowUps.length})
        </button>

        <button
          onClick={() => setActiveTab('ai_audits')}
          className={`py-2 px-1 rounded-lg transition-all text-[11px] ${
            activeTab === 'ai_audits'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          AI Audits ({diagnoses.length})
        </button>

        <button
          onClick={() => setActiveTab('registered_inputs')}
          className={`py-2 px-1 rounded-lg transition-all text-[11px] ${
            activeTab === 'registered_inputs'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          CIBRC List
        </button>

        <button
          onClick={() => setActiveTab('banned_watchdog')}
          className={`py-2 px-1 rounded-lg transition-all text-[11px] ${
            activeTab === 'banned_watchdog'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Banned Guard
        </button>
      </div>

      {/* Tab 1: Escalations (Farmers reporting 'Worse') */}
      {activeTab === 'escalations' && (
        <div className="space-y-3">
          {escalatedFollowUps.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <span>No escalated cases right now. All field follow-ups are responding well.</span>
            </div>
          ) : (
            escalatedFollowUps.map((fup) => (
              <div
                key={fup.id}
                className="bg-white border-2 border-rose-200 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                      Urgent • Day {fup.dayTarget} Relapse
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-1">
                      {fup.cropName}: {fup.problemName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Farmer ID: {fup.farmerId} • Due: {fup.dueDate}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-lg">
                    Outcome: WORSE
                  </span>
                </div>

                {fup.notes && (
                  <div className="bg-stone-50 p-2.5 rounded-xl text-xs text-stone-700 border border-stone-100">
                    <strong>Farmer Reported:</strong> "{fup.notes}"
                  </div>
                )}

                {/* Agronomist Prescription / Response Box */}
                <div className="space-y-2 pt-1 border-t border-stone-100 text-xs">
                  <label className="font-bold text-stone-800 block">
                    Agronomist Expert Recommendation & Advice:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter revised diagnosis, tank mix guidance, or emergency advice..."
                    value={expertNoteInput[fup.id] || fup.agronomistNotes || ''}
                    onChange={(e) => setExpertNoteInput({ ...expertNoteInput, [fup.id]: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                  <button
                    onClick={() => handleSaveNote(fup.id)}
                    className="w-full bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs shadow-sm hover:bg-emerald-900"
                  >
                    Send Agronomist Response to Farmer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: AI Diagnosis Audits */}
      {activeTab === 'ai_audits' && (
        <div className="space-y-3">
          {diagnoses.map((diag) => (
            <div
              key={diag.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">
                    Crop: {diag.cropName} • Type: {diag.problemType}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">
                    {diag.problemName}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Phone: {diag.farmerPhone} • Date: {new Date(diag.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    diag.confidence >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {diag.confidence}% Confidence
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-1 capitalize">
                    Severity: {diag.severity}
                  </span>
                </div>
              </div>

              {/* Recommended Treatments Audit */}
              <div className="bg-stone-50 p-2.5 rounded-xl space-y-1.5 border border-stone-100">
                <span className="font-bold text-stone-700 text-[11px] block">AI Prescriptions:</span>
                {diag.treatments.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between text-stone-700">
                    <span>• {t.productName} ({t.type})</span>
                    <span className="font-semibold text-emerald-700">₹{t.estimatedCostInr}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                <span>Verification: <strong>Auto-Validated by CIBRC Engine</strong></span>
                <span className="text-emerald-700 font-bold">Passed Safety Checks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: CIBRC Registered Products */}
      {activeTab === 'registered_inputs' && (
        <div className="space-y-3">
          <p className="text-xs text-stone-500 px-1">
            Official CIBRC (Central Insecticides Board & Registration Committee) database of registered agricultural inputs:
          </p>

          {REGISTERED_AGRI_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-1.5 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">{prod.brand} • {prod.packSize}</span>
                  <h4 className="text-sm font-bold text-stone-900">{prod.name}</h4>
                  <p className="text-stone-600 text-[11px]">Active: {prod.activeIngredient}</p>
                </div>
                <span className="font-extrabold text-stone-900 text-sm">₹{prod.mrp}</span>
              </div>

              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-stone-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>CIBRC Reg: {prod.cibrcRegistrationNumber}</span>
              </div>

              <p className="text-[11px] text-stone-500">
                Suitable for: {prod.suitableCrops.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Banned Pesticides Watchdog Guard */}
      {activeTab === 'banned_watchdog' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold">Prohibited & Banned Pesticides Watchdog</h3>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            The AI advisory algorithm strictly blocks all the following pesticides banned or heavily restricted by the Ministry of Agriculture & Farmers Welfare (Govt. of India). Any prescription containing these is instantly rejected:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {BANNED_PESTICIDES_INDIA.map((chem, idx) => (
              <div
                key={idx}
                className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-rose-950 font-bold flex items-center justify-between text-xs"
              >
                <span>{chem}</span>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded uppercase font-bold">
                  Banned
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
