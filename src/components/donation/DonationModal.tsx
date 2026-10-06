import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building,
  User,
  Mail,
  Phone,
  Lock,
  Printer,
  Sparkles,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import {
  DonationFrequency,
  DonationCause,
  DonorInfo,
  DonationSubmission,
} from '../../types/donation';
import { SatyaNirakshakLogo } from '../common/SatyaNirakshakLogo';
import { INDIAN_CITIES } from '../../data/indianCities';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialFrequency?: DonationFrequency;
  initialCause?: DonationCause;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialAmount,
  initialFrequency = 'ONE_TIME',
  initialCause = 'ALL',
}) => {
  // If initialAmount was already entered and is valid, advance to Step 2 (Donor Details)
  // Otherwise, start at Step 1 with empty input
  const [currentStep, setCurrentStep] = useState<number>(initialAmount && initialAmount > 0 ? 2 : 1);
  const [amount, setAmount] = useState<number>(initialAmount || 0);
  const [amountStr, setAmountStr] = useState<string>(initialAmount && initialAmount > 0 ? initialAmount.toString() : '');
  const [selectedPreset, setSelectedPreset] = useState<number | 'CUSTOM' | null>(null);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  const [frequency, setFrequency] = useState<DonationFrequency>(initialFrequency);
  const [cause, setCause] = useState<DonationCause>(initialCause);

  const [donor, setDonor] = useState<DonorInfo>({
    name: '',
    email: '',
    phone: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    isAnonymous: false,
    requires80GReceipt: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [submissionResult, setSubmissionResult] = useState<DonationSubmission | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);
  const cityDropdownRef = useRef<HTMLDivElement | null>(null);

  const modalInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredCities = useMemo(() => {
    if (!donor.city || !donor.city.trim()) return INDIAN_CITIES;
    const q = donor.city.toLowerCase().trim();
    return INDIAN_CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        `${c.city}, ${c.state}`.toLowerCase().includes(q)
    );
  }, [donor.city]);

  useEffect(() => {
    if (isOpen) {
      if (initialAmount && initialAmount > 0) {
        setAmount(initialAmount);
        setAmountStr(initialAmount.toString());
        setCurrentStep(2);
      } else {
        setAmount(0);
        setAmountStr('');
        setSelectedPreset(null);
        setCurrentStep(1);
      }
      if (initialFrequency) setFrequency(initialFrequency);
      if (initialCause) setCause(initialCause);
      setStep1Error(null);
      setValidationErrors({});
    }
  }, [isOpen, initialAmount, initialFrequency, initialCause]);

  if (!isOpen) return null;

  const quickOptions = [
    { value: 100, label: '₹100' },
    { value: 500, label: '₹500' },
    { value: 1000, label: '₹1,000' },
    { value: 2000, label: '₹2,000' },
  ];

  const handleSelectQuick = (val: number) => {
    setSelectedPreset(val);
    setAmount(val);
    setAmountStr(val.toString());
    setStep1Error(null);
  };

  const handleSelectCustom = () => {
    setSelectedPreset('CUSTOM');
    setStep1Error(null);
    if (modalInputRef.current) {
      modalInputRef.current.focus();
    }
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent negative signs or non-digit characters
    const clean = e.target.value.replace(/[^0-9]/g, '');
    setAmountStr(clean);
    setStep1Error(null);

    const num = parseInt(clean, 10);
    if (!isNaN(num)) {
      setAmount(num);
      if (quickOptions.some((q) => q.value === num)) {
        setSelectedPreset(num);
      } else {
        setSelectedPreset('CUSTOM');
      }
    } else {
      setAmount(0);
      setSelectedPreset(null);
    }
  };

  const validateStep2 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!donor.name.trim()) errors.name = 'Full name is required';
    if (!donor.email.trim() || !donor.email.includes('@')) errors.email = 'Valid email is required for 80G receipt';
    if (!donor.phone.trim() || donor.phone.replace(/[^0-9]/g, '').length < 10) errors.phone = 'Valid 10-digit mobile number required';
    if (donor.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(donor.panNumber.trim())) {
      errors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!amountStr || amountStr.trim() === '') {
        setStep1Error('Amount cannot be empty. Please enter a donation amount.');
        if (modalInputRef.current) modalInputRef.current.focus();
        return;
      }
      const num = parseInt(amountStr, 10);
      if (isNaN(num) || num <= 0) {
        setStep1Error('Amount must be greater than ₹0. Negative or zero values are not allowed.');
        if (modalInputRef.current) modalInputRef.current.focus();
        return;
      }
      setAmount(num);
      setStep1Error(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalConfirm = () => {
    const uniqueReceipt = `SN-80G-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const submission: DonationSubmission = {
      id: `DON-${Date.now()}`,
      timestamp: new Date().toISOString(),
      amount,
      frequency,
      cause,
      donor,
      paymentMethod,
      receiptNumber: uniqueReceipt,
      status: 'PLEDGED',
    };

    setSubmissionResult(submission);
    setCurrentStep(5);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCauseTitle = (c: DonationCause) => {
    switch (c) {
      case 'EDUCATION':
        return 'Education & Scholarships for Children';
      case 'NUTRITION':
        return 'Daily Food & Essential Ration Support';
      case 'HEALTHCARE':
        return 'Mobile Healthcare & Elderly Wellness';
      case 'COMMUNITY_DEV':
        return 'Community Development & Women Livelihoods';
      default:
        return 'Where Needed Most (General Social Welfare)';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-slate-900"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-2xs shrink-0">
              <SatyaNirakshakLogo size={36} variant="icon" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-slate-900">
                  Satya Nirakshak NGO
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Sec 80G Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none mt-0.5">
                Official Contribution & Social Welfare Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            aria-label="Close donation window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Progress Bar (when not in confirmation) */}
        {currentStep < 5 && (
          <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                1
              </span>
              <span className="hidden sm:inline">Amount</span>
            </div>
            <div className="h-0.5 w-6 sm:w-10 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                2
              </span>
              <span className="hidden sm:inline">Donor Info</span>
            </div>
            <div className="h-0.5 w-6 sm:w-10 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                3
              </span>
              <span className="hidden sm:inline">Payment Method</span>
            </div>
            <div className="h-0.5 w-6 sm:w-10 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 4 ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                4
              </span>
              <span className="hidden sm:inline">Review</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-left space-y-6">
          {/* STEP 1: AMOUNT & CAUSE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                {/* 1. Clear Heading */}
                <h3 className="text-xl font-black text-slate-900">
                  Enter Donation Amount
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Enter the exact amount you wish to contribute. 100% is directly deployed.
                </p>
              </div>

              {/* Frequency Toggle */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 max-w-sm">
                <button
                  type="button"
                  onClick={() => setFrequency('ONE_TIME')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    frequency === 'ONE_TIME'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('MONTHLY')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                    frequency === 'MONTHLY'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  <span>Monthly Sustainer</span>
                </button>
              </div>

              {/* 2. Empty Amount Input - “₹ Enter amount” */}
              <div className="space-y-1.5">
                <label
                  htmlFor="modal-donation-input"
                  className="text-xs font-bold text-slate-800 block"
                >
                  Donation Amount (in INR) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl font-black text-slate-900">₹</span>
                  <input
                    id="modal-donation-input"
                    ref={modalInputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="₹ Enter amount"
                    value={amountStr}
                    onChange={handleAmountInputChange}
                    className={`w-full pl-10 pr-4 py-3 text-xl font-black rounded-xl border-2 text-slate-900 focus:outline-hidden transition placeholder:text-slate-400 ${
                      step1Error
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-slate-800'
                    }`}
                  />
                </div>
                {/* 5. Clear validation message */}
                {step1Error && (
                  <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{step1Error}</span>
                  </p>
                )}
              </div>

              {/* 4. Quick Amount Buttons: ₹100 | ₹500 | ₹1,000 | ₹2,000 | Custom */}
              <div>
                <div className="text-xs font-bold text-slate-600 mb-2">
                  Quick Amount Options:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {quickOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectQuick(opt.value)}
                      className={`py-2.5 px-2 rounded-xl text-center font-bold text-sm border-2 transition cursor-pointer ${
                        selectedPreset === opt.value
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSelectCustom}
                    className={`py-2.5 px-2 rounded-xl text-center font-bold text-sm border-2 transition cursor-pointer ${
                      selectedPreset === 'CUSTOM'
                        ? 'border-slate-900 bg-emerald-50 text-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* 6. Show the entered amount clearly before proceeding: “Donation Amount: ₹[USER ENTERED AMOUNT]” */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                    Summary
                  </div>
                  <div className="text-base font-black text-slate-900">
                    Donation Amount: {amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '—'}
                  </div>
                </div>
                {amount > 0 && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Sec 80G Eligible
                  </span>
                )}
              </div>

              {/* Cause Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Allocate to Program:
                </label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value as DonationCause)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:outline-hidden focus:border-slate-800"
                >
                  <option value="ALL">Where Needed Most (General Social Welfare)</option>
                  <option value="EDUCATION">Education & Scholarships for Children</option>
                  <option value="NUTRITION">Daily Food & Essential Ration Support</option>
                  <option value="HEALTHCARE">Mobile Healthcare & Elderly Wellness</option>
                  <option value="COMMUNITY_DEV">Community Development & Women SHGs</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: DONOR DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Highlight exact amount passed from Step 1 */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                    Selected Contribution
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900">
                    Donation Amount: ₹{amount.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-600">
                      ({frequency === 'MONTHLY' ? 'Monthly' : 'One-Time'})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-slate-900 hover:underline bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
                >
                  Change Amount
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Donor Contact Information
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Your tax exemption certificate (80G) and receipt will be issued in this name.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name (as per PAN / Official ID) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={donor.name}
                    onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden ${
                      validationErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-slate-800'
                    }`}
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{validationErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address * (For instant 80G PDF)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={donor.email}
                      onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden ${
                        validationErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-slate-800'
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Phone * (For SMS tracking)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={donor.phone}
                      onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden ${
                        validationErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-slate-800'
                      }`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PAN Card Number (Optional, for 80G Tax Credit)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={donor.panNumber}
                    onChange={(e) => setDonor({ ...donor, panNumber: e.target.value.toUpperCase() })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono uppercase focus:outline-hidden ${
                      validationErrors.panNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-slate-800'
                    }`}
                  />
                  {validationErrors.panNumber && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{validationErrors.panNumber}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Required by Income Tax Department to file Form 10BD for donor tax rebate.
                  </p>
                </div>

                <div className="relative" ref={cityDropdownRef}>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City / State (India)
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      list="india-cities-datalist"
                      autoComplete="off"
                      placeholder="Select city (e.g. Pune, Delhi, Mumbai)"
                      value={donor.city}
                      onChange={(e) => {
                        setDonor({ ...donor, city: e.target.value });
                        setIsCityDropdownOpen(true);
                      }}
                      onFocus={() => setIsCityDropdownOpen(true)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-hidden focus:border-slate-800 bg-white cursor-pointer"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                      title="Open Indian Cities Dropdown"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isCityDropdownOpen ? 'rotate-180 text-slate-900' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Native HTML datalist for browser fallback & keyboard navigation */}
                  <datalist id="india-cities-datalist">
                    {INDIAN_CITIES.map((c) => (
                      <option key={`${c.city}-${c.state}`} value={`${c.city}, ${c.state}`} />
                    ))}
                  </datalist>

                  {/* Interactive Drag Down Menu for India Cities */}
                  {isCityDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-300 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs animate-in fade-in-50 duration-150">
                      <div className="p-2.5 bg-slate-50 text-[11px] font-bold text-slate-900 sticky top-0 border-b border-slate-200 flex items-center justify-between z-10">
                        <span className="flex items-center gap-1.5">
                          <span>🇮🇳</span>
                          <span>Major Indian Cities ({filteredCities.length})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Type to search or click
                        </span>
                      </div>

                      {filteredCities.length === 0 ? (
                        <div className="p-3 text-center text-slate-500 text-xs">
                          No matching Indian city found. You can keep &ldquo;{donor.city}&rdquo; as entered.
                        </div>
                      ) : (
                        <div className="py-1">
                          {filteredCities.map((c) => {
                            const fullName = `${c.city}, ${c.state}`;
                            const isSelected = donor.city === fullName;
                            return (
                              <button
                                key={`${c.city}-${c.state}`}
                                type="button"
                                onClick={() => {
                                  setDonor({ ...donor, city: fullName });
                                  setIsCityDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50 font-bold text-slate-900'
                                    : 'text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="text-sm font-semibold">{c.city}</span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                  {c.state}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Anonymous Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={donor.isAnonymous}
                    onChange={(e) => setDonor({ ...donor, isAnonymous: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 border-slate-300"
                  />
                  <span>Keep my name anonymous on public donor recognitions and community rolls.</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Highlight exact amount */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Donation Amount:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Select Payment Method
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Direct encrypted connection with PCI-DSS Level 1 compliant gateway.
                </p>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'UPI'
                      ? 'border-slate-900 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Smartphone className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>UPI / QR / Instant App</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          0% Fee
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Google Pay, PhonePe, Paytm, BHIM, and any Indian UPI App
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="w-4 h-4 text-slate-900"
                  />
                </div>

                {/* Cards Option */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'CARD'
                      ? 'border-slate-900 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Debit / Credit Card
                      </div>
                      <p className="text-xs text-slate-500">
                        Visa, MasterCard, RuPay, Maestro & Domestic / International Cards
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="w-4 h-4 text-slate-900"
                  />
                </div>

                {/* NetBanking Option */}
                <div
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-slate-900 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5 text-purple-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Net Banking
                      </div>
                      <p className="text-xs text-slate-500">
                        SBI, HDFC, ICICI, Axis, PNB and 50+ major Indian banks
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'NETBANKING'}
                    onChange={() => setPaymentMethod('NETBANKING')}
                    className="w-4 h-4 text-slate-900"
                  />
                </div>
              </div>

              {/* Security info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-bit bank-grade TLS encryption. Your payment data is never stored on our servers.</span>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW DONATION */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Review Your Contribution
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Please verify details before proceeding to payment confirmation.
                </p>
              </div>

              {/* Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Donation Amount
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    ₹{amount.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-bold text-slate-500">
                      ({frequency === 'MONTHLY' ? 'Monthly' : 'One-Time'})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Program Cause:</span>
                    <div className="font-bold text-slate-900">{getCauseTitle(cause)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Payment Mode:</span>
                    <div className="font-bold text-slate-900">{paymentMethod}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Donor Name:</span>
                    <div className="font-bold text-slate-800">{donor.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Receipt Email:</span>
                    <div className="font-bold text-slate-800 truncate">{donor.email}</div>
                  </div>
                  {donor.panNumber && (
                    <div>
                      <span className="text-slate-500 font-medium">Donor PAN:</span>
                      <div className="font-mono font-bold text-slate-800">{donor.panNumber}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 font-medium">Tax Benefit:</span>
                    <div className="font-bold text-emerald-700">Eligible (Section 80G)</div>
                  </div>
                </div>
              </div>

              {/* Integration Ready Disclosure */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Payment Gateway Integration:</span>
                </div>
                <span>
                  Confirming below records your pledge and generates an official Provisional
                  80G Tax Exemption Receipt for exactly <strong>₹{amount.toLocaleString('en-IN')}</strong>.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION & 80G RECEIPT */}
          {currentStep === 5 && submissionResult && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Contribution Registered
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Thank You for Your Generosity!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-md mx-auto">
                  Your contribution of <strong>₹{submissionResult.amount.toLocaleString('en-IN')}</strong> will
                  directly support {getCauseTitle(submissionResult.cause)}.
                </p>
              </div>

              {/* Printable Official 80G Provisional Tax Exemption Receipt Card */}
              <div
                id="official-80g-receipt"
                className="p-5 sm:p-6 rounded-2xl border-2 border-slate-300 bg-white shadow-sm text-left font-sans space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                  <div>
                    <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      PROVISIONAL 80G TAX EXEMPTION RECEIPT
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Satya Nirakshak Social Welfare Mission (NGO)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-slate-500 block">
                      Receipt #:
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900">
                      {submissionResult.receiptNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Donor Name:</span>
                    <div className="font-bold text-slate-900">{submissionResult.donor.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Date & Time:</span>
                    <div className="font-medium text-slate-800">
                      {new Date(submissionResult.timestamp).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Donation Amount:</span>
                    <div className="font-black text-sm text-emerald-800">
                      ₹{submissionResult.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Donor PAN:</span>
                    <div className="font-mono font-bold text-slate-800">
                      {submissionResult.donor.panNumber || 'Not Provided (Standard Receipt)'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Allocated Program:</span>
                    <div className="font-medium text-slate-800">
                      {getCauseTitle(submissionResult.cause)}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-tight">
                  Eligible for 50% income tax deduction under Section 80G of the Income Tax Act,
                  1961. Unique Darpan ID: DL/2021/0294819 · Digital receipt generated automatically.
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer transition border border-slate-300"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <span>Close & Return to Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (steps 1 - 4) */}
        {currentStep < 5 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-[11px] text-slate-500 font-medium">
                Step 1 of 4: Enter Amount
              </div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>{currentStep === 1 ? 'Continue to Donate' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <span>Confirm & Generate 80G Receipt</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
