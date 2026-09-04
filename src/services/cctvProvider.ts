import { CCTVCamera, CCTVStatus } from '../types';
import { SEED_CCTV_CAMERAS } from '../data/seedData';

export interface CCTVFeedInfo {
  cameraId: string;
  cameraName: string;
  projectId: string;
  streamUrl: string;
  isSimulated: boolean;
  simulationType: 'CANVAS_ANIMATION' | 'HLS' | 'SAMPLE_LOOP';
  resolution: string;
  fps: number;
  status: CCTVStatus;
  lastHeartbeat: string;
}

export interface ICCTVProvider {
  name: string;
  isSimulation: boolean;
  getCameraStatus(cameraId: string): Promise<CCTVStatus>;
  getCameraFeed(cameraId: string): Promise<CCTVFeedInfo | null>;
  getLastHeartbeat(cameraId: string): Promise<string>;
  getAllCameras(projectId?: string): Promise<CCTVCamera[]>;
  updateCameraStatus(cameraId: string, status: CCTVStatus): Promise<CCTVCamera | null>;
}

export class DemoCCTVProvider implements ICCTVProvider {
  public name = 'DemoCCTVProvider (Synthetic Government Feed Simulator)';
  public isSimulation = true;
  private cameras: CCTVCamera[] = [...SEED_CCTV_CAMERAS];

  async getCameraStatus(cameraId: string): Promise<CCTVStatus> {
    const cam = this.cameras.find((c) => c.id === cameraId);
    return cam ? cam.status : 'OFFLINE';
  }

  async getCameraFeed(cameraId: string): Promise<CCTVFeedInfo | null> {
    const cam = this.cameras.find((c) => c.id === cameraId);
    if (!cam) return null;

    return {
      cameraId: cam.id,
      cameraName: cam.cameraName,
      projectId: cam.projectId,
      streamUrl: `simulation://cctv-stream/${cam.projectId}/${cam.id}`,
      isSimulated: true,
      simulationType: 'CANVAS_ANIMATION',
      resolution: cam.resolution,
      fps: cam.fps,
      status: cam.status,
      lastHeartbeat: cam.lastHeartbeat,
    };
  }

  async getLastHeartbeat(cameraId: string): Promise<string> {
    const cam = this.cameras.find((c) => c.id === cameraId);
    return cam ? cam.lastHeartbeat : new Date().toISOString();
  }

  async getAllCameras(projectId?: string): Promise<CCTVCamera[]> {
    if (projectId) {
      return this.cameras.filter((c) => c.projectId === projectId);
    }
    return [...this.cameras];
  }

  async updateCameraStatus(cameraId: string, status: CCTVStatus): Promise<CCTVCamera | null> {
    const index = this.cameras.findIndex((c) => c.id === cameraId);
    if (index === -1) return null;

    this.cameras[index] = {
      ...this.cameras[index],
      status,
      lastHeartbeat: new Date().toISOString(),
      fps: status === 'ONLINE' ? 25 : status === 'WARNING' ? 10 : 0,
    };
    return this.cameras[index];
  }
}

export const cctvProvider: ICCTVProvider = new DemoCCTVProvider();
