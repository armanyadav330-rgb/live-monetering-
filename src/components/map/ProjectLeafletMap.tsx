import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Filter, AlertTriangle, Eye, Building2, ExternalLink } from 'lucide-react';
import { Project, RiskLevel } from '../../types';
import { api } from '../../services/api';

declare const L: any;

interface ProjectLeafletMapProps {
  onSelectProject?: (projectId: string) => void;
}

export const ProjectLeafletMap: React.FC<ProjectLeafletMapProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stateFilter, setStateFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    api.getProjects().then((p) => setProjects(p));
  }, []);

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (stateFilter !== 'ALL' && p.state !== stateFilter) return false;
    if (riskFilter !== 'ALL' && p.riskLevel !== riskFilter) return false;
    if (schemeFilter !== 'ALL' && p.scheme !== schemeFilter) return false;
    return true;
  });

  const states = Array.from(new Set(projects.map((p) => p.state))) as string[];
  const schemes = Array.from(new Set(projects.map((p) => p.scheme))) as string[];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof L === 'undefined') return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([22.9734, 78.6569], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Helper for marker color
    const getMarkerColor = (level: RiskLevel) => {
      switch (level) {
        case 'CRITICAL':
          return '#e11d48'; // red
        case 'HIGH':
          return '#ea580c'; // orange
        case 'MEDIUM':
          return '#f59e0b'; // amber
        default:
          return '#10b981'; // green
      }
    };

    filteredProjects.forEach((p) => {
      const color = getMarkerColor(p.riskLevel);
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">${p.riskScore}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveProject(p);
      });

      markersRef.current.push(marker);
    });

    if (filteredProjects.length > 0 && mapInstanceRef.current) {
      const group = new L.featureGroup(markersRef.current);
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds().pad(0.2));
      }
    }
  }, [filteredProjects]);

  return (
    <div className="space-y-4">
      {/* Map Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">National GIS Monitoring Map</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographical dispersion of facilities color-coded by real-time risk scores (0 - 100).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
          >
            <option value="ALL">All States ({states.length})</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
          >
            <option value="ALL">All Risk Categories</option>
            <option value="CRITICAL">🔴 CRITICAL Risk</option>
            <option value="HIGH">🟠 HIGH Risk</option>
            <option value="MEDIUM">🟡 MEDIUM Risk</option>
            <option value="LOW">🟢 LOW Risk</option>
          </select>

          {/* Scheme Filter */}
          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
          >
            <option value="ALL">All Schemes</option>
            {schemes.map((sc) => (
              <option key={sc} value={sc}>
                {sc.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Canvas with Sidebar Selected Card */}
      <div className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-md h-[550px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Overlay */}
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-md border border-slate-200 text-[11px] space-y-1.5 pointer-events-auto">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Risk Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <span>Critical Risk (&ge; 70)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>High Risk (50 - 69)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Medium Risk (30 - 49)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Low Risk (&lt; 30)</span>
          </div>
        </div>

        {/* Selected Project Card Popover */}
        {activeProject && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 bg-white p-4 rounded-xl shadow-xl border border-slate-200 space-y-2 pointer-events-auto">
            <div className="flex items-start justify-between gap-2">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  activeProject.riskLevel === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800'
                    : activeProject.riskLevel === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {activeProject.riskLevel} RISK ({activeProject.riskScore}/100)
              </span>
              <button
                onClick={() => setActiveProject(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900">{activeProject.projectName}</h3>
              <div className="text-[11px] text-slate-500">{activeProject.ngoName}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              <div>
                Location: <strong>{activeProject.district}, {activeProject.state}</strong>
              </div>
              <div>
                CCTV: <strong>{activeProject.cctvStatus}</strong>
              </div>
              <div>
                Beneficiaries: <strong>{activeProject.beneficiaryCount}</strong>
              </div>
              <div>
                Attendance: <strong>{activeProject.averageAttendancePercent}%</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-indigo-700">
                {activeProject.latitude.toFixed(4)}° N, {activeProject.longitude.toFixed(4)}° E
              </span>

              {onSelectProject && (
                <button
                  onClick={() => onSelectProject(activeProject.id)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-xs transition"
                >
                  View Full Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
