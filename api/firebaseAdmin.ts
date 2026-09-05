import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || '';
  if (!encoded) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set');
  }
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(decoded);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getFirestoreAdmin() {
  return getFirestore(getAdminApp());
}
