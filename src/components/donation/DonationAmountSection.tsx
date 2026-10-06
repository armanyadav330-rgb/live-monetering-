import React, { useState, useRef } from 'react';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import { DonationFrequency, DonationCause } from '../../types/donation';

interface DonationAmountSectionProps {
  onProceedToDonate: (amount: number, frequency: DonationFrequency, cause: DonationCause) => void;
  preselectedCause?: DonationCause;
}

export const DonationAmountSection: React.FC<DonationAmountSectionProps> = ({
  onProceedToDonate,
  preselectedCause = 'ALL',
}) => {
  // Amount field starts completely EMPTY - no predefined or hardcoded amount
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<number | 'CUSTOM' | null>(null);
  const [frequency, setFrequency] = useState<DonationFrequency>('ONE_TIME');
  const [selectedCause, setSelectedCause] = useState<DonationCause>(preselectedCause);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Quick Amount Options as required: ₹100 | ₹500 | ₹1,000 | ₹2,000 | Custom
  const quickOptions = [
    { value: 100, label: '₹100' },
    { value: 500, label: '₹500' },
    { value: 1000, label: '₹1,000' },
    { value: 2000, label: '₹2,000' },
  ];

  const handleSelectQuick = (val: number) => {
    setSelectedPreset(val);
    setAmountStr(val.toString());
    setValidationError(null);
  };

  const handleSelectCustom = () => {
    setSelectedPreset('CUSTOM');
    setValidationError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits - prevent negative values or non-digit input
    const clean = e.target.value.replace(/[^0-9]/g, '');
    setAmountStr(clean);
    setValidationError(null);

    const num = parseInt(clean, 10);
    if (!isNaN(num) && quickOptions.some((q) => q.value === num)) {
      setSelectedPreset(num);
    } else {
      setSelectedPreset(clean ? 'CUSTOM' : null);
    }
  };

  const numericAmount = parseInt(amountStr, 10);
  const isValidAmount = !isNaN(numericAmount) && numericAmount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amountStr || amountStr.trim() === '') {
      setValidationError('Amount cannot be empty. Please enter a donation amount.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    const num = parseInt(amountStr, 10);
    if (isNaN(num) || num <= 0) {
      setValidationError('Amount must be greater than ₹0. Negative or zero values are not allowed.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setValidationError(null);
    // Explicit user-entered amount passed cleanly to the next donation/payment step
    onProceedToDonate(num, frequency, selectedCause);
  };

  return (
    <section
      id="donation-amount-section"
      className="py-16 sm:py-20 bg-white border-b border-slate-200"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 sm:p-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transparent Direct Giving · 100% Tax Deductible (Sec 80G)</span>
          </div>

          {/* 1. Clear Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Enter Donation Amount
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
            You have complete control over your contribution. Enter the exact amount you wish
            to donate to support verified community welfare initiatives.
          </p>

          {/* Frequency Toggle: One-Time vs Monthly */}
          <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFrequency('ONE_TIME')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                frequency === 'ONE_TIME'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              One-Time Gift
            </button>
            <button
              type="button"
              onClick={() => setFrequency('MONTHLY')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                frequency === 'MONTHLY'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Monthly Sustainer</span>
            </button>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
            {/* 2. Amount Input Box */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-3">
              <label
                htmlFor="donation-amount-input"
                className="text-xs sm:text-sm font-bold text-slate-800 block"
              >
                Donation Amount (in INR) *
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-4 text-2xl font-black text-slate-900">₹</span>
                <input
                  id="donation-amount-input"
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="₹ Enter amount"
                  value={amountStr}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3.5 text-xl sm:text-2xl font-black rounded-xl border-2 text-slate-900 focus:outline-hidden transition placeholder:text-slate-400 ${
                    validationError
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                      : 'border-slate-300 bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20'
                  }`}
                  aria-invalid={!!validationError}
                  aria-describedby={validationError ? 'amount-error-msg' : undefined}
                />
              </div>

              {/* 5. Clear Validation Message */}
              {validationError && (
                <div
                  id="amount-error-msg"
                  className="flex items-center gap-1.5 text-xs text-rose-600 font-bold mt-1"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* 4. Quick Amount Buttons: ₹100 | ₹500 | ₹1,000 | ₹2,000 | Custom */}
            <div>
              <div className="text-xs font-bold text-slate-600 mb-2">
                Quick Amount Options (Select to set amount):
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {quickOptions.map((opt) => {
                  const isSelected = selectedPreset === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectQuick(opt.value)}
                      className={`py-3 px-2 rounded-xl text-center font-bold text-sm border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md scale-102'
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}

                {/* Custom Button */}
                <button
                  type="button"
                  onClick={handleSelectCustom}
                  className={`py-3 px-2 rounded-xl text-center font-bold text-sm border-2 transition-all cursor-pointer ${
                    selectedPreset === 'CUSTOM'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Cause Allocation Selector */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Allocate your contribution to a specific program (Optional):
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ALL' as DonationCause, label: 'Where Needed Most' },
                  { id: 'EDUCATION' as DonationCause, label: 'Education & Scholarships' },
                  { id: 'NUTRITION' as DonationCause, label: 'Food & Nutrition' },
                  { id: 'HEALTHCARE' as DonationCause, label: 'Healthcare & Wellness' },
                  { id: 'COMMUNITY_DEV' as DonationCause, label: 'Community Development' },
                ].map((cause) => (
                  <button
                    key={cause.id}
                    type="button"
                    onClick={() => setSelectedCause(cause.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedCause === cause.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {cause.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Selected Contribution Summary */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Selected Contribution Summary
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    Donation Amount: {isValidAmount ? `₹${numericAmount.toLocaleString('en-IN')}` : '—'}
                  </div>
                </div>
              </div>

              {isValidAmount && (
                <div className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>50% Deduction under Sec 80G</span>
                </div>
              )}
            </div>

            {/* 7. Action Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant 80G tax receipt issued upon confirmation.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-98 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Donate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
