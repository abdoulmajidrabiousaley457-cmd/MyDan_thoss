import React, { useState, useEffect } from 'react';
import { I18nProvider } from './i18n/I18nContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { Header } from './components/Header';
import { AppDrawer } from './components/AppDrawer';
import { BottomNav } from './components/BottomNav';
import { NexusFab } from './components/NexusFab';
import { NexusChatModal } from './components/NexusChatModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InstallAppModal } from './components/InstallAppModal';

import { PortfolioCabinetScreen } from './screens/PortfolioCabinetScreen';
import { CVBuilderScreen } from './screens/CVBuilderScreen';
import { CurrencyConverterScreen } from './screens/CurrencyConverterScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { SubscriptionScreen } from './screens/SubscriptionScreen';
import { RemoteDevisScreen } from './screens/RemoteDevisScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SecurityPrivacyScreen } from './screens/SecurityPrivacyScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'cv_builder' | 'currency' | 'library' | 'subscription' | 'remote_devis' | 'profile'>('portfolio');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nexusOpen, setNexusOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<'security' | 'notifications' | null>(null);

  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      if (e.detail) {
        setActiveOverlay(null);
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('switch-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-tab', handleSwitchTab);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveOverlay(null);
    setActiveTab(tab as any);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* PWA Mobile Installation Banner */}
      <PWAInstallBanner />

      {/* Top Header */}
      <Header
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenNotifications={() => setActiveOverlay('notifications')}
        onOpenProfile={() => handleSelectTab('profile')}
        onOpenDevis={() => handleSelectTab('remote_devis')}
      />

      {/* Navigation Drawer */}
      <AppDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenNexus={() => setNexusOpen(true)}
        onOpenSecurity={() => setActiveOverlay('security')}
        onOpenNotifications={() => setActiveOverlay('notifications')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 pb-28">
        {activeOverlay === 'security' && (
          <SecurityPrivacyScreen onBack={() => setActiveOverlay(null)} />
        )}
        {activeOverlay === 'notifications' && (
          <NotificationsScreen onBack={() => setActiveOverlay(null)} />
        )}

        {!activeOverlay && (
          <>
            {activeTab === 'portfolio' && (
              <PortfolioCabinetScreen onNavigateTab={handleSelectTab} />
            )}
            {activeTab === 'cv_builder' && <CVBuilderScreen />}
            {activeTab === 'currency' && <CurrencyConverterScreen />}
            {activeTab === 'library' && <LibraryScreen />}
            {activeTab === 'subscription' && <SubscriptionScreen />}
            {activeTab === 'remote_devis' && <RemoteDevisScreen />}
            {activeTab === 'profile' && (
              <ProfileScreen
                onOpenSecurity={() => setActiveOverlay('security')}
                onOpenNotifications={() => setActiveOverlay('notifications')}
                onNavigateTab={handleSelectTab}
              />
            )}
          </>
        )}
      </main>

      {/* Majid IA Assistant Modal */}
      <NexusChatModal
        isOpen={nexusOpen}
        onClose={() => setNexusOpen(false)}
      />

      {/* Floating Action Button */}
      <NexusFab onClick={() => setNexusOpen(true)} />

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Mobile Welcome & Install Modal */}
      <InstallAppModal />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
};

export function App() {
  return (
    <I18nProvider>
      <UserProfileProvider>
        <AppContent />
      </UserProfileProvider>
    </I18nProvider>
  );
}

export default App;
