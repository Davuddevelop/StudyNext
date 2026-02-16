import { Capacitor } from '@capacitor/core';
import { userService } from './userService';

const ENTITLEMENT_ID = 'StudyNext Pro';

// We'll use dynamic imports for native-only plugins to prevent web crashes
let Purchases = null;
let LOG_LEVEL = null;
let PurchasesPaywall = null;

const loadNativePlugins = async () => {
    if (!Capacitor.isNativePlatform()) return false;

    try {
        if (!Purchases) {
            const mod = await import('@revenuecat/purchases-capacitor');
            Purchases = mod.Purchases;
            LOG_LEVEL = mod.LOG_LEVEL;
        }
        if (!PurchasesPaywall) {
            const mod = await import('@revenuecat/purchases-capacitor-ui');
            PurchasesPaywall = mod.PurchasesPaywall;
        }
        return true;
    } catch (e) {
        console.error("Failed to load native RevenueCat plugins:", e);
        return false;
    }
};

export const iapService = {
    /**
     * Initialize RevenueCat SDK
     */
    initialize: async (uid) => {
        const platform = Capacitor.getPlatform();
        if (platform === 'web') return;

        const ready = await loadNativePlugins();
        if (!ready) return;

        try {
            await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

            if (platform === 'ios') {
                await Purchases.configure({
                    apiKey: "test_eIrvzymFssZKuQpNvZuEFkglBRv",
                    appUserId: uid
                });
            } else if (platform === 'android') {
                await Purchases.configure({
                    apiKey: "test_eIrvzymFssZKuQpNvZuEFkglBRv",
                    appUserId: uid
                });
            }
            console.log(`RevenueCat initialized for ${platform}`);
        } catch (error) {
            console.error('RevenueCat initialization failed:', error);
        }
    },

    /**
     * Check if user has active entitlement
     */
    checkEntitlement: async () => {
        const ready = await loadNativePlugins();
        if (!ready) return false;

        try {
            const customerInfo = await Purchases.getCustomerInfo();
            return customerInfo.activeEntitlements.includes(ENTITLEMENT_ID);
        } catch (error) {
            console.error('Error checking entitlement:', error);
            return false;
        }
    },

    /**
     * Sync IAP status with your backend (Firebase)
     */
    syncStatusWithBackend: async (uid) => {
        if (!Capacitor.isNativePlatform()) return false;

        const isPro = await iapService.checkEntitlement();
        if (isPro) {
            await userService.updatePlan(uid, 'premium');
        }
        return isPro;
    },

    /**
     * Present RevenueCat Paywall
     */
    presentPaywall: async (uid) => {
        const ready = await loadNativePlugins();
        if (!ready) {
            console.log('Paywalls are only available on native platforms');
            return;
        }

        try {
            const result = await PurchasesPaywall.present();
            if (uid) {
                await iapService.syncStatusWithBackend(uid);
            }
            return result;
        } catch (error) {
            console.error('Error presenting paywall:', error);
        }
    },

    /**
     * Show RevenueCat Customer Center
     */
    presentCustomerCenter: async () => {
        const ready = await loadNativePlugins();
        if (!ready) return;

        try {
            await Purchases.presentCustomerCenter();
        } catch (error) {
            console.error('Error presenting customer center:', error);
        }
    },

    /**
     * Restore Purchases
     */
    restorePurchases: async (uid) => {
        const ready = await loadNativePlugins();
        if (!ready) return;

        try {
            const customerInfo = await Purchases.restorePurchases();
            if (uid) {
                await iapService.syncStatusWithBackend(uid);
            }
            return customerInfo;
        } catch (error) {
            console.error('Error restoring purchases:', error);
        }
    }
};
