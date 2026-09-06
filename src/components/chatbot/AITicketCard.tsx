import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';
import { GrievanceTicket } from '../../types';

interface AITicketCardProps {
  ticket: GrievanceTicket;
  onResolved?: (updated: GrievanceTicket) => void;
  compact?: boolean;
}

export const AITicketCard: React.FC<AITicketCardProps> = ({
  ticket,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  const categoryLabels: Record<string, { label: string; color: string }> = {
    SCHOLARSHIP: { label: 'Scholarship & DBT', color: 'bg-emerald-500/15 text-emerald-700 border-emerald-300' },
    CCTV_OFFLINE: { label: 'CCTV Surveillance', color: 'bg-blue-500/15 text-blue-700 border-blue-300' },
    ATTENDANCE_ANOMALY: { label: 'Biometric Attendance', color: 'bg-amber-500/15 text-amber-700 border-amber-300' },
    INSPECTION_APPEAL: { label: 'Inspection Docket', color: 'bg-purple-500/15 text-purple-700 border-purple-300' },
    GRANT_IN_AID: { label: 'Grant-in-Aid', color: 'bg-indigo-500/15 text-indigo-700 border-indigo-300' },
    GENERAL_GRIEVANCE: { label: 'Citizen Grievance', color: 'bg-slate-500/15 text-slate-700 border-slate-300' },
  };

  const statusConfig = {
    OPEN: { label: 'Open Docket', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    IN_PROGRESS: { label: 'In Verification', icon: AlertTriangle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    RESOLVED: { label: 'Resolved & Closed', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    CLOSED: { label: 'Archived', icon: CheckCircle2, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  }[ticket.status] || { label: ticket.status, icon: Clock, color: 'text-slate-600 bg-slate-50 border-slate-200' };

  const StatusIcon = statusConfig.icon;
  const cat = categoryLabels[ticket.category] || { label: ticket.category, color: 'bg-slate-100 text-slate-700 border-slate-200' };

  const handleCopySlip = () => {
    const slipText = `
[DoSJE OFFICIAL GRIEVANCE RESOLUTION DOCKET]
Ticket No: ${ticket.ticketNumber}
Category: ${ticket.category}
Applicant: ${ticket.applicantName}
Subject: ${ticket.subject}
Status: ${ticket.status}
Resolution: ${ticket.resolutionNotes || 'Logged for priority action'}
Assigned Officer: ${ticket.assignedOfficer || 'Central Directorate'}
Registered: ${new Date(ticket.createdAt).toLocaleString()}
Channel: ${ticket.channel}
Department of Social Justice & Empowerment, Govt. of India
    `.trim();

    navigator.clipboard.writeText(slipText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>DoSJE Grievance Docket - ${ticket.ticketNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #0f172a; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
            .title { font-size: 20px; font-weight: bold; color: #1e3a8a; }
            .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
            .badge { display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 9999px; font-weight: 600; font-size: 13px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; font-size: 14px; }
            .meta-item { border-left: 3px solid #cbd5e1; padding-left: 10px; }
            .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
            .value { font-weight: 600; margin-top: 2px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 20px; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Department of Social Justice & Empowerment</div>
            <div class="subtitle">Ministry of Social Justice and Empowerment, Government of India</div>
            <div style="margin-top: 12px;">
              <span class="badge">Official Grievance Resolution Slip: ${ticket.ticketNumber}</span>
            </div>
          </div>
          <div class="meta-grid">
            <div class="meta-item">
              <div class="label">Docket Reference</div>
              <div class="value">${ticket.ticketNumber}</div>
            </div>
            <div class="meta-item">
              <div class="label">Current Status</div>
              <div class="value">${ticket.status}</div>
            </div>
            <div class="meta-item">
              <div class="label">Applicant Name</div>
              <div class="value">${ticket.applicantName}</div>
            </div>
            <div class="meta-item">
              <div class="label">Filing Channel</div>
              <div class="value">${ticket.channel} (Interactive AI Officer)</div>
            </div>
            <div class="meta-item">
              <div class="label">Category</div>
              <div class="value">${ticket.category}</div>
            </div>
            <div class="meta-item">
              <div class="label">Assigned Officer</div>
              <div class="value">${ticket.assignedOfficer || 'Central Welfare Officer'}</div>
            </div>
          </div>
          <div class="box">
            <div class="label">Subject / Concern</div>
            <div style="font-weight: 600; margin: 4px 0 12px 0;">${ticket.subject}</div>
            <div class="label">Description</div>
            <div style="font-size: 14px; color: #334155; margin-top: 4px;">${ticket.description}</div>
          </div>
          <div class="box" style="background: #f0fdf4; border-color: #bbf7d0;">
            <div class="label" style="color: #166534;">Official Resolution & Action Taken</div>
            <div style="font-size: 14px; font-weight: 600; color: #14532d; margin-top: 6px;">
              ${ticket.resolutionNotes || 'In verification by Directorate. Immediate compliance protocol active.'}
            </div>
          </div>
          <div class="footer">
            Generated via DoSJE Smart AI Grievance & Tele-Inspection System. For verification, contact 1800-11-8000 or visit dosje.gov.in.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  if (compact) {
    return (
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 text-left shadow-sm hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-amber-300">{ticket.ticketNumber}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
            {ticket.status}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">{ticket.subject}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ticket.resolutionNotes || ticket.description}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden transition-all duration-200 text-left">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {ticket.ticketNumber}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.color}`}>
                {cat.label}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Registered via {ticket.channel} • {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {ticket.subject}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {ticket.description}
          </p>
        </div>

        {/* Resolution Box */}
        {ticket.resolutionNotes && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-3">
            <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Resolution & Action Taken:</span>
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
              {ticket.resolutionNotes}
            </p>
          </div>
        )}

        {/* Officer & Scheme Meta */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 truncate">
            <UserCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">Officer: {ticket.assignedOfficer || 'Joint Secretary'}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{ticket.scheme || 'Central Sector Scheme'}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleCopySlip}
            className="inline-flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Slip!' : 'Copy Reference'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Official Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
