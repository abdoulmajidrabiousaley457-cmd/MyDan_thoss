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
  HardDrive,
  Users,
  Briefcase,
  LayoutGrid,
  ArrowRightLeft,
  BookOpen,
  Laptop,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { useUserProfile, ADMIN_USER_ID } from '../context/UserProfileContext';
import { useI18n } from '../i18n/I18nContext';
import { VaultFile } from '../types';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db, uploadFileToStorage, deleteFileFromStorage } from '../services/firebase';
import { storeLocalFileBlob, getLocalFileBlob } from '../services/localFileStorage';
import { usePWAInstall, openInstallModal } from '../hooks/usePWAInstall';
import { downloadNDAContract } from '../services/ndaDownloader';
import { UserActivityStatsVisualizer } from '../components/UserActivityStatsVisualizer';
import { recordActivityEvent } from '../services/userActivityStats';

interface DashboardScreenProps {
  onNavigateTab: (tab: string) => void;
  onOpenChat?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateTab, onOpenChat }) => {
  const { firebaseUser, profile, logout, isAdmin } = useUserProfile();
  const { t, isRtl } = useI18n();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<VaultFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Quick dropzone states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetClient, setTargetClient] = useState('');
  const [selectedCat, setSelectedCat] = useState<VaultFile['category']>('livrable');

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (!firebaseUser) {
      setFiles([]);
      setLoadingFiles(false);
      return;
    }

    const loadFiles = async () => {
      setLoadingFiles(true);
      try {
        const colRef = collection(db, 'users', firebaseUser.uid, 'vaultFiles');
        const snapshot = await getDocs(colRef);
        const docs: VaultFile[] = [];
        snapshot.forEach((d) => docs.push(d.data() as VaultFile));
        docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setFiles(docs);
      } catch (err) {
        console.warn('Loading fallback files:', err);
        try {
          const cached = localStorage.getItem(`rabiou_saley_vault_${firebaseUser.uid}`);
          if (cached) setFiles(JSON.parse(cached));
        } catch {
          // ignore
        }
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, [firebaseUser]);

  const handleQuickUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      setErrorMsg('Veuillez vous connecter pour enregistrer vos fichiers dans votre coffre-fort.');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Veuillez sélectionner un fichier à téléverser.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const fileId = `vf_${Date.now()}`;
      
      // 1. Immediately store raw binary blob into IndexedDB
      await storeLocalFileBlob(fileId, selectedFile);

      // 2. Upload to server storage and Firebase Cloud Storage
      const storageResult = await uploadFileToStorage(firebaseUser.uid, fileId, selectedFile);

      // 3. Keep inline base64 strictly under 32KB to avoid Firestore's 1MB document limit
      let smallBase64: string | undefined = undefined;
      if (selectedFile.size < 32000 && (selectedFile.type.startsWith('text/') || selectedFile.type.includes('json'))) {
        try {
          smallBase64 = await new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onloadend = () => res((reader.result as string) || '');
            reader.onerror = () => res('');
            reader.readAsDataURL(selectedFile);
          });
        } catch {
          // ignore
        }
      }

      const effectiveUrl = storageResult.downloadUrl || `/api/vault/files/${firebaseUser.uid}/${fileId}/${encodeURIComponent(selectedFile.name)}`;

      const newFile: VaultFile = {
        id: fileId,
        userId: firebaseUser.uid,
        name: selectedFile.name,
        size: selectedFile.size,
        sizeFormatted: formatBytes(selectedFile.size),
        type: selectedFile.type || 'application/octet-stream',
        category: selectedCat,
        clientName: targetClient.trim() || 'Client Général',
        uploadedAt: new Date().toISOString(),
        downloadCount: 0,
        status: 'active',
        fileContentBase64: smallBase64,
        storagePath: storageResult.storagePath || undefined,
        storageUrl: effectiveUrl
      };

      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'vaultFiles', fileId);
        await setDoc(docRef, newFile);
      } catch (fsErr) {
        console.warn('Firestore metadata notice in Dashboard:', fsErr);
      }

      setFiles((prev) => [newFile, ...prev]);
      recordActivityEvent('document_vault', selectedFile.name, { client: targetClient, category: selectedCat });
      setSuccessMsg(`Fichier "${selectedFile.name}" sécurisé avec succès dans votre coffre-fort.`);
      setSelectedFile(null);
      setTargetClient('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(`Erreur lors du téléversement : ${err?.message || 'Problème de connexion'}. Réessayez.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFile = async (file: VaultFile) => {
    try {
      let downloaded = false;

      // 1. Instant download from IndexedDB if binary blob is cached locally
      try {
        const blob = await getLocalFileBlob(file.id);
        if (blob && blob.size > 0) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
          downloaded = true;
        }
      } catch {
        // ignore
      }

      // 2. Download from storageUrl or backend server endpoint
      if (!downloaded) {
        const targetUrl = file.storageUrl || `/api/vault/files/${file.userId}/${file.id}/${encodeURIComponent(file.name)}`;
        const link = document.createElement('a');
        link.href = targetUrl;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloaded = true;
      }

      // 3. Fallback to base64
      if (!downloaded && file.fileContentBase64) {
        const link = document.createElement('a');
        link.href = file.fileContentBase64;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloaded = true;
      }

      setSuccessMsg(`Téléchargement lancé : "${file.name}"`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Download error in Dashboard:', err);
      setErrorMsg('Erreur lors du téléchargement.');
    }
  };

  const handleRequestDelete = (file: VaultFile) => {
    setFileToDelete(file);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    const target = fileToDelete;
    setDeleting(true);

    try {
      const uid = firebaseUser?.uid || target.userId || 'anonymous';
      await deleteFileFromStorage(target.storagePath || '', uid, target.id);

      if (firebaseUser) {
        try {
          await deleteDoc(doc(db, 'users', firebaseUser.uid, 'vaultFiles', target.id));
        } catch {
          // ignore
        }
      }

      setFiles((prev) => {
        const updated = prev.filter((f) => f.id !== target.id);
        try {
          localStorage.setItem(`rabiou_saley_vault_${uid}`, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setSuccessMsg(`Fichier "${target.name}" supprimé.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setFiles((prev) => {
        const updated = prev.filter((f) => f.id !== target.id);
        try {
          const uid = firebaseUser?.uid || target.userId || 'anonymous';
          localStorage.setItem(`rabiou_saley_vault_${uid}`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } finally {
      setDeleting(false);
      setFileToDelete(null);
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-rose-500" />;
    if (ext === 'py' || ext === 'ts' || ext === 'js' || ext === 'json') return <FileCode className="w-5 h-5 text-emerald-500" />;
    if (ext === 'csv' || ext === 'xlsx') return <FileSpreadsheet className="w-5 h-5 text-teal-500" />;
    if (ext === 'zip' || ext === 'tar') return <FileArchive className="w-5 h-5 text-amber-500" />;
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return <ImageIcon className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const totalDownloads = files.reduce((acc, f) => acc + (f.downloadCount || 0), 0);
  const distinctClients = Array.from(new Set(files.map((f) => f.clientName))).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome & User Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t('authPortalBadge', 'Portail Sécurisé • Cabinet Rabiou Saley')}</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white truncate">
              {t('welcomeUser', 'Bienvenue,')} {firebaseUser?.displayName || profile.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              {t('dashboardSubtitle', 'Vue d\'ensemble de votre espace de travail, de vos livrables et outils d\'ingénierie.')}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-emerald-400 font-mono">
              <span className="truncate max-w-[240px] sm:max-w-none">{firebaseUser?.email}</span>
              <span>•</span>
              <span className="font-sans font-bold text-slate-300">
                {profile.tier === 'vip_cabinet' ? 'VIP Cabinet 👑' : profile.tier === 'pro' ? 'Pro ⭐' : 'Découverte'}
              </span>
            </div>
          </div>

          {/* Action: Prominent Logout Button */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => onNavigateTab('admin_dashboard')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 shadow-md cursor-pointer border border-amber-300 animate-pulse"
                title="Accéder au Tableau de Bord Super Admin"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Vue Super Admin</span>
              </button>
            )}

            {!isInstalled && (
              <button
                onClick={async () => {
                  if (isInstallable) {
                    await install();
                  } else {
                    openInstallModal();
                  }
                }}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 shadow-md cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                title="Télécharger et installer l'application sur votre écran"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Installer l'App</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('client_vault')}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 shadow-md cursor-pointer"
            >
              <FolderLock className="w-4 h-4" />
              <span>{t('navClientVault', 'Coffre-fort Clients')}</span>
            </button>

            <button
              onClick={logout}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 text-xs font-bold border border-slate-700 hover:border-rose-800 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm"
              title={t('logout', 'Déconnexion')}
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{t('logout', 'Déconnexion')}</span>
            </button>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/70 p-2.5 sm:p-3.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 block text-[9.5px] sm:text-[10px] uppercase font-bold truncate">{t('statsTotalFiles', 'Fichiers')}</span>
              <span className="text-sm sm:text-base font-black text-white truncate block">{files.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/70 p-2.5 sm:p-3.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 block text-[9.5px] sm:text-[10px] uppercase font-bold truncate">{t('statsStorageUsed', 'Stockage')}</span>
              <span className="text-sm sm:text-base font-black text-white truncate block">{formatBytes(totalSize)}</span>
            </div>
          </div>

          <div className="bg-slate-900/70 p-2.5 sm:p-3.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 block text-[9.5px] sm:text-[10px] uppercase font-bold truncate">{t('statsActiveClients', 'Clients')}</span>
              <span className="text-sm sm:text-base font-black text-white truncate block">{distinctClients}</span>
            </div>
          </div>

          <div className="bg-slate-900/70 p-2.5 sm:p-3.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 block text-[9.5px] sm:text-[10px] uppercase font-bold truncate">{t('statsTotalDownloads', 'Téléchargés')}</span>
              <span className="text-sm sm:text-base font-black text-white truncate block">{totalDownloads}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="bg-emerald-950 text-emerald-200 border border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-950 text-rose-200 border border-rose-500/50 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* User Activity & Deliverables Visualization Analytics (Recharts) */}
      <UserActivityStatsVisualizer
        vaultFiles={files}
        onOpenChat={onOpenChat}
        onNavigateTab={onNavigateTab}
      />

      {/* Dedicated Home Screen Download / Install Banner Card */}
      {!isInstalled && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 animate-in fade-in">
          <div className="flex items-center gap-4 text-left">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-slate-950">
                <img src="/app-logo.png" alt="Logo Officiel Danthoss" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Application Officielle</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Mode Autonome</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Télécharger l'Application Danthoss sur l'Écran d'Accueil
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Ajoutez l'icône officielle Danthoss directement sur l'écran de votre smartphone (iPhone, Android) ou bureau d'ordinateur pour une utilisation fluide en plein écran.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={async () => {
                if (isInstallable) {
                  await install();
                } else {
                  openInstallModal();
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Télécharger sur mon Écran (1 Clic)</span>
            </button>
            <button
              onClick={() => openInstallModal()}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Guide iPhone & Android</span>
            </button>
          </div>
        </div>
      )}

      {isInstalled && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl px-4 py-3 text-xs text-emerald-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Application Danthoss installée et opérationnelle en mode autonome sur cet écran</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Écran d'Accueil Actif ✓</span>
        </div>
      )}

      {/* Quick Navigation Shortcuts Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t('quickActionsTitle', 'Accès Rapide aux Modules')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Client Vault */}
          <div
            onClick={() => onNavigateTab('client_vault')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderLock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                {t('openClientVault', 'Coffre-fort Clients (Client Vault)')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('openClientVaultDesc', 'Téléversez et gérez les livrables sécurisés pour vos clients')}
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-emerald-700 gap-1">
              <span>Accéder au Coffre-fort</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 2: Portfolios & CV */}
          <div
            onClick={() => onNavigateTab('cv_builder')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                {t('openPortfolioStudio', 'Studio Portfolios & CV')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('openPortfolioStudioDesc', 'Explorez nos portfolios et modèles de CV prêts à l\'emploi')}
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-sky-700 gap-1">
              <span>Créer & Modifier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 3: Digital Library */}
          <div
            onClick={() => onNavigateTab('library')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                {t('openDigitalLibrary', 'Bibliothèque Numérique Pro')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('openDigitalLibraryDesc', 'Consultez les guides, aide-mémoires et blueprints du cabinet')}
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>Consulter la Bibliothèque</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 4: Currency Converter */}
          <div
            onClick={() => onNavigateTab('currency')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                {t('openCurrencyConverter', 'Convertisseur de Devises')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('openCurrencyConverterDesc', 'Simulez vos honoraires en XOF, EUR, USD et devises mondiales')}
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-amber-700 gap-1">
              <span>Calculer les Devises</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 5: Remote Quote */}
          <div
            onClick={() => onNavigateTab('remote_devis')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                {t('openDevisSimulator', 'Simulateur de Devis Télétravail')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('openDevisSimulatorDesc', 'Estimez le coût d\'une mission Data Science ou Agent IA')}
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-purple-700 gap-1">
              <span>Estimer une Mission</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Card 6: Cabinet & Vercel Portfolio */}
          <div
            onClick={() => onNavigateTab('portfolio')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                {t('navCabinet', 'Cabinet & Portfolio Télétravail')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Découvrez les expertises, coordonnées directes et le portfolio hébergé
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-emerald-700 gap-1">
              <span>Explorer le Cabinet</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Dropzone directly on Dashboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>{t('dropzoneTitle', 'Zone de Téléversement Rapide')}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t('dropzoneDesc', 'Déposez votre fichier ici, ou cliquez pour parcourir vos dossiers')}
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickUpload} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              selectedFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
              className="hidden"
            />
            {selectedFile ? (
              <div className="space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">{formatBytes(selectedFile.size)}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Sélectionner un fichier à téléverser</p>
                <p className="text-[11px] text-slate-400">{t('dropzoneFormats', 'Formats : PDF, ZIP, Python, CSV, Word...')}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('clientNameLabel', 'Client ou Entreprise *')}
              </label>
              <input
                type="text"
                required
                value={targetClient}
                onChange={(e) => setTargetClient(e.target.value)}
                placeholder="Ex: Entreprise FinTech..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('categoryLabel', 'Catégorie')}
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="livrable">📦 Livrable</option>
                <option value="code">💻 Code</option>
                <option value="rapport">📊 Rapport</option>
                <option value="contrat">📑 Contrat</option>
                <option value="facture">💳 Facture</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? t('uploadingMsg', 'Téléversement...') : t('uploadBtn', 'Téléverser et Sécuriser')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Client Files Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              {t('recentVaultFilesTitle', 'Derniers Livrables Clients')} ({files.length})
            </h3>
            <p className="text-xs text-slate-400">
              Accédez à vos documents sécurisés et partagez-les en un clic.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('client_vault')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAllInVault', 'Gérer dans le Coffre-fort ↗')}</span>
          </button>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12 p-4 text-xs text-slate-400 space-y-2">
            <FolderLock className="w-8 h-8 mx-auto text-slate-300" />
            <p>{t('noRecentFiles', 'Aucun fichier téléversé pour le moment.')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">{t('fileNameCol', 'Fichier')}</th>
                  <th className="py-3 px-4">{t('clientCol', 'Client Destinataire')}</th>
                  <th className="py-3 px-4">{t('sizeCol', 'Taille')}</th>
                  <th className="py-3 px-4">{t('dateCol', 'Date')}</th>
                  <th className="py-3 px-4 text-right">{t('actionsCol', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {files.slice(0, 5).map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100">{getFileIcon(f.name)}</div>
                      <span className="truncate max-w-[200px]">{f.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{f.clientName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{f.sizeFormatted}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(f.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadFile(f)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                          title={t('downloadBtn', 'Télécharger')}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(f)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                          title={t('deleteBtn', 'Supprimer')}
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
        )}
      </div>

      {/* In-App Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Supprimer ce fichier du coffre-fort ?
                </h3>
                <p className="text-xs text-rose-300">
                  Le document sera retiré définitivement.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="font-bold text-xs text-white block truncate" title={fileToDelete.name}>
                {fileToDelete.name}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {fileToDelete.sizeFormatted} • Client : {fileToDelete.clientName}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Suppression...' : 'Supprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
