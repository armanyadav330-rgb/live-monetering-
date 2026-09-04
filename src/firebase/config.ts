/**
 * Firebase Configuration Provider
 * Supports Firebase Auth & Firestore when environment credentials are supplied.
 * The portal gracefully operates with local/server store when credentials are omitted.
 */

export interface FirebaseConfigState {
  isConfigured: boolean;
  projectId?: string;
  authDomain?: string;
}

export function getFirebaseConfig(): FirebaseConfigState {
  const env = (import.meta as any).env || {};
  const apiKey = env.VITE_FIREBASE_API_KEY || env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
  const projectId = env.VITE_FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';

  const isConfigured = Boolean(apiKey && projectId);

  return {
    isConfigured,
    projectId: projectId || 'dosje-smart-monitoring-demo',
    authDomain: `${projectId || 'dosje-smart-monitoring'}.firebaseapp.com`,
  };
}
