import assert from "node:assert";
import { APP_LINKS } from "../src/constants/links.ts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧪 Testing APP_LINKS configuration & SettingsScreen wiring...");

// 1. Check APP_LINKS constants
assert.strictEqual(
  APP_LINKS.TERMS_URL,
  "https://sudokuking.imperialtech.me/terms",
  "TERMS_URL must match canonical website route"
);
assert.strictEqual(
  APP_LINKS.PRIVACY_URL,
  "https://sudokuking.imperialtech.me/privacy",
  "PRIVACY_URL must match canonical website route"
);
assert.strictEqual(
  APP_LINKS.RULES_URL,
  "https://sudokuking.imperialtech.me/rules",
  "RULES_URL must match canonical website route"
);

console.log("  ✔ APP_LINKS.TERMS_URL and PRIVACY_URL are properly configured");

// 2. Check website routes exist
const termsPagePath = path.join(__dirname, "../website/src/app/terms/page.tsx");
const privacyPagePath = path.join(__dirname, "../website/src/app/privacy/page.tsx");

assert.ok(fs.existsSync(termsPagePath), "website/src/app/terms/page.tsx must exist");
assert.ok(fs.existsSync(privacyPagePath), "website/src/app/privacy/page.tsx must exist");

const termsContent = fs.readFileSync(termsPagePath, "utf-8");
assert.ok(termsContent.includes("Terms & Conditions"), "Terms page must contain title");
assert.ok(termsContent.includes("RevenueCat"), "Terms must disclose RevenueCat / store billing");
assert.ok(termsContent.includes("Google AdMob"), "Terms must disclose Google AdMob ads");

const privacyContent = fs.readFileSync(privacyPagePath, "utf-8");
assert.ok(privacyContent.includes("Privacy Policy"), "Privacy page must contain title");
assert.ok(privacyContent.includes("MMKV"), "Privacy page must disclose local MMKV storage");
assert.ok(privacyContent.includes("Google AdMob"), "Privacy page must disclose Google AdMob");
assert.ok(privacyContent.includes("GDPR"), "Privacy page must detail GDPR rights");

console.log("  ✔ Next.js /terms and /privacy routes are complete and comprehensive");

// 3. Check SettingsScreen wiring
const settingsScreenPath = path.join(__dirname, "../src/screens/SettingsScreen.tsx");
const settingsContent = fs.readFileSync(settingsScreenPath, "utf-8");

assert.ok(settingsContent.includes("handleOpenTerms"), "SettingsScreen must have handleOpenTerms");
assert.ok(settingsContent.includes("handleOpenPrivacy"), "SettingsScreen must have handleOpenPrivacy");
assert.ok(settingsContent.includes("APP_LINKS.TERMS_URL"), "SettingsScreen must use APP_LINKS.TERMS_URL");
assert.ok(settingsContent.includes("APP_LINKS.PRIVACY_URL"), "SettingsScreen must use APP_LINKS.PRIVACY_URL");
assert.ok(settingsContent.includes("Linking.openURL"), "SettingsScreen must call Linking.openURL");
assert.ok(settingsContent.includes("ExternalLink"), "SettingsScreen must show ExternalLink icon");

console.log("  ✔ SettingsScreen redirect and ExternalLink wiring verified!");

console.log("🎉 All Legal Links & Redirection tests passed!");
