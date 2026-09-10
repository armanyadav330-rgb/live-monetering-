import React, { useState } from 'react';
import {
  UploadCloud,
  Camera,
  MapPin,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { Inspection, User } from '../../types';

interface UploadEvidenceViewProps {
  inspections: Inspection[];
  currentUser: User;
  onEvidenceUploaded?: () => void;
}

export const UploadEvidenceView: React.FC<UploadEvidenceViewProps> = ({
  inspections,
  currentUser,
  onEvidenceUploaded,
}) => {
  const [selectedInspectionId, setSelectedInspectionId] = useState(
    inspections[0]?.id || ''
  );
  const [category, setCategory] = useState('INFRASTRUCTURE');
  const [caption, setCaption] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; timestamp: string; gps: string; category: string }[]
  >([
    {
      id: 'EV-901',
      name: 'Main_Entrance_Ramp_Slope.jpg',
      timestamp: new Date().toLocaleTimeString(),
      gps: '28.6139° N, 77.2090° E (Accuracy: ±2.1m)',
      category: 'INFRASTRUCTURE',
    },
    {
      id: 'EV-902',
      name: 'Dining_Biometric_Device_Sync.jpg',
      timestamp: new Date().toLocaleTimeString(),
      gps: '28.6139° N, 77.2090° E (Accuracy: ±1.8m)',
      category: 'CCTV_BIOMETRIC',
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const activeInspection = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const newEv = {
        id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
        name: caption ? `${caption.replace(/\s+/g, '_').slice(0, 20)}.jpg` : 'Onsite_Field_Audit_Capture.jpg',
        timestamp: new Date().toLocaleTimeString(),
        gps: `${(28.6 + Math.random() * 0.1).toFixed(4)}° N, ${(77.2 + Math.random() * 0.1).toFixed(4)}° E (GPS Locked)`,
        category,
      };

      setUploadedFiles((prev) => [newEv, ...prev]);
      setIsUploading(false);
      setCaption('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
      if (onEvidenceUploaded) onEvidenceUploaded();
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              Geo-Tagged Physical Evidence &amp; Photo Dossier Ingestion
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident photographic uploads with certified satellite GPS coordinates, device timestamp, and statutory metadata.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>NavIC / GPS Lock Active</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Photographic evidence successfully sealed with cryptographic GPS stamp and attached to inspection dossier.</span>
        </div>
      )}

      {/* Upload Form & Metadata Console */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Target Selection & Details */}
        <div className="md:col-span-1 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Inspection Dossier</label>
            <select
              value={selectedInspectionId}
              onChange={(e) => setSelectedInspectionId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white"
            >
              {inspections.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.inspectionCode} - {i.projectName.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {activeInspection && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Project / Facility:</span>
                <span className="font-bold text-slate-900">{activeInspection.projectName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="font-semibold text-slate-800">
                  {activeInspection.district}, {activeInspection.state}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Inspection Officer:</span>
                <span className="font-semibold text-slate-800">{activeInspection.inspectorName}</span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-900 space-y-1 text-[11px]">
            <div className="font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Sovereign GPS Protocol</span>
            </div>
            <p className="text-blue-800 leading-tight">
              Photographs captured through this module automatically embed EXIF geolocation tags and SHA-256 integrity hashes.
            </p>
          </div>
        </div>

        {/* Center & Right: Upload Zone */}
        <div className="md:col-span-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Evidence Ingestion Form
          </h2>

          <form onSubmit={handleSimulateUpload} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Verification Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-slate-50"
                >
                  <option value="INFRASTRUCTURE">Physical Infrastructure & Accessibility</option>
                  <option value="CCTV_BIOMETRIC">CCTV NVR & Biometric Terminal</option>
                  <option value="SANITATION">Sanitation & Dining Hygiene</option>
                  <option value="ACCOUNTS">Grant Registers & Cash Vouchers</option>
                  <option value="BENEFICIARY">Beneficiary Welfare Verification</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Caption / Observation Remark</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Ramp slope angle verified compliant"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Drop / Capture Zone */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                Click to browse device photos or drag &amp; drop
              </div>
              <p className="text-[11px] text-slate-500">
                PNG, JPG, or PDF up to 15MB. All files will be stamped with NavIC/GPS coordinates.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sealing GPS Metadata...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Upload &amp; Seal Evidence</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Uploaded Evidence Gallery */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recently Ingested Evidence ({uploadedFiles.length})
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {uploadedFiles.map((ev) => (
                <div key={ev.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ImageIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{ev.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{ev.gps}</span>
                        <span>·</span>
                        <span>{ev.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
