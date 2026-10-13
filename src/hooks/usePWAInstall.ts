import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type DevicePlatform = 'ios' | 'android' | 'desktop';

export function openInstallModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-install-modal'));
  }
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [platform, setPlatform] = useState<DevicePlatform>('android');
  const [browserName, setBrowserName] = useState<string>('Navigateur');

  useEffect(() => {
    // 1. Detect standalone mode (already installed & running on home screen)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // 2. Detect platform & user agent details
    const ua = (window.navigator.userAgent || '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);
    const isMobileDevice = isIOSDevice || isAndroidDevice || /mobile|blackberry|iemobile|opera mini/i.test(ua);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);

    if (isIOSDevice) {
      setPlatform('ios');
    } else if (isAndroidDevice) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // 3. Detect browser
    const isSafariBrowser = /safari/.test(ua) && !/chrome|crios|android|fxios|edgios/i.test(ua);
    const isChromeBrowser = /chrome|crios/i.test(ua) && !/edg|opr\//i.test(ua);
    setIsSafari(isSafariBrowser);
    setIsChrome(isChromeBrowser);

    if (isIOSDevice && isSafariBrowser) {
      setBrowserName('Safari iOS');
    } else if (isChromeBrowser) {
      setBrowserName('Google Chrome');
    } else if (/edg/i.test(ua)) {
      setBrowserName('Microsoft Edge');
    } else if (/samsungbrowser/i.test(ua)) {
      setBrowserName('Samsung Internet');
    } else if (/firefox|fxios/i.test(ua)) {
      setBrowserName('Mozilla Firefox');
    } else if (isIOSDevice) {
      setBrowserName('Navigateur iOS');
    } else if (isAndroidDevice) {
      setBrowserName('Navigateur Android');
    } else {
      setBrowserName('Navigateur Web');
    }

    // 4. Capture native beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Erreur lors de l\'installation PWA:', err);
      return false;
    }
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isMobile,
    isSafari,
    isChrome,
    platform,
    browserName,
    install,
    openInstallModal,
  };
}

