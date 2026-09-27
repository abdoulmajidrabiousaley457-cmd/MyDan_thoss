import React, { useState } from 'react';
import { ArrowLeft, Bell, Sparkles, Laptop, ShieldCheck, CheckCheck, FileText, Briefcase } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useUserProfile();
  const [filter, setFilter] = useState<'all' | 'career' | 'cabinet' | 'remote' | 'account'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'career':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'cabinet':
        return <Briefcase className="w-4 h-4 text-sky-600" />;
      case 'remote':
        return <Laptop className="w-4 h-4 text-indigo-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Centre de Notifications</h2>
            <p className="text-xs text-slate-500">Mises à jour du Cabinet, opportunités télétravail et alertes carrière</p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Tout marquer comme lu</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto">
        {[
          { id: 'all', label: 'Toutes' },
          { id: 'remote', label: 'Télétravail' },
          { id: 'career', label: 'Carrière & CV' },
          { id: 'cabinet', label: 'Cabinet' },
          { id: 'account', label: 'Abonnement' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
            <p className="text-xs">Aucune notification dans cette catégorie.</p>
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
