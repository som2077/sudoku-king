import assert from "node:assert";
import fs from "node:fs";

const purchaseService = fs.readFileSync("src/services/purchaseService.ts", "utf8");
const paywall = fs.readFileSync("src/components/ui/Paywall.tsx", "utf8");
const app = fs.readFileSync("App.tsx", "utf8");
const notifications = fs.readFileSync("src/services/notificationService.ts", "utf8");

assert.ok(
  purchaseService.includes("active[ENTITLEMENT_ID] || active[FALLBACK_ENTITLEMENT_ID]"),
  "Premium access must require an approved RevenueCat entitlement",
);
assert.ok(
  !purchaseService.includes("allPurchasedProductIdentifiers"),
  "Purchased product IDs must not be treated as a blanket premium entitlement",
);
assert.ok(
  purchaseService.includes("setPremium(checkTrialStatus())"),
  "Unverified persisted premium state must fail closed",
);
assert.ok(
  !paywall.includes("useGameStore.getState().setPremium(true)"),
  "Paywall must not unlock premium when offerings are unavailable",
);
assert.ok(
  app.includes("purchaseService.hasActiveEntitlement(customerInfo)"),
  "RevenueCat UI callbacks must verify customer entitlements",
);
assert.ok(
  !notifications.includes("[FCM DEVICE TOKEN]:"),
  "FCM device tokens must never be written to logs",
);
assert.ok(
  !notifications.includes('console.log("📩 [FCM] Foreground notification received:", remoteMessage)'),
  "Full notification payloads must not be written to logs",
);

console.log("✅ Security regression checks passed!");
