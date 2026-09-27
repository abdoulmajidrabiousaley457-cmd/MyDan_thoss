import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Globe, 
  Check, 
  Sparkles, 
  Camera, 
  Save, 
  FileText, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';

interface ProfileCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
];

const ROLE_PRESETS = [
  'Data Scientist & Ingénieur IA',
  'Développeur Full Stack',
  'Consultant & Chef de Projet',
  'Recruteur / Dirigeant d\'Entreprise',
  'Étudiant / Jeune Diplômé Tech',
];

export const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { profile, updateProfile, updateCVData, firebaseUser, loginGoogle } = useUserProfile();

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || profile.phone || '');
  const [role, setRole] = useState(profile.role || '');
  const [country, setCountry] = useState(profile.country || 'Niger');
  const [bio, setBio] = useState(profile.bio || '');
  const [status, setStatus] = useState(profile.status || 'Disponible immédiatement');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [applyToCV, setApplyToCV] = useState(true);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name: name.trim() || 'Utilisateur Danthoss',
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      role: role.trim() || 'Professionnel',
      country: country.trim(),
      bio: bio.trim(),
      status: status.trim(),
      avatarUrl: avatarUrl || undefined,
      isConfigured: true,
    });

    if (applyToCV) {
      updateCVData({
        fullName: name.trim() || profile.name,
        email: email.trim() || profile.email,
        phone: phone.trim() || profile.phone,
        jobTitle: role.trim() || profile.role,
        location: country.trim() || profile.country,
        bioSummary: bio.trim() || profile.bio || '',
      });
    }

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
      if (onSaved) onSaved();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-900/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Profil Portable & Cloud
                </span>
                {firebaseUser && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    🔥 Firebase Connecté
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Créer ou Personnaliser votre Profil
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Google Sync Bar */}
        {!firebaseUser ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-emerald-600">G</span>
              <span>Connectez-vous pour sauvegarder votre profil dans le cloud Firebase :</span>
            </div>
            <button
              type="button"
              onClick={loginGoogle}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              Connexion Google
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-800 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Connecté en tant que <strong>{firebaseUser.email}</strong></span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Photo ou Avatar de Profil
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-inner overflow-hidden border-2 border-emerald-500">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  name.slice(0, 2).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(img)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === img ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Option ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl"
                >
                  Initiale
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénom *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Rabiou Saley"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="votre.email@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="+227 96 49 99 06"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (!whatsapp) setWhatsapp(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pays / Ville</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ex: Niamey, Niger / Télétravail"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Role / Profession & Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rôle Professionnel ou Titre *</label>
            <div className="relative mb-2">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="Ex: Consultant Data Science & Concepteur d'Agents IA"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_PRESETS.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    role === r
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Bio & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Statut de Disponibilité</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                <option value="🟢 Disponible pour missions / Télétravail">🟢 Disponible pour missions / Télétravail</option>
                <option value="💼 En recherche active d'opportunités">💼 En recherche active d'opportunités</option>
                <option value="🏢 Recruteur / Entreprise à la recherche de profils">🏢 Recruteur / Entreprise</option>
                <option value="🟡 En poste, ouvert aux opportunités de consulting">🟡 En poste, ouvert au consulting</option>
                <option value="🎓 Étudiant en formation">🎓 Étudiant en formation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lien WhatsApp direct</label>
              <input
                type="text"
                placeholder="Ex: 22796499906"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Bio Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Résumé Professionnel</label>
            <textarea
              rows={2}
              placeholder="Présentez brièvement vos compétences clés, vos projets ou vos besoins en télétravail..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Apply to CV Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
            <input
              type="checkbox"
              id="applyCvCheck"
              checked={applyToCV}
              onChange={(e) => setApplyToCV(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="applyCvCheck" className="text-xs text-emerald-950 font-medium cursor-pointer">
              Synchroniser automatiquement ces coordonnées dans le <strong>Studio CV & Lettre de Motivation</strong>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSavedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Profil Enregistré avec Succès !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer mon Profil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
