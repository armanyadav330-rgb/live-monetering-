import React, { useState, useEffect } from 'react';
import {
  Video,
  Grid,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Building2,
} from 'lucide-react';
import { CCTVCamera, Project, CCTVStatus } from '../../types';
import { SimulatedCameraFeed } from './SimulatedCameraFeed';
import { SimulationBanner } from '../common/SimulationBanner';
import { api } from '../../services/api';

interface CCTVMonitorProps {
  initialProjectId?: string;
  onSelectProject?: (projectId: string) => void;
}

export const CCTVMonitor: React.FC<CCTVMonitorProps> = ({
  initialProjectId,
  onSelectProject,
}) => {
  const [cameras, setCameras] = useState<CCTVCamera[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [focusedCameraId, setFocusedCameraId] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  const fetchCameras = () => {
    api
      .getCameras(selectedProjectId !== 'ALL' ? selectedProjectId : undefined)
      .then((cams) => setCameras(cams));
  };

  useEffect(() => {
    api.getProjects().then((p) => setProjects(p));
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [selectedProjectId]);

  const handleToggleStatus = async (cameraId: string, newStatus: CCTVStatus) => {
    await api.updateCameraStatus(cameraId, newStatus);
    fetchCameras();
  };

  const filteredCameras = cameras.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  const onlineCount = cameras.filter((c) => c.status === 'ONLINE').length;
  const warningCount = cameras.filter((c) => c.status === 'WARNING').length;
  const offlineCount = cameras.filter((c) => c.status === 'OFFLINE').length;

  return (
    <div className="space-y-4">
      {/* Simulation Banner */}
      <SimulationBanner context="CCTV SIMULATION ACTIVE: Live RTSP streams are rendered via GPU-accelerated HTML5 Canvas with simulated multi-person presence, realistic jitter, and telemetry watermarks without requiring paid media server infrastructure." />

      {/* Control Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              National CCTV Telemetry Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            24x7 automated visual surveillance, RTSP packet integrity checks, and corridor occupancy
            monitoring.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} Online
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {warningCount} Warning
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {offlineCount} Offline
          </span>
        </div>
      </div>

      {/* Filter and Matrix Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Project Dropdown */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setFocusedCameraId(null);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium max-w-[190px] xs:max-w-[260px] sm:max-w-xs"
            >
              <option value="ALL">All Monitored Facilities ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName} ({p.district})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
          >
            <option value="ALL">All Stream States</option>
            <option value="ONLINE">ONLINE Feeds Only</option>
            <option value="WARNING">WARNING (Packet Loss)</option>
            <option value="OFFLINE">OFFLINE Feeds Only</option>
          </select>
        </div>

        {/* Grid Density Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Layout:</span>
          <button
            onClick={() => setGridCols(2)}
            className={`px-2.5 py-1 rounded border text-xs font-semibold transition ${
              gridCols === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
            }`}
          >
            2x2
          </button>
          <button
            onClick={() => setGridCols(3)}
            className={`px-2.5 py-1 rounded border text-xs font-semibold transition ${
              gridCols === 3 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
            }`}
          >
            3x3
          </button>
          <button
            onClick={fetchCameras}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-600 ml-1"
            title="Refresh Feeds"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Camera Grid or Single Focused Camera */}
      {focusedCameraId ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-t-xl text-xs">
            <span className="font-bold">Focused Stream Examination</span>
            <button
              onClick={() => setFocusedCameraId(null)}
              className="text-indigo-400 hover:underline text-xs"
            >
              Return to Multi-Camera Grid
            </button>
          </div>
          {cameras
            .filter((c) => c.id === focusedCameraId)
            .map((cam) => (
              <div key={cam.id} className="space-y-3">
                <SimulatedCameraFeed
                  camera={cam}
                  isFocused={true}
                  onToggleFocus={() => setFocusedCameraId(null)}
                />
                {/* Status Simulator Controls */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <span className="font-bold text-slate-700">Simulate Hardware Event:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(cam.id, 'ONLINE')}
                      className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded text-xs"
                    >
                      Set ONLINE
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cam.id, 'WARNING')}
                      className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded text-xs"
                    >
                      Simulate JITTER / WARNING
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cam.id, 'OFFLINE')}
                      className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded text-xs"
                    >
                      Simulate DISCONNECT / OFFLINE
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            gridCols === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filteredCameras.map((cam) => (
            <div key={cam.id} className="space-y-1.5">
              <SimulatedCameraFeed
                camera={cam}
                isFocused={false}
                onToggleFocus={() => setFocusedCameraId(cam.id)}
              />
              {/* Quick hardware toggle under camera */}
              <div className="flex items-center justify-between px-2 text-[10px] text-slate-500">
                <span>IP: {cam.ipAddress}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      handleToggleStatus(
                        cam.id,
                        cam.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE'
                      )
                    }
                    className="hover:underline text-indigo-600 font-semibold"
                  >
                    Toggle {cam.status === 'ONLINE' ? 'Offline' : 'Online'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
