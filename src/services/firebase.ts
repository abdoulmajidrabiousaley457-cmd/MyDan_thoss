import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocFromServer } from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID as required
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Cloud Storage with production bucket
export const storage = getStorage(
  app, 
  firebaseConfig.storageBucket || `gs://${firebaseConfig.projectId}.firebasestorage.app`
);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Web SDK & Identity Services configuration
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Project Information for diagnostics and console configuration
export const FIREBASE_PROJECT_INFO = {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  oAuthClientId: firebaseConfig.oAuthClientId,
  storageBucket: firebaseConfig.storageBucket,
  appId: firebaseConfig.appId,
  consoleAuthUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`,
  consoleGeneralUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/settings/general`,
  googleCloudCredentialsUrl: `https://console.cloud.google.com/apis/credentials?project=${firebaseConfig.projectId}`,
  currentHost: typeof window !== 'undefined' ? window.location.hostname : 'my-dan-thoss-6zf3poqbb-portfolio-a372.vercel.app',
  vercelDomain: 'my-dan-thoss-6zf3poqbb-portfolio-a372.vercel.app'
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as specified in guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting.');
    }
  }
}
testConnection();

// Synchronize user profile in Firestore safely
export async function syncFirebaseUserInFirestore(user: User) {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      id: user.uid,
      name: user.displayName || 'Utilisateur',
      email: user.email,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore profile sync notice:', err);
  }
}

// Authentication helpers
export async function loginWithGoogle(preferRedirect = false): Promise<UserCredential | null> {
  // 1. If explicit redirect is requested, trigger signInWithRedirect
  if (preferRedirect) {
    try {
      await signInWithRedirect(auth, googleProvider);
      return null;
    } catch (redirectError) {
      console.warn('Explicit redirect sign-in error:', redirectError);
      throw redirectError;
    }
  }

  // 2. Default to signInWithPopup - this is the standard, state-preserving method across desktop & mobile
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred && cred.user) {
      await syncFirebaseUserInFirestore(cred.user);
    }
    return cred;
  } catch (error: any) {
    const code = error?.code || '';

    // If the user deliberately closed or cancelled the popup window, do NOT trigger a redirect loop
    if (code === 'auth/popup-closed-by-user') {
      console.info('Google Sign-In popup closed by user.');
      return null;
    }

    if (code === 'auth/cancelled-popup-request') {
      console.info('Google Sign-In popup cancelled because another popup is active.');
      return null;
    }

    // Only if popup was strictly blocked by browser policy, try redirect as a fallback
    if (code === 'auth/popup-blocked') {
      console.warn('Popup blocked by browser, attempting signInWithRedirect fallback:', error);
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectFallbackErr) {
        throw redirectFallbackErr;
      }
    }

    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function checkRedirectAuthResult(): Promise<UserCredential | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await syncFirebaseUserInFirestore(result.user);
      return result;
    }
    return null;
  } catch (error: any) {
    console.warn('Redirect auth result check notice:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    if (cred.user) {
      const userDocRef = doc(db, 'users', cred.user.uid);
      await setDoc(userDocRef, {
        id: cred.user.uid,
        email: cred.user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return cred;
  } catch (error) {
    console.error('Email Sign In Error:', error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string, name?: string) {
  try {
    const cleanEmail = email.trim();
    const cleanName = name?.trim() || cleanEmail.split('@')[0] || 'Membre Pro';
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, { displayName: cleanName });

      const isCabinetFounder = [
        'abdoulmajidrabiousaley457@gmail.com',
        'contact@danthoss-cabinet.com',
        'direction@danthoss-cabinet.com',
        'rabiou.saley@danthoss-cabinet.com'
      ].includes(cleanEmail.toLowerCase());

      // Explicitly initialize user profile document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        name: isCabinetFounder ? (name?.trim() || 'Rabiou Saley Abdoul Majid') : cleanName,
        email: cleanEmail,
        tier: isCabinetFounder ? 'vip_cabinet' : 'free',
        role: isCabinetFounder ? 'Fondateur & Administrateur Référent' : 'Consultant & Pigiste',
        country: 'Niger / International',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return userCredential;
  } catch (error) {
    console.error('Email Registration Error:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    return await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error('Password Reset Error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

import { storeLocalFileBlob, deleteLocalFileBlob } from './localFileStorage';

// ========================
// HYBRID CLOUD & LOCAL STORAGE HELPERS
// ========================

export async function uploadFileToStorage(
  userId: string,
  fileId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<{ downloadUrl: string; storagePath: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `vaultFiles/${userId}/${fileId}/${safeName}`;
  let finalDownloadUrl = `/api/vault/files/${encodeURIComponent(userId)}/${encodeURIComponent(fileId)}/${encodeURIComponent(file.name)}`;

  // 1. Immediately cache the binary in client IndexedDB for instantaneous downloads & offline previews
  try {
    if (onProgress) onProgress(20);
    await storeLocalFileBlob(fileId, file);
    if (onProgress) onProgress(40);
  } catch (idbErr) {
    console.warn('IndexedDB blob storage notice:', idbErr);
  }

  // 2. Upload to Node.js / Express Server Persistent Storage
  try {
    if (onProgress) onProgress(55);
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    if (onProgress) onProgress(75);

    const resp = await fetch('/api/vault/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        fileId,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        dataBase64: base64Data
      })
    });

    if (resp.ok) {
      const result = await resp.json();
      if (result.fileUrl) {
        finalDownloadUrl = result.fileUrl;
      }
    }
    if (onProgress) onProgress(90);
  } catch (serverErr) {
    console.warn('Server storage api upload notice:', serverErr);
  }

  // 3. Optional non-blocking Firebase Cloud Storage sync (with strict 1.5s timeout - NEVER blocks)
  try {
    const storageRef = ref(storage, storagePath);
    const cloudUploadPromise = uploadBytes(storageRef, file)
      .then(async (snapshot) => {
        try {
          const url = await getDownloadURL(snapshot.ref);
          if (url) finalDownloadUrl = url;
        } catch {
          // ignore
        }
      })
      .catch((err) => {
        console.warn('Firebase Cloud Storage sync notice:', err);
      });

    // Enforce 1.5s timeout so Firebase Storage CORS/network never hangs the upload
    await Promise.race([
      cloudUploadPromise,
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);
  } catch (storageErr) {
    console.warn('Firebase Cloud Storage fallback active (using server URL):', storageErr);
  }

  if (onProgress) onProgress(100);

  return { downloadUrl: finalDownloadUrl, storagePath };
}

export async function deleteFileFromStorage(storagePath: string, userId?: string, fileId?: string): Promise<void> {
  // 1. Delete from IndexedDB if fileId is present
  if (fileId) {
    try {
      await deleteLocalFileBlob(fileId);
    } catch {
      // ignore
    }
  }

  // 2. Delete from Node.js server storage if userId and fileId are available
  if (userId && fileId) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      await fetch(`/api/vault/files/${encodeURIComponent(userId)}/${encodeURIComponent(fileId)}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // non-blocking for static or serverless deployments
    }
  }

  // 3. Delete from Firebase Cloud Storage
  if (storagePath) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Storage deleteObject notice:', err);
    }
  }
}
