import Purchases, {
  PurchasesPackage,
  PurchasesOffering,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { getRevenueCatApiKey, getRevenueCatTestKey } from '../utils/secrets';
import { useGameStore } from '../store/useGameStore';

export const ENTITLEMENT_ID = 'suduko_king_unlimited';
export const FALLBACK_ENTITLEMENT_ID = 'Premium';

class PurchaseService {
  private isInitialized = false;
  private currentOffering: PurchasesOffering | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (__DEV__) {
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      } else {
        await Purchases.setLogLevel(LOG_LEVEL.INFO);
      }

      const apiKey = __DEV__ ? getRevenueCatTestKey() : getRevenueCatApiKey(Platform.OS);
      console.log('💳 [RevenueCat] Initializing SDK with key type:', __DEV__ ? 'Test Store' : 'Google Play');

      await Purchases.configure({ apiKey });
      this.isInitialized = true;
      console.log('💳 [RevenueCat] Initialized successfully');

      Purchases.addCustomerInfoUpdateListener((info) => {
        this.handleCustomerInfoUpdate(info);
      });

      await this.checkSubscriptionStatus();
      await this.fetchOfferings();
    } catch (error: any) {
      console.log('ℹ️ [RevenueCat] Initialization note:', error?.message || error);
      try {
        const fallbackKey = getRevenueCatTestKey();
        if (fallbackKey) {
          console.log('💳 [RevenueCat] Retrying with test store key...');
          await Purchases.configure({ apiKey: fallbackKey });
          this.isInitialized = true;
          await this.checkSubscriptionStatus();
          await this.fetchOfferings();
        }
      } catch (fallbackErr) {
        console.log('ℹ️ [RevenueCat] Fallback key note:', fallbackErr);
      }
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    const { checkTrialStatus, setPremium } = useGameStore.getState();
    const trialActive = checkTrialStatus();

    if (!this.isInitialized) {
      if (trialActive) setPremium(true);
      return trialActive;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasEntitlement = this.hasActiveEntitlement(customerInfo);

      if (hasEntitlement) {
        setPremium(true);
        return true;
      } else {
        setPremium(trialActive);
        return trialActive;
      }
    } catch (err) {
      console.warn('⚠️ [RevenueCat] Failed to fetch customer info:', err);
      return trialActive;
    }
  }

  private hasActiveEntitlement(customerInfo: CustomerInfo): boolean {
    const active = customerInfo?.entitlements?.active || {};
    if (
      typeof active[ENTITLEMENT_ID] !== 'undefined' ||
      typeof active[FALLBACK_ENTITLEMENT_ID] !== 'undefined'
    ) {
      return true;
    }
    if (Object.keys(active).length > 0) {
      return true;
    }
    const purchasedProducts = customerInfo?.allPurchasedProductIdentifiers || [];
    if (purchasedProducts.length > 0) {
      return true;
    }
    return false;
  }

  private handleCustomerInfoUpdate(customerInfo: CustomerInfo) {
    const { setPremium, checkTrialStatus } = useGameStore.getState();
    const hasEntitlement = this.hasActiveEntitlement(customerInfo);
    const trialActive = checkTrialStatus();

    console.log('💳 [RevenueCat] Customer info updated. Has entitlement:', hasEntitlement, 'Trial active:', trialActive);
    setPremium(hasEntitlement || trialActive);
  }

  async fetchOfferings(): Promise<PurchasesOffering | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        this.currentOffering = offerings.current;
        console.log('💳 [RevenueCat] Offerings loaded:', offerings.current.identifier);
        return offerings.current;
      }
      return null;
    } catch (error) {
      console.log('ℹ️ [RevenueCat] Note fetching offerings:', error);
      return null;
    }
  }

  getCurrentOffering(): PurchasesOffering | null {
    return this.currentOffering;
  }

  async purchasePackage(pkg: PurchasesPackage): Promise<{ success: boolean; userCancelled?: boolean; error?: string }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isSubscribed = this.hasActiveEntitlement(customerInfo);
      
      if (isSubscribed) {
        useGameStore.getState().setPremium(true);
        console.log('🎉 [RevenueCat] Purchase successful!');
        return { success: true };
      }
      return { success: false, error: 'Entitlement not unlocked' };
    } catch (error: any) {
      if (error.userCancelled) {
        console.log('ℹ️ [RevenueCat] User cancelled purchase');
        return { success: false, userCancelled: true };
      }
      console.error('❌ [RevenueCat] Purchase failed:', error);
      return { success: false, error: error.message || 'Purchase failed' };
    }
  }

  async restorePurchases(): Promise<{ success: boolean; restored: boolean; error?: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isSubscribed = this.hasActiveEntitlement(customerInfo);
      const { setPremium, checkTrialStatus } = useGameStore.getState();

      if (isSubscribed) {
        setPremium(true);
        return { success: true, restored: true };
      } else {
        const trialActive = checkTrialStatus();
        setPremium(trialActive);
        return { success: true, restored: false };
      }
    } catch (error: any) {
      console.error('❌ [RevenueCat] Restore failed:', error);
      return { success: false, restored: false, error: error.message || 'Restore failed' };
    }
  }

  activateFreeTrial(): void {
    useGameStore.getState().activateThreeDayTrial();
  }

  isVip(): boolean {
    const state = useGameStore.getState();
    const trialActive = state.trialEndsAt !== null && state.trialEndsAt > Date.now();
    return Boolean(state.isPremium || trialActive);
  }
}

export const purchaseService = new PurchaseService();
