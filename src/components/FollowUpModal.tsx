import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Camera, Upload, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { FollowUpRecord, LanguageCode } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface FollowUpModalProps {
  followUp: FollowUpRecord;
  language: LanguageCode;
  onClose: () => void;
  onSubmitOutcome: (outcome: 'improved' | 'same' | 'worse', notes?: string, photo?: string) => Promise<void>;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  followUp,
  language,
  onClose,
  onSubmitOutcome
}) => {
  const t = I18N_TEXTS[language];
  const [selectedOutcome, setSelectedOutcome] = useState<'improved' | 'same' | 'worse' | null>(null);
  const [notes, setNotes] = useState('');
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [escalationTriggered, setEscalationTriggered] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOutcome) {
      alert('Please select whether the crop condition has Improved, remained the Same, or gotten Worse.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitOutcome(selectedOutcome, notes, newPhoto || undefined);
      if (selectedOutcome === 'worse') {
        setEscalationTriggered(true);
      } else {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide bg-amber-50 px-2 py-0.5 rounded">
              Day {followUp.dayTarget} Health Checkup
            </span>
            <h3 className="text-base font-extrabold text-stone-900 mt-1">
              {followUp.cropName} Condition Follow-up
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {escalationTriggered ? (
          <div className="space-y-3 text-center py-3">
            <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-stone-900">
              Escalated to Human Agronomist
            </h4>
            <p className="text-xs text-stone-600">
              {t.escalatedToAgronomist}
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 text-left">
              <strong>Assigned Agronomist:</strong> Dr. Sunita Sharma (Chief Plant Pathologist). You will receive a direct phone or WhatsApp callback within 2 hours.
            </div>
            <button
              onClick={onClose}
              className="w-full bg-stone-900 text-white font-bold text-xs py-3 rounded-xl shadow mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-600">
              You diagnosed <strong>{followUp.problemName}</strong>. How is the crop condition responding to the recommended treatment?
            </p>

            {/* 3 Large Responsive Decision Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedOutcome('improved')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedOutcome === 'improved'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500'
                    : 'border-stone-200 hover:border-emerald-300 text-stone-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight">{t.improved}</span>
                <span className="text-[10px] text-emerald-700">सुधार हुआ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOutcome('same')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedOutcome === 'same'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500'
                    : 'border-stone-200 hover:border-amber-300 text-stone-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight">{t.same}</span>
                <span className="text-[10px] text-amber-700">वैसा ही है</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOutcome('worse')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedOutcome === 'worse'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500'
                    : 'border-stone-200 hover:border-rose-300 text-stone-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight">{t.worse}</span>
                <span className="text-[10px] text-rose-700">और बिगड़ा</span>
              </button>
            </div>

            {/* Optional Progress Photo Upload */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Upload New Progress Photo (Optional)
              </label>
              {newPhoto ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-200">
                  <img src={newPhoto} alt="New leaf progress" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setNewPhoto(null)}
                    className="absolute top-2 right-2 bg-stone-900/80 text-white rounded-full p-1 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-stone-50 text-stone-600 text-xs font-medium">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Take photo of current leaf</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Field Notes / Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Sprayed neem oil 2 days ago, yellow spots stopped spreading..."
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none"
              />
            </div>

            {/* Submit CTA */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedOutcome}
              className={`w-full font-bold text-xs py-3 rounded-xl shadow flex items-center justify-center gap-2 ${
                isSubmitting || !selectedOutcome
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : selectedOutcome === 'worse'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSubmitting ? (
                'Saving...'
              ) : selectedOutcome === 'worse' ? (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Escalate to Human Agronomist</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Follow-up Update</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
