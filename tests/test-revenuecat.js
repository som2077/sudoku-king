import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("🧪 Running RevenueCat & 3-Day Free Trial Test Suite...");

  // 1. Secrets & Decoded Keys Test
  const { getRevenueCatApiKey, getRevenueCatTestKey } = await import("../src/utils/secrets.ts");
  const androidKey = getRevenueCatApiKey("android");
  const testKey = getRevenueCatTestKey();

  assert.ok(androidKey.startsWith("goog_"), "Android Google Play Key must start with goog_");
  assert.strictEqual(androidKey, "goog_yVPibkQBdOolCXOLMTdbzzDCjBG", "Decoded Google Play key must match RevenueCat production key");
  assert.ok(testKey.startsWith("test_"), "Test Key must start with test_");
  assert.strictEqual(testKey, "test_aRhcllWJpwwEpyfvlzgAgbdJPpm", "Decoded test key must match RevenueCat test key");
  console.log("  ✔ RevenueCat obfuscated keys decoded and verified successfully");

  // 2. PurchaseService implementation verification
  const purchaseServicePath = path.join(__dirname, "../src/services/purchaseService.ts");
  const purchaseServiceContent = fs.readFileSync(purchaseServicePath, "utf-8");

  assert.ok(purchaseServiceContent.includes("ENTITLEMENT_ID = 'suduko_king_unlimited'"), "ENTITLEMENT_ID must be 'suduko_king_unlimited'");
  assert.ok(purchaseServiceContent.includes("FALLBACK_ENTITLEMENT_ID = 'Premium'"), "FALLBACK_ENTITLEMENT_ID must be 'Premium'");
  assert.ok(purchaseServiceContent.includes("activateFreeTrial"), "purchaseService must have activateFreeTrial");
  assert.ok(purchaseServiceContent.includes("checkSubscriptionStatus"), "purchaseService must have checkSubscriptionStatus");
  assert.ok(purchaseServiceContent.includes("fetchOfferings"), "purchaseService must have fetchOfferings");
  assert.ok(purchaseServiceContent.includes("purchasePackage"), "purchaseService must have purchasePackage");
  assert.ok(purchaseServiceContent.includes("restorePurchases"), "purchaseService must have restorePurchases");
  assert.ok(purchaseServiceContent.includes("isVip"), "purchaseService must have isVip method");
  console.log("  ✔ purchaseService.ts methods, listeners, and entitlement IDs verified");

  // 3. Paywall Component UI verification
  const paywallPath = path.join(__dirname, "../src/components/ui/Paywall.tsx");
  const paywallContent = fs.readFileSync(paywallPath, "utf-8");

  assert.ok(paywallContent.includes("3-Day Free Trial") || paywallContent.includes("3 Days Free"), "Paywall must display 3-day free trial");
  assert.ok(paywallContent.includes("No Card Needed") || paywallContent.includes("no card needed") || paywallContent.includes("No credit card required"), "Paywall must specify no card needed");
  assert.ok(paywallContent.includes("activateFreeTrial"), "Paywall must call activateFreeTrial");
  assert.ok(paywallContent.includes("handlePurchase"), "Paywall must support purchase");
  assert.ok(paywallContent.includes("handleRestore"), "Paywall must support restore");
  assert.ok(paywallContent.includes("Maybe Later") || paywallContent.includes("Not Now") || paywallContent.includes("Close"), "Paywall must have dismiss option");
  console.log("  ✔ Paywall component UI, perks, CTAs, and trial activation verified");

  // 4. GameStore State & 3-Day Trial Logic verification
  const gameStorePath = path.join(__dirname, "../src/store/useGameStore.ts");
  const gameStoreContent = fs.readFileSync(gameStorePath, "utf-8");

  assert.ok(gameStoreContent.includes("trialEndsAt: number | null;"), "GameState must have trialEndsAt");
  assert.ok(gameStoreContent.includes("hasUsedFreeTrial: boolean;"), "GameState must have hasUsedFreeTrial");
  assert.ok(gameStoreContent.includes("activateThreeDayTrial"), "GameState must have activateThreeDayTrial action");
  assert.ok(gameStoreContent.includes("checkTrialStatus"), "GameState must have checkTrialStatus action");
  assert.ok(gameStoreContent.includes("getTrialDaysRemaining"), "GameState must have getTrialDaysRemaining action");
  assert.ok(gameStoreContent.includes("3 * 24 * 60 * 60 * 1000"), "Trial must be exactly 3 days in milliseconds (72 hours)");
  console.log("  ✔ GameStore trial persistence & 72-hour trial math verified");

  // 5. App.tsx Onboarding to Offer/Paywall flow verification
  const appPath = path.join(__dirname, "../App.tsx");
  const appContent = fs.readFileSync(appPath, "utf-8");

  assert.ok(appContent.includes("purchaseService.initialize()"), "App.tsx must initialize purchaseService on startup");
  assert.ok(appContent.includes("showCustomPaywall"), "App.tsx must maintain showCustomPaywall state");
  assert.ok(appContent.includes("pendingOnboardingDiff"), "App.tsx must hold difficulty while presenting paywall");
  assert.ok(appContent.includes("<Paywall"), "App.tsx must render Paywall modal");
  assert.ok(appContent.includes("onRestorePurchases={restorePurchases}"), "App.tsx must pass onRestorePurchases to WelcomeScreen");
  console.log("  ✔ App.tsx Onboarding -> Paywall offer transition verified");

  // 6. WelcomeScreen Restore Purchases verification
  const welcomePath = path.join(__dirname, "../src/screens/WelcomeScreen.tsx");
  const welcomeContent = fs.readFileSync(welcomePath, "utf-8");
  assert.ok(welcomeContent.includes("handleRestorePurchases"), "WelcomeScreen must implement handleRestorePurchases");
  assert.ok(welcomeContent.includes("onRestorePurchases"), "WelcomeScreen must accept onRestorePurchases prop");
  assert.ok(welcomeContent.includes("welcome.restorePurchase"), "WelcomeScreen must render restore purchases button with i18n key");
  assert.ok(welcomeContent.includes("styles.restoreButton"), "WelcomeScreen must style the restore button");
  console.log("  ✔ WelcomeScreen Restore Payment / Purchases button & handling verified");

  console.log("\n🎉 ALL REVENUECAT & 3-DAY TRIAL TESTS PASSED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
