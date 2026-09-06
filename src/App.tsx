import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { StatCards } from './components/dashboard/StatCards';
import { QuickActions } from './components/dashboard/QuickActions';
import { RiskChart } from './components/dashboard/RiskChart';
import { AlertsFeed } from './components/dashboard/AlertsFeed';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { AddProjectModal } from './components/projects/AddProjectModal';
import { InspectionList } from './components/inspections/InspectionList';
import { InspectionForm } from './components/inspections/InspectionForm';
import { InspectionReportView } from './components/inspections/InspectionReportView';
import { AssignInspectionModal } from './components/inspections/AssignInspectionModal';
import { CCTVMonitor } from './components/cctv/CCTVMonitor';
import { RandomVCModule } from './components/vc/RandomVCModule';
import { AIAnalyticsDashboard } from './components/analytics/AIAnalyticsDashboard';
import { ProjectLeafletMap } from './components/map/ProjectLeafletMap';
import { ReportsDashboard } from './components/reports/ReportsDashboard';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { UserManagementView } from './components/users/UserManagementView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { PortalSettingsView } from './components/settings/PortalSettingsView';
import { AIChatbotModal } from './components/chatbot/AIChatbotModal';
import { AIFloatingTrigger } from './components/chatbot/AIFloatingTrigger';
import { AIAssistantView } from './components/chatbot/AIAssistantView';
import { User, Project, Inspection, AIAnomalyAlert } from './types';
import { api, getStoredUser, setStoredUser } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(getStoredUser());
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected entities for deep view states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [cctvTargetProjectId, setCctvTargetProjectId] = useState<string | undefined>(undefined);
  const [vcTargetProjectId, setVcTargetProjectId] = useState<string | undefined>(undefined);

  // Modals
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAssignInspectionModalOpen, setIsAssignInspectionModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotMode, setChatbotMode] = useState<'chat' | 'audio_call' | 'video_call' | 'tickets'>('chat');
  const [chatbotTopic, setChatbotTopic] = useState<string | undefined>(undefined);

  const handleOpenAIAssistant = (
    mode: 'chat' | 'audio_call' | 'video_call' | 'tickets' = 'chat',
    topic?: string
  ) => {
    setChatbotMode(mode);
    setChatbotTopic(topic);
    setIsChatbotOpen(true);
  };

  // Global Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [alerts, setAlerts] = useState<AIAnomalyAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);

  // Load initial dataset
  const refreshData = async () => {
    try {
      const [uList, pList, iList, nList, aList] = await Promise.all([
        api.getUsers(),
        api.getProjects(),
        api.getInspections(),
        api.getNotifications(),
        api.getAIAlerts(),
      ]);
      const safeUsers = Array.isArray(uList) ? uList : [];
      const safeProjects = Array.isArray(pList) ? pList : [];
      const safeInspections = Array.isArray(iList) ? iList : [];
      const safeNotifications = Array.isArray(nList) ? nList : [];
      const safeAlerts = Array.isArray(aList) ? aList : [];

      setAllUsers(safeUsers);
      if (!currentUser && safeUsers.length > 0) {
        setCurrentUser(safeUsers[0]);
      }
      setProjects(safeProjects);
      setInspections(safeInspections);
      setAlerts(safeAlerts);
      setUnreadCount(safeNotifications.filter((n) => !n.read).length);
    } catch (err) {
      console.warn('Initial data load completed via local fallback store.');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    setStoredUser(user);
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView('project-detail');
  };

  const handleOpenCCTVForProject = (projectId: string) => {
    setCctvTargetProjectId(projectId);
    setActiveView('cctv');
  };

  const handleOpenVCForProject = (projectId: string) => {
    setVcTargetProjectId(projectId);
    setActiveView('vc');
  };

  const handleConductInspection = (inspectionId: string) => {
    setSelectedInspectionId(inspectionId);
    setActiveView('inspection-form');
  };

  const handleViewInspectionDossier = (inspectionId: string) => {
    setSelectedInspectionId(inspectionId);
    setActiveView('inspection-report');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          <div className="text-sm font-bold text-slate-800">
            Initializing DoSJE Smart Monitoring Portal...
          </div>
          <p className="text-xs text-slate-500">Loading secure schemes and telemetry registries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased overflow-hidden">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onUserChange={handleUserChange}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenNotifications={() => handleNavigate('notifications')}
        unreadNotificationsCount={unreadCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          currentView={activeView}
          userRole={currentUser.role}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content View Container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
          {/* DASHBOARD VIEW */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <StatCards projects={projects} inspections={inspections} />

              {/* Quick Actions Bar */}
              <QuickActions
                userRole={currentUser.role}
                onOpenAddProject={() => setIsAddProjectModalOpen(true)}
                onOpenAssignInspection={() => setIsAssignInspectionModalOpen(true)}
                onOpenCCTV={() => handleNavigate('cctv')}
                onOpenVC={() => handleNavigate('vc')}
                onOpenAIAnalytics={() => handleNavigate('analytics')}
                onOpenGISMap={() => handleNavigate('map')}
                onOpenAIAssistant={(mode) => handleOpenAIAssistant(mode as any)}
                onNavigate={handleNavigate}
              />

              {/* Risk Distribution and Analytics Charts */}
              <RiskChart projects={projects} />

              {/* Live Alerts and Telemetry Feed */}
              <AlertsFeed
                alerts={alerts}
                highRiskProjects={projects.filter(
                  (p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH'
                )}
                recentInspections={inspections}
                onSelectProject={handleViewProject}
                onSelectInspection={handleViewInspectionDossier}
                onNavigate={handleNavigate}
              />

              {/* High-Risk Projects Spotlight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Critical Risk Entities Requiring Oversight
                    </h2>
                    <p className="text-xs text-slate-500">
                      Facilities flagged by automated biometric variance, CCTV downtime, or overdue
                      audits.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('projects')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View All Projects &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH')
                    .slice(0, 4)
                    .map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-2xs hover:border-rose-300 transition flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-slate-500 font-bold">
                              {proj.projectId}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                proj.riskLevel === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {proj.riskLevel} RISK ({proj.riskScore}/100)
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm mt-1">
                            {proj.projectName}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {proj.ngoName} · {proj.district}, {proj.state}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                          <div>
                            <div className="text-slate-400 text-[10px] uppercase">Attendance</div>
                            <div className="font-bold text-rose-600">
                              {proj.averageAttendancePercent}%
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[10px] uppercase">CCTV Feeds</div>
                            <div className="font-bold text-slate-800">{proj.cctvStatus}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[10px] uppercase">
                              Beneficiaries
                            </div>
                            <div className="font-bold text-slate-800">
                              {proj.beneficiaryCount}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleOpenCCTVForProject(proj.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            Live Feeds
                          </button>
                          <button
                            onClick={() => handleViewProject(proj.id)}
                            className="px-3 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                          >
                            Investigate
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS VIEW */}
          {activeView === 'projects' && (
            <ProjectList
              projects={projects}
              userRole={currentUser.role}
              onSelectProject={handleViewProject}
              onOpenAddModal={() => setIsAddProjectModalOpen(true)}
            />
          )}

          {/* PROJECT DETAIL VIEW */}
          {activeView === 'project-detail' && selectedProjectId && (
            <ProjectDetail
              projectId={selectedProjectId}
              userRole={currentUser.role}
              onBack={() => setActiveView('projects')}
              onSelectInspection={handleViewInspectionDossier}
              onOpenCCTV={() => handleOpenCCTVForProject(selectedProjectId)}
              onOpenVC={() => handleOpenVCForProject(selectedProjectId)}
              onScheduleInspection={() => setIsAssignInspectionModalOpen(true)}
            />
          )}

          {/* INSPECTIONS VIEW */}
          {activeView === 'inspections' && (
            <InspectionList
              inspections={inspections}
              userRole={currentUser.role}
              onSelectInspection={handleViewInspectionDossier}
              onConductInspection={handleConductInspection}
              onOpenAssignModal={() => setIsAssignInspectionModalOpen(true)}
            />
          )}

          {/* INSPECTION EXECUTION FORM VIEW */}
          {activeView === 'inspection-form' && selectedInspectionId && (
            <InspectionForm
              inspectionId={selectedInspectionId}
              currentUser={currentUser}
              onBack={() => setActiveView('inspections')}
              onComplete={() => {
                refreshData();
                setActiveView('inspections');
              }}
            />
          )}

          {/* INSPECTION REPORT / DOSSIER VIEW */}
          {activeView === 'inspection-report' && selectedInspectionId && (
            <InspectionReportView
              inspectionId={selectedInspectionId}
              currentUser={currentUser}
              onBack={() => setActiveView('inspections')}
            />
          )}

          {/* CCTV LIVE MONITORING VIEW */}
          {activeView === 'cctv' && (
            <CCTVMonitor
              initialProjectId={cctvTargetProjectId}
              onSelectProject={handleViewProject}
            />
          )}

          {/* RANDOM VC VERIFICATION VIEW */}
          {activeView === 'vc' && (
            <RandomVCModule initialProjectId={vcTargetProjectId} />
          )}

          {/* AI ANALYTICS & ANOMALY DASHBOARD */}
          {activeView === 'analytics' && (
            <AIAnalyticsDashboard onSelectProject={handleViewProject} />
          )}

          {/* GIS PROJECT MAP */}
          {activeView === 'map' && (
            <ProjectLeafletMap onSelectProject={handleViewProject} />
          )}

          {/* REPORTS & MIS EXPORT */}
          {activeView === 'reports' && (
            <ReportsDashboard onSelectInspection={handleViewInspectionDossier} />
          )}

          {/* AUDIT LOGS VIEW */}
          {(activeView === 'audit-logs' || activeView === 'audit') && (
            <AuditLogsView
              currentUser={currentUser}
              onNavigateToProject={handleViewProject}
              onNavigateToInspection={handleViewInspectionDossier}
            />
          )}

          {/* USER MANAGEMENT & RBAC */}
          {activeView === 'users' && <UserManagementView currentUser={currentUser} />}

          {/* NOTIFICATIONS VIEW */}
          {activeView === 'notifications' && (
            <NotificationsView
              onSelectAction={(type, id) => {
                if (type === 'PROJECT' && id) handleViewProject(id);
                else if (type === 'INSPECTION' && id) handleViewInspectionDossier(id);
                else if (type === 'CCTV') handleNavigate('cctv');
              }}
            />
          )}

          {/* PORTAL SETTINGS VIEW */}
          {activeView === 'settings' && (
            <PortalSettingsView
              currentUser={currentUser}
              onNavigateToView={handleNavigate}
            />
          )}

          {/* AI ASSISTANT VIEW */}
          {activeView === 'ai-assistant' && (
            <AIAssistantView
              onStartCall={(mode) => handleOpenAIAssistant(mode)}
            />
          )}
        </main>
      </div>

      {/* AI Assistant Floating Trigger & Modal */}
      <AIFloatingTrigger onOpen={(mode) => handleOpenAIAssistant(mode)} />

      <AIChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        initialMode={chatbotMode}
        initialTopic={chatbotTopic}
      />

      {/* Global Modals */}
      {isAddProjectModalOpen && (
        <AddProjectModal
          isOpen={isAddProjectModalOpen}
          onClose={() => setIsAddProjectModalOpen(false)}
          onSuccess={() => {
            refreshData();
            setIsAddProjectModalOpen(false);
          }}
        />
      )}

      {isAssignInspectionModalOpen && (
        <AssignInspectionModal
          isOpen={isAssignInspectionModalOpen}
          projects={projects}
          onClose={() => setIsAssignInspectionModalOpen(false)}
          onSuccess={() => {
            refreshData();
            setIsAssignInspectionModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
