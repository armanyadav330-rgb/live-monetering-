import { RandomVCRecord, Project } from '../types';
import { SEED_VC_RECORDS } from '../data/seedData';

export interface IVCProvider {
  name: string;
  isSimulation: boolean;
  selectRandomParticipant(projects: Project[]): {
    project: Project;
    participantType: 'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY';
    participantName: string;
    participantContact: string;
  } | null;
  getVCRecords(projectId?: string): Promise<RandomVCRecord[]>;
  saveVCRecord(record: Omit<RandomVCRecord, 'id' | 'createdAt'>): Promise<RandomVCRecord>;
}

export class DemoVCProvider implements IVCProvider {
  public name = 'DemoVCProvider (Browser WebRTC & Synthetic VC Simulator)';
  public isSimulation = true;
  private records: RandomVCRecord[] = [...SEED_VC_RECORDS];

  selectRandomParticipant(projects: Project[]): {
    project: Project;
    participantType: 'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY';
    participantName: string;
    participantContact: string;
  } | null {
    const activeProjects = projects.filter((p) => p.projectStatus === 'ACTIVE' || p.projectStatus === 'UNDER_REVIEW');
    if (activeProjects.length === 0) return null;

    // Weight towards high risk projects
    const weightedProjects = activeProjects.flatMap((p) => {
      if (p.riskLevel === 'CRITICAL') return [p, p, p, p];
      if (p.riskLevel === 'HIGH') return [p, p, p];
      if (p.riskLevel === 'MEDIUM') return [p, p];
      return [p];
    });

    const chosenProject = weightedProjects[Math.floor(Math.random() * weightedProjects.length)];
    const participantTypes: Array<'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY'> = [
      'PROJECT_INCHARGE',
      'STAFF',
      'BENEFICIARY',
    ];
    const chosenType = participantTypes[Math.floor(Math.random() * participantTypes.length)];

    let name = chosenProject.projectIncharge;
    let contact = chosenProject.contact;

    if (chosenType === 'STAFF') {
      const sampleStaff = [
        { name: 'Dr. Neeraj Verma (Medical Officer)', contact: '+91 98110 55443' },
        { name: 'Sunita Sharma (Head Counselor)', contact: '+91 94140 12349' },
        { name: 'R. K. Murthy (Vocational Trainer)', contact: '+91 98480 99881' },
      ];
      const s = sampleStaff[Math.floor(Math.random() * sampleStaff.length)];
      name = s.name;
      contact = s.contact;
    } else if (chosenType === 'BENEFICIARY') {
      const sampleBeneficiaries = [
        { name: 'Rameshwar Lal (ID: BEN-2025-081)', contact: '+91 98720 11990' },
        { name: 'Kamla Devi (ID: BEN-2025-104)', contact: '+91 94150 66554' },
        { name: 'Amitabh Soren (ID: BEN-2025-042)', contact: '+91 94310 88776' },
      ];
      const b = sampleBeneficiaries[Math.floor(Math.random() * sampleBeneficiaries.length)];
      name = b.name;
      contact = b.contact;
    }

    return {
      project: chosenProject,
      participantType: chosenType,
      participantName: name,
      participantContact: contact,
    };
  }

  async getVCRecords(projectId?: string): Promise<RandomVCRecord[]> {
    if (projectId) {
      return this.records.filter((r) => r.projectId === projectId);
    }
    return [...this.records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async saveVCRecord(record: Omit<RandomVCRecord, 'id' | 'createdAt'>): Promise<RandomVCRecord> {
    const newRecord: RandomVCRecord = {
      ...record,
      id: `vc_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.records.unshift(newRecord);
    return newRecord;
  }
}

export const vcProvider: IVCProvider = new DemoVCProvider();
