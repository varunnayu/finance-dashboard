import { useEffect, useState } from "react";

export const usePWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isSafariInstallable, setIsSafariInstallable] = useState(false);

    useEffect(() => {
        // Check if already installed / running in standalone mode
        const isStandalone = 
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;
        
        setIsInstalled(isStandalone);

        // Detect iOS and Safari browsers
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
        
        // Safari does not support the "beforeinstallprompt" event.
        // If the user is on Safari/iOS and NOT in standalone mode, show Safari custom helper.
        if ((isIOS || isSafari) && !isStandalone) {
            setIsSafariInstallable(true);
        }

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
            setIsSafariInstallable(false); // Browser prompt is supported here, so hide Safari fallback
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setIsSafariInstallable(false);
            setDeferredPrompt(null);
            console.log("[PWA] App was installed successfully!");
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        // Listen for display-mode changes
        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        const handleDisplayModeChange = (e) => {
            const standalone = e.matches;
            setIsInstalled(standalone);
            if (standalone) {
                setIsSafariInstallable(false);
                setIsInstallable(false);
            }
        };
        
        // Use modern listener or fallback for older browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleDisplayModeChange);
        } else {
            mediaQuery.addListener(handleDisplayModeChange);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
            
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleDisplayModeChange);
            } else {
                mediaQuery.removeListener(handleDisplayModeChange);
            }
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) {
            console.warn("[PWA] Install prompt is not available.");
            return false;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        try {
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[PWA] User response to the install prompt: ${outcome}`);
            
            if (outcome === "accepted") {
                setIsInstalled(true);
                setIsInstallable(false);
                setDeferredPrompt(null);
                return true;
            }
        } catch (err) {
            console.error("[PWA] Installation prompt dialog failed:", err);
        }
        return false;
    };

    return {
        isInstallable,
        isInstalled,
        isSafariInstallable,
        installApp,
    };
};
