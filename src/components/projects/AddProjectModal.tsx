import React, { useState } from 'react';
import { X, Building2, MapPin, User, Video, Users } from 'lucide-react';
import { Project, RiskLevel, CCTVStatus, ProjectStatus } from '../../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Project | null;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    projectName: initialData?.projectName || '',
    projectId: initialData?.projectId || `DOSJE-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
    ngoName: initialData?.ngoName || '',
    scheme: initialData?.scheme || 'PM-AJAY (Adarsh Gram & Skill Component)',
    state: initialData?.state || 'Delhi',
    district: initialData?.district || 'New Delhi',
    address: initialData?.address || '',
    latitude: initialData?.latitude || 28.6139,
    longitude: initialData?.longitude || 77.209,
    projectIncharge: initialData?.projectIncharge || '',
    contact: initialData?.contact || '',
    email: initialData?.email || '',
    beneficiaryCount: initialData?.beneficiaryCount || 100,
    staffCount: initialData?.staffCount || 15,
    cctvStatus: initialData?.cctvStatus || ('ONLINE' as CCTVStatus),
    attendanceStatus: initialData?.attendanceStatus || 'NORMAL',
    averageAttendancePercent: initialData?.averageAttendancePercent || 88,
    projectStatus: initialData?.projectStatus || ('ACTIVE' as ProjectStatus),
    activeCamerasCount: initialData?.activeCamerasCount || 4,
    totalCamerasCount: initialData?.totalCamerasCount || 4,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.projectName.trim()) errs.projectName = 'Project name is required';
    if (!formData.ngoName.trim()) errs.ngoName = 'NGO / Implementing agency is required';
    if (!formData.district.trim()) errs.district = 'District is required';
    if (!formData.projectIncharge.trim()) errs.projectIncharge = 'Incharge name is required';
    if (!formData.contact.trim()) errs.contact = 'Contact number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {initialData ? 'Edit Project Telemetry' : 'Register New DoSJE Scheme Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Project Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Code
                </label>
                <input
                  type="text"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g., Sambhav Divyang Residential Center"
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.projectName ? 'border-rose-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Implementing NGO / Institute *
                </label>
                <input
                  type="text"
                  value={formData.ngoName}
                  onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                  placeholder="e.g., Sarvodaya Welfare Society"
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.ngoName ? 'border-rose-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  DoSJE Scheme
                </label>
                <select
                  value={formData.scheme}
                  onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="PM-AJAY (Adarsh Gram & Skill Component)">
                    PM-AJAY (Adarsh Gram &amp; Skill Component)
                  </option>
                  <option value="SMILE (Support for Marginalized Individuals)">
                    SMILE (Support for Marginalized Individuals)
                  </option>
                  <option value="National Action Plan for Drug Demand Reduction (NAPDDR)">
                    NAPDDR (De-Addiction &amp; IRCA)
                  </option>
                  <option value="Atal Vayo Abhyuday Yojana (AVYAY)">
                    Atal Vayo Abhyuday Yojana (Senior Citizens)
                  </option>
                  <option value="SHREYAS (Scholarships & Hostels)">
                    SHREYAS (SC/OBC Hostels)
                  </option>
                  <option value="DDRS Scheme for Persons with Disabilities">
                    DDRS Scheme (Divyangjan)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location and Coordinates */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Geo-Location Details (For Inspector GPS Verification)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.projectStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, projectStatus: e.target.value as ProjectStatus })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Plot/Building number, Road, Landmark, PIN Code"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Personnel & Monitoring */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Operational Contacts &amp; Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Incharge *
                </label>
                <input
                  type="text"
                  value={formData.projectIncharge}
                  onChange={(e) => setFormData({ ...formData, projectIncharge: e.target.value })}
                  placeholder="Director / Incharge Name"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="project@ngo.org"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiaries
                </label>
                <input
                  type="number"
                  value={formData.beneficiaryCount}
                  onChange={(e) =>
                    setFormData({ ...formData, beneficiaryCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sanctioned Staff
                </label>
                <input
                  type="number"
                  value={formData.staffCount}
                  onChange={(e) =>
                    setFormData({ ...formData, staffCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CCTV Status
                </label>
                <select
                  value={formData.cctvStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, cctvStatus: e.target.value as CCTVStatus })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="WARNING">WARNING</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendance Status
                </label>
                <select
                  value={formData.attendanceStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendanceStatus: e.target.value as 'NORMAL' | 'WARNING' | 'HIGH ATTENTION',
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="WARNING">WARNING</option>
                  <option value="HIGH ATTENTION">HIGH ATTENTION</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              {initialData ? 'Save Changes' : 'Register Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
