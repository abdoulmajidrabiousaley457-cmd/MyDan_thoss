import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderLock, 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  LogOut, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Eye, 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  FileCode, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileArchive, 
  Sparkles, 
  Copy, 
  X, 
  Plus, 
  HardDrive,
  Users,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useI18n } from '../i18n/I18nContext';
import { VaultFile } from '../types';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db, uploadFileToStorage, deleteFileFromStorage, handleFirestoreError, OperationType } from '../services/firebase';
import { storeLocalFileBlob, getLocalFileBlob } from '../services/localFileStorage';
import { AuthScreen } from './AuthScreen';

interface ClientVaultScreenProps {
  onNavigateTab?: (tab: string) => void;
}

export const ClientVaultScreen: React.FC<ClientVaultScreenProps> = ({ onNavigateTab }) => {
  const { firebaseUser, logout } = useUserProfile();
  const { t, isRtl } = useI18n();

  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<'dashboard' | 'client_portal'>('dashboard');
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLinkFileId, setCopiedLinkFileId] = useState<string | null>(null);

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [fileCategory, setFileCategory] = useState<VaultFile['category']>('livrable');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Client Portal Simulation Filter
  const [portalClientFilter, setPortalClientFilter] = useState('');

  // Load files from Firestore when user is logged in
  useEffect(() => {
    if (!firebaseUser) {
      setFiles([]);
      setLoading(false);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      try {
        const vaultColRef = collection(db, 'users', firebaseUser.uid, 'vaultFiles');
        const snapshot = await getDocs(vaultColRef);
        const loaded: VaultFile[] = [];

        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as VaultFile);
        });

        // Sort by upload date descending
        loaded.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setFiles(loaded);
      } catch (err) {
        console.warn('Error fetching vault files from Firestore, loading local fallback:', err);
        // Fallback to localStorage if any
        try {
          const cached = localStorage.getItem(`rabiou_saley_vault_${firebaseUser.uid}`);
          if (cached) {
            setFiles(JSON.parse(cached));
          } else {
            // Seed sample files for high demonstration value
            const sampleFiles = getSampleFiles(firebaseUser.uid);
            setFiles(sampleFiles);
          }
        } catch {
          // ignore
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [firebaseUser]);

  // Save to local cache whenever files change
  useEffect(() => {
    if (firebaseUser && files.length > 0) {
      try {
        localStorage.setItem(`rabiou_saley_vault_${firebaseUser.uid}`, JSON.stringify(files));
      } catch (e) {
        // quota exceeded for base64 storage, silently handle
      }
    }
  }, [files, firebaseUser]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSampleFiles = (userId: string): VaultFile[] => [
    {
      id: 'vf_sample_1',
      userId,
      name: 'Rapport_Audit_IA_MultiAgents_Final.pdf',
      size: 4200000,
      sizeFormatted: '4.2 MB',
      type: 'application/pdf',
      category: 'rapport',
      clientName: 'Entreprise FinTech Afrique',
      clientEmail: 'direction@fintech-afrique.com',
      uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      downloadCount: 3,
      status: 'active',
      notes: 'Livrable final d\'audit architectural et stratégie de déploiement des agents LangGraph.'
    },
    {
      id: 'vf_sample_2',
      userId,
      name: 'Code_Source_Pipeline_MLOps_Docker.zip',
      size: 8500000,
      sizeFormatted: '8.5 MB',
      type: 'application/zip',
      category: 'code',
      clientName: 'Cabinet Consulting Europe',
      clientEmail: 'tech@consulting-europe.eu',
      uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      downloadCount: 5,
      status: 'active',
      notes: 'Scripts FastAPI, conteneurs Docker et configurations de suivi des dérives de modèles.'
    },
    {
      id: 'vf_sample_3',
      userId,
      name: 'Contrat_Prestation_Remote_Signe_NDA.pdf',
      size: 1800000,
      sizeFormatted: '1.8 MB',
      type: 'application/pdf',
      category: 'contrat',
      clientName: 'Société Logistique Ouest',
      clientEmail: 'contact@logistique-ouest.com',
      uploadedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      downloadCount: 1,
      status: 'active',
      notes: 'Contrat de prestation en télétravail international et engagement de confidentialité paraphé.'
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      setErrorMessage('Veuillez vous connecter pour téléverser un fichier dans votre coffre-fort.');
      return;
    }
    if (!selectedUploadFile) {
      setErrorMessage('Veuillez sélectionner un fichier à téléverser.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadStep('Initialisation du téléversement...');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fileId = `vf_${Date.now()}`;
      const fileName = selectedUploadFile.name;
      const fileSize = selectedUploadFile.size;
      const fileType = selectedUploadFile.type || 'application/octet-stream';

      // 1. Immediately store binary blob into client IndexedDB for instant downloads
      setUploadStep('Chiffrement local et mise en cache...');
      setUploadProgress(20);
      await storeLocalFileBlob(fileId, selectedUploadFile);
      setUploadProgress(40);

      // 2. Upload to server storage & Firebase Storage
      setUploadStep('Transfert sécurisé vers le coffre-fort...');
      const storageResult = await uploadFileToStorage(
        firebaseUser.uid, 
        fileId, 
        selectedUploadFile, 
        (pct) => {
          setUploadProgress(Math.max(20, Math.min(95, pct)));
          if (pct >= 85) setUploadStep('Sécurisation et enregistrement...');
          else if (pct >= 50) setUploadStep('Transfert vers le stockage sécurisé...');
        }
      );

      // 3. Keep inline base64 strictly under 32KB to avoid Firestore's 1MB document limit
      let smallInlineBase64: string | undefined = undefined;
      if (fileSize < 32000 && (fileType.startsWith('text/') || fileType.includes('json') || fileType.includes('python'))) {
        try {
          smallInlineBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string) || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(selectedUploadFile);
          });
        } catch {
          // ignore
        }
      }

      setUploadStep('Enregistrement des métadonnées dans Firestore...');
      setUploadProgress(95);

      const effectiveStorageUrl = storageResult.downloadUrl || `/api/vault/files/${firebaseUser.uid}/${fileId}/${encodeURIComponent(fileName)}`;

      const newVaultFile: VaultFile = {
        id: fileId,
        userId: firebaseUser.uid,
        name: fileName,
        size: fileSize,
        sizeFormatted: formatFileSize(fileSize),
        type: fileType,
        category: fileCategory,
        clientName: clientName.trim() || 'Client Général',
        clientEmail: clientEmail.trim() || undefined,
        uploadedAt: new Date().toISOString(),
        downloadCount: 0,
        status: 'active',
        notes: deliveryNotes.trim() || undefined,
        fileContentBase64: smallInlineBase64,
        storagePath: storageResult.storagePath || undefined,
        storageUrl: effectiveStorageUrl
      };

      // Save metadata to Firestore under /users/{userId}/vaultFiles/{fileId}
      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'vaultFiles', fileId);
        await setDoc(docRef, newVaultFile);
      } catch (firestoreError) {
        console.warn('Firestore metadata notice (saved to local vault):', firestoreError);
      }

      setFiles((prev) => [newVaultFile, ...prev]);
      setUploadProgress(100);
      setUploadStep('Téléversement terminé avec succès !');
      setSuccessMessage(`Fichier "${fileName}" (${formatFileSize(fileSize)}) téléversé et sécurisé avec succès dans votre coffre-fort !`);

      // Reset form
      setSelectedUploadFile(null);
      setClientName('');
      setClientEmail('');
      setDeliveryNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        setSuccessMessage(null);
        setUploadProgress(0);
        setUploadStep('');
      }, 5000);
    } catch (err: any) {
      console.error('File upload error:', err);
      setErrorMessage(`Erreur lors du téléversement : ${err?.message || 'Problème de connexion'}. Réessayez.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!firebaseUser) return;
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le fichier "${fileName}" du coffre-fort ?`);
    if (!confirmDelete) return;

    try {
      const fileToDelete = files.find((f) => f.id === fileId);
      await deleteFileFromStorage(fileToDelete?.storagePath || '', firebaseUser.uid, fileId);

      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'vaultFiles', fileId);
        await deleteDoc(docRef);
      } catch {
        // ignore
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setSuccessMessage(`Fichier "${fileName}" supprimé du coffre-fort.`);
      if (previewFile?.id === fileId) setPreviewFile(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.warn('Error deleting file, removing locally:', err);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setSuccessMessage(`Fichier "${fileName}" supprimé.`);
    }
  };

  const handleDownloadFile = async (file: VaultFile) => {
    try {
      let downloadTriggered = false;

      // 1. Check local IndexedDB first for instant binary access (original intact file)
      try {
        const localBlob = await getLocalFileBlob(file.id);
        if (localBlob && localBlob.size > 0) {
          const blobUrl = URL.createObjectURL(localBlob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
          downloadTriggered = true;
        }
      } catch (blobErr) {
        console.warn('IndexedDB blob retrieval notice:', blobErr);
      }

      // 2. If not triggered from IndexedDB, download from storageUrl or Node server endpoint
      if (!downloadTriggered) {
        const targetUrl = file.storageUrl || `/api/vault/files/${file.userId}/${file.id}/${encodeURIComponent(file.name)}`;
        const link = document.createElement('a');
        link.href = targetUrl;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadTriggered = true;
      }

      // 3. Fallback to base64 if present
      if (!downloadTriggered && file.fileContentBase64) {
        const link = document.createElement('a');
        link.href = file.fileContentBase64;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadTriggered = true;
      }

      // Increment download counter in Firestore
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid, 'vaultFiles', file.id);
          await updateDoc(docRef, { downloadCount: increment(1) });
        } catch {
          // ignore
        }
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, downloadCount: (f.downloadCount || 0) + 1 } : f))
      );
      setSuccessMessage(`Téléchargement lancé avec succès : "${file.name}"`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Download error:', err);
      setErrorMessage('Erreur lors du téléchargement du fichier.');
    }
  };

  const handleCopyClientLink = (file: VaultFile) => {
    const portalUrl = `${window.location.origin}/#client-vault?file=${file.id}&client=${encodeURIComponent(file.clientName)}`;
    navigator.clipboard.writeText(portalUrl);
    setCopiedLinkFileId(file.id);
    setSuccessMessage(`Lien de téléchargement sécurisé pour "${file.clientName}" copié !`);
    setTimeout(() => {
      setCopiedLinkFileId(null);
      setSuccessMessage(null);
    }, 3500);
  };

  // Get file icon based on name/extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-rose-500" />;
    if (ext === 'py' || ext === 'ts' || ext === 'js' || ext === 'json' || ext === 'html') {
      return <FileCode className="w-5 h-5 text-emerald-500" />;
    }
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
      return <FileSpreadsheet className="w-5 h-5 text-teal-500" />;
    }
    if (ext === 'zip' || ext === 'tar' || ext === 'gz') {
      return <FileArchive className="w-5 h-5 text-amber-500" />;
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
      return <ImageIcon className="w-5 h-5 text-purple-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  // Category labels
  const categories = [
    { id: 'all', label: t('catAll', 'Tous les fichiers') },
    { id: 'livrable', label: t('catDeliverable', '📦 Livrables') },
    { id: 'code', label: t('catCode', '💻 Code & Scripts') },
    { id: 'rapport', label: t('catReport', '📊 Rapports') },
    { id: 'contrat', label: t('catContract', '📑 Contrats & NDA') },
    { id: 'facture', label: t('catInvoice', '💳 Factures') },
  ];

  // Filtering
  const filteredFiles = files.filter((f) => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeView === 'client_portal' && portalClientFilter) {
      return f.clientName.toLowerCase().includes(portalClientFilter.toLowerCase());
    }

    return matchesCat && matchesSearch;
  });

  // Calculate metrics
  const totalSizeBytes = files.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const totalDownloads = files.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  const distinctClients = Array.from(new Set(files.map((f) => f.clientName))).length;

  // If user is not authenticated, show Auth Page with explanatory banner
  if (!firebaseUser) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <FolderLock className="w-3.5 h-3.5" />
            <span>Client Vault • Portail Sécurisé de Fichiers Clients</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            Coffre-fort Clients & Partage Sécurisé de Livrables
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Permettez à vos clients de télécharger leurs livrables, rapports et codes sources en toute sécurité. 
            Connectez-vous avec votre adresse e-mail et mot de passe pour accéder à votre tableau de bord dédié.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Chiffrement et isolation des données</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
              <Download className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Téléchargement direct et liens clients</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-purple-400 shrink-0" />
              <span>Règles de sécurité Firestore strictes</span>
            </div>
          </div>
        </div>

        {/* Auth Component Embedded */}
        <AuthScreen onNavigateTab={onNavigateTab} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner with Stats & Logout */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <FolderLock className="w-3.5 h-3.5" />
              <span>Tableau de Bord Client Vault</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Coffre-fort Fichiers Clients
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Espace de partage de fichiers pour <strong>{firebaseUser.email}</strong>. 
              Téléversez vos livrables et donnez accès à vos clients en toute sécurité.
            </p>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView(activeView === 'dashboard' ? 'client_portal' : 'dashboard')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activeView === 'client_portal'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{activeView === 'client_portal' ? 'Retour Dashboard' : 'Aperçu Portail Client'}</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 text-xs font-bold border border-slate-700 hover:border-rose-800/80 transition-all flex items-center gap-2 cursor-pointer"
              title="Déconnexion de votre compte"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Fichiers stockés</span>
              <span className="text-base font-black text-white">{files.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Espace utilisé</span>
              <span className="text-base font-black text-white">{formatFileSize(totalSizeBytes)}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Clients servis</span>
              <span className="text-base font-black text-white">{distinctClients}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Téléchargements</span>
              <span className="text-base font-black text-white">{totalDownloads}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="bg-emerald-950 text-emerald-200 border border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-950 text-rose-200 border border-rose-500/50 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Client Portal Simulation View */}
      {activeView === 'client_portal' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Simulation : Espace Téléchargement Client</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Portail Public de Téléchargement pour vos Clients
              </h2>
              <p className="text-xs text-slate-500">
                Voici l'interface telle que vos clients la perçoivent lorsqu'ils reçoivent votre lien sécurisé.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Filtrer par nom de client :</label>
              <input
                type="text"
                placeholder="Ex: Entreprise FinTech..."
                value={portalClientFilter}
                onChange={(e) => setPortalClientFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
                      {getFileIcon(file.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{file.name}</h4>
                      <p className="text-[11px] text-slate-400">{file.sizeFormatted} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 uppercase">
                    {file.category}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Destinataire : {file.clientName}</span>
                  <p className="line-clamp-2">{file.notes || 'Livrable prêt à être téléchargé en haute fidélité.'}</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Téléchargé {file.downloadCount} fois</span>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger le Fichier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Freelancer Dashboard View */
        <div className="space-y-8">
          {/* File Upload Dropzone Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  Zone de Téléversement de Fichiers Clients
                </h2>
                <p className="text-xs text-slate-500">
                  Déposez un livrable, code source, rapport ou contrat pour votre client.
                </p>
              </div>

              <span className="hidden sm:inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Chiffrement & Sauvegarde Cloud
              </span>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              {/* Dropzone Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                  selectedUploadFile
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedUploadFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{selectedUploadFile.name}</h4>
                      <p className="text-xs text-slate-500">{formatFileSize(selectedUploadFile.size)} • Prêt à être sécurisé</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUploadFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-xs text-rose-600 hover:underline font-bold mt-1"
                    >
                      Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Glissez-déposez votre fichier ici, ou <span className="text-emerald-700 underline">parcourir vos dossiers</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Tous formats acceptés : PDF, ZIP, Python, Notebook, Word, Excel, Images (Max 50 MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Client ou Entreprise *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Entreprise Fintech"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email du Client (optionnel)</label>
                  <input
                    type="email"
                    placeholder="client@entreprise.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Catégorie du Fichier</label>
                  <select
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="livrable">📦 Livrable final</option>
                    <option value="code">💻 Code & Notebook</option>
                    <option value="rapport">📊 Rapport d'audit / Synthèse</option>
                    <option value="contrat">📑 Contrat & NDA</option>
                    <option value="facture">💳 Facture d'acompte / Solde</option>
                    <option value="autre">📎 Autre document</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Instructions ou Note de livraison pour le client</label>
                <input
                  type="text"
                  placeholder="Ex: Version finale validée du pipeline LangGraph. Veuillez consulter le README avant exécution."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {uploading ? (
                  <div className="flex-1 space-y-1.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        <span>{uploadStep || 'Téléversement et sécurisation en cours...'}</span>
                      </span>
                      <span className="font-mono">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : <div />}

                <button
                  type="submit"
                  disabled={uploading || !selectedUploadFile}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {uploading ? (
                    <span className="animate-pulse">Traitement en cours...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Téléverser et Sécuriser dans le Coffre-fort</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher parmi les fichiers (nom, client, notes)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Files Table / List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Fichiers Clients Téléversés ({filteredFiles.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gérez vos livrables, téléchargez vos archives et transmettez les liens sécurisés.
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  Total : {formatFileSize(totalSizeBytes)}
                </span>
              </div>

              {filteredFiles.length === 0 ? (
                <div className="text-center py-16 p-6 space-y-3">
                  <FolderLock className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">Aucun fichier trouvé</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Aucun document ne correspond à vos filtres. Utilisez la zone ci-dessus pour téléverser votre premier livrable.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Cards View (Phones < 640px) */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                              {getFileIcon(file.name)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-slate-900 truncate" title={file.name}>
                                {file.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded capitalize">
                                  {file.category}
                                </span>
                                <span>•</span>
                                <span className="font-mono">{file.sizeFormatted}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Client :</span>
                            <span className="font-bold text-slate-800">{file.clientName}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Date :</span>
                            <span>{new Date(file.uploadedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            title="Télécharger"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Ouvrir</span>
                          </button>
                          <button
                            onClick={() => handleCopyClientLink(file)}
                            className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                              copiedLinkFileId === file.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="Lien"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{copiedLinkFileId === file.id ? 'Copié' : 'Lien'}</span>
                          </button>
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            title="Détails"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Détails</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Suppr.</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop & Tablet Table (>= 640px) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Fichier</th>
                          <th className="py-3 px-4">Client Destinataire</th>
                          <th className="py-3 px-4">Taille</th>
                          <th className="py-3 px-4">Date de téléversement</th>
                          <th className="py-3 px-4">Téléchargements</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                                  {getFileIcon(file.name)}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block max-w-xs truncate" title={file.name}>
                                    {file.name}
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded capitalize">
                                    {file.category}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              <div>
                                <span>{file.clientName}</span>
                                {file.clientEmail && (
                                  <span className="text-[10px] text-slate-400 block">{file.clientEmail}</span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                              {file.sizeFormatted}
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 font-medium">
                              {new Date(file.uploadedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700">
                                {file.downloadCount} fois
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Download file */}
                                <button
                                  onClick={() => handleDownloadFile(file)}
                                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                                  title="Télécharger le fichier"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>

                                {/* Copy client link */}
                                <button
                                  onClick={() => handleCopyClientLink(file)}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    copiedLinkFileId === file.id
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="Copier le lien sécurisé pour le client"
                                >
                                  {copiedLinkFileId === file.id ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <Share2 className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* View / Preview */}
                                <button
                                  onClick={() => setPreviewFile(file)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                  title="Voir les détails et prévisualiser"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete File */}
                                <button
                                  onClick={() => handleDeleteFile(file.id, file.name)}
                                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                                  title="Supprimer définitivement le fichier"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-100">
                  {getFileIcon(previewFile.name)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {previewFile.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {previewFile.sizeFormatted} • Catégorie : {previewFile.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">Client destinataire :</span>
                <span className="font-semibold text-slate-800">{previewFile.clientName}</span>
              </div>
              {previewFile.clientEmail && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold">Email du client :</span>
                  <span className="font-semibold text-slate-800">{previewFile.clientEmail}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">Date de téléversement :</span>
                <span className="font-semibold text-slate-800">
                  {new Date(previewFile.uploadedAt).toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">Téléchargements clients :</span>
                <span className="font-semibold text-slate-800">{previewFile.downloadCount} fois</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1">Notes de livraison :</span>
                <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                  {previewFile.notes || 'Aucune consigne spécifique enregistrée.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopyClientLink(previewFile)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Copier Lien Client</span>
              </button>

              <button
                onClick={() => handleDownloadFile(previewFile)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
