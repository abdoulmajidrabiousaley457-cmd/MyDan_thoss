import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Laptop,
  ShieldCheck,
  CheckCheck,
  FileText,
  Briefcase,
  FolderLock,
  Mail
} from 'lucide-react';
import { useUserProfile, CORPORATE_EMAIL } from '../context/UserProfileContext';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isAdmin,
    firebaseUser
  } = useUserProfile();
  const [filter, setFilter] = useState<'all' | 'career' | 'cabinet' | 'remote' | 'account'>('all');

  // Strict client vs admin isolation at UI layer as well
  const roleScopedNotifications = notifications.filter((n) => {
    if (isAdmin) {
      return n.audience !== 'client';
    }
    if (n.audience === 'admin') return false;
    if (firebaseUser?.uid && n.recipientUid && n.recipientUid !== firebaseUser.uid) return false;
    return true;
  });

  const filtered = roleScopedNotifications.filter((n) => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'career':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'cabinet':
        return isAdmin ? (
          <Mail className="w-4 h-4 text-emerald-600" />
        ) : (
          <FolderLock className="w-4 h-4 text-sky-600" />
        );
      case 'remote':
        return isAdmin ? (
          <Briefcase className="w-4 h-4 text-indigo-600" />
        ) : (
          <Laptop className="w-4 h-4 text-indigo-600" />
        );
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
    }
  };

  const filterTabs = isAdmin
    ? [
        { id: 'all', label: 'Toutes (Admin)' },
        { id: 'cabinet', label: 'E-mails & Clients' },
        { id: 'remote', label: 'Devis & Missions' },
        { id: 'career', label: 'Système & Studio' },
        { id: 'account', label: 'Compte Admin' }
      ]
    : [
        { id: 'all', label: 'Toutes mes alertes' },
        { id: 'cabinet', label: 'Mes Livrables & Réponses' },
        { id: 'remote', label: 'Mes Devis' },
        { id: 'career', label: 'Mes CVs' },
        { id: 'account', label: 'Mon Compte' }
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAdmin ? 'Notifications Administrateur' : 'Mes Notifications Personnelles'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAdmin
                ? `Suivi temps réel des messages clients (${CORPORATE_EMAIL}) et des demandes de devis`
                : `Alertes personnelles dédiées à votre compte (${firebaseUser?.email || 'Espace Client'})`}
            </p>
          </div>
        </div>

        {roleScopedNotifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer self-end sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tout marquer comme lu</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {filterTabs.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              filter === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">
              {isAdmin
                ? 'Aucune notification administrateur dans cette catégorie.'
                : 'Aucune notification personnelle dans cette catégorie.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                item.read
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-emerald-50/60 border-emerald-200 text-slate-900 font-medium shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
