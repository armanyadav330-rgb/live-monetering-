import { AttendanceRecord } from '../types';
import { SEED_ATTENDANCE } from '../data/seedData';

export interface AttendanceAnalyticsSummary {
  totalRegisteredStaff: number;
  totalPresentStaff: number;
  averageStaffAttendancePercent: number;
  totalRegisteredBeneficiaries: number;
  totalPresentBeneficiaries: number;
  averageBeneficiaryAttendancePercent: number;
  status: 'NORMAL' | 'WARNING' | 'HIGH ATTENTION';
  anomaliesDetectedCount: number;
  anomalyReports: {
    projectId: string;
    date: string;
    type: string;
    description: string;
    severity: 'WARNING' | 'HIGH_ATTENTION';
  }[];
}

export interface IAttendanceProvider {
  name: string;
  isSimulation: boolean;
  getAttendanceRecords(projectId?: string): Promise<AttendanceRecord[]>;
  getAttendanceSummary(records: AttendanceRecord[]): AttendanceAnalyticsSummary;
  generate30DayTrend(projectId: string, baseBeneficiaries: number, baseAttendanceRate: number): Array<{
    date: string;
    present: number;
    registered: number;
    staffPresent: number;
    staffTotal: number;
    anomaly: boolean;
  }>;
}

export class DemoAttendanceProvider implements IAttendanceProvider {
  public name = 'DemoAttendanceProvider (Biometric & MIS Attendance Simulator)';
  public isSimulation = true;
  private records: AttendanceRecord[] = [...SEED_ATTENDANCE];

  async getAttendanceRecords(projectId?: string): Promise<AttendanceRecord[]> {
    if (projectId) {
      return this.records.filter((r) => r.projectId === projectId);
    }
    return [...this.records];
  }

  getAttendanceSummary(records: AttendanceRecord[]): AttendanceAnalyticsSummary {
    if (records.length === 0) {
      return {
        totalRegisteredStaff: 0,
        totalPresentStaff: 0,
        averageStaffAttendancePercent: 0,
        totalRegisteredBeneficiaries: 0,
        totalPresentBeneficiaries: 0,
        averageBeneficiaryAttendancePercent: 0,
        status: 'NORMAL',
        anomaliesDetectedCount: 0,
        anomalyReports: [],
      };
    }

    let regStaff = 0;
    let presStaff = 0;
    let regBen = 0;
    let presBen = 0;
    const anomalyReports: AttendanceAnalyticsSummary['anomalyReports'] = [];

    for (const r of records) {
      regStaff += r.registeredStaff;
      presStaff += r.presentStaff;
      regBen += r.registeredBeneficiaries;
      presBen += r.presentBeneficiaries;

      if (r.anomalyFlag) {
        anomalyReports.push({
          projectId: r.projectId,
          date: r.date,
          type: 'ANOMALOUS_ATTENDANCE_PATTERN',
          description: r.anomalyReason || 'Attendance pattern deviated from normal statistical bounds.',
          severity: 'HIGH_ATTENTION',
        });
      }
    }

    const avgBenPct = regBen > 0 ? Math.round((presBen / regBen) * 100) : 0;
    const avgStaffPct = regStaff > 0 ? Math.round((presStaff / regStaff) * 100) : 0;

    let status: 'NORMAL' | 'WARNING' | 'HIGH ATTENTION' = 'NORMAL';
    if (anomalyReports.length >= 2 || avgBenPct < 65) {
      status = 'HIGH ATTENTION';
    } else if (anomalyReports.length === 1 || avgBenPct < 80) {
      status = 'WARNING';
    }

    return {
      totalRegisteredStaff: regStaff,
      totalPresentStaff: presStaff,
      averageStaffAttendancePercent: avgStaffPct,
      totalRegisteredBeneficiaries: regBen,
      totalPresentBeneficiaries: presBen,
      averageBeneficiaryAttendancePercent: avgBenPct,
      status,
      anomaliesDetectedCount: anomalyReports.length,
      anomalyReports,
    };
  }

  generate30DayTrend(
    _projectId: string,
    baseBeneficiaries: number,
    baseAttendanceRate: number
  ): Array<{
    date: string;
    present: number;
    registered: number;
    staffPresent: number;
    staffTotal: number;
    anomaly: boolean;
  }> {
    const trend = [];
    const today = new Date('2026-09-03');
    const isCritical = baseAttendanceRate < 60;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Slight natural variance (+- 4%)
      const variance = (Math.sin(i * 0.8) * 4) + (Math.cos(i * 1.3) * 2);
      let rate = baseAttendanceRate + variance;
      let anomaly = false;

      // In critical project, inject drop on recent 5 days
      if (isCritical && i <= 6) {
        rate = Math.max(25, rate - 35);
        anomaly = true;
      }

      const present = Math.min(baseBeneficiaries, Math.max(10, Math.round((baseBeneficiaries * rate) / 100)));
      const staffTotal = Math.max(8, Math.round(baseBeneficiaries * 0.12));
      const staffPresent = anomaly
        ? Math.max(2, Math.round(staffTotal * 0.4))
        : Math.round(staffTotal * 0.9);

      trend.push({
        date: dateStr,
        present,
        registered: baseBeneficiaries,
        staffPresent,
        staffTotal,
        anomaly,
      });
    }

    return trend;
  }
}

export const attendanceProvider: IAttendanceProvider = new DemoAttendanceProvider();
