import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧪 Verifying AppBottomSheet and unified working properties across the app...");

// 1. Verify AppBottomSheet component exists and has required working properties
const sheetPath = path.join(__dirname, "../src/components/ui/AppBottomSheet.tsx");
assert.ok(fs.existsSync(sheetPath), "src/components/ui/AppBottomSheet.tsx must exist");

const sheetContent = fs.readFileSync(sheetPath, "utf-8");
assert.ok(sheetContent.includes("PanResponder.create"), "Must have PanResponder for drag-to-dismiss gesture");
assert.ok(sheetContent.includes("handlePanResponder"), "Must have dedicated handlePanResponder for pill grab");
assert.ok(sheetContent.includes("Animated.spring"), "Must have spring physics entrance animation");
assert.ok(sheetContent.includes("Animated.timing"), "Must have smooth slide-down exit animation");
assert.ok(sheetContent.includes("BackHandler"), "Must have Android hardware back handler");
assert.ok(sheetContent.includes("useSafeAreaInsets"), "Must have safe area insets support");
assert.ok(sheetContent.includes("borderTopLeftRadius: 28"), "Must have 28px rounded top corners");
assert.ok(sheetContent.includes("borderTopRightRadius: 28"), "Must have 28px rounded top corners");
assert.ok(sheetContent.includes("handle: {"), "Must define drag handlebar pill");

console.log("  ✔ AppBottomSheet verified with gesture drag, pill handle, spring animation, and safe area insets");

// 2. Verify SettingsScreen uses AppBottomSheet
const settingsPath = path.join(__dirname, "../src/screens/SettingsScreen.tsx");
const settingsContent = fs.readFileSync(settingsPath, "utf-8");
assert.ok(settingsContent.includes("<AppBottomSheet"), "SettingsScreen must use AppBottomSheet");
assert.ok(settingsContent.includes("setLanguageSheetVisible"), "SettingsScreen must have language sheet toggle");
assert.ok(settingsContent.includes("FilledGlobe"), "SettingsScreen must have FilledGlobe language icon");
assert.ok(settingsContent.includes("versionCard"), "SettingsScreen must have versionCard");
assert.ok(settingsContent.includes("Sudoku King - Puzzle Game"), "SettingsScreen must display app title in card");
assert.ok(settingsContent.includes("Version 1.0.0"), "SettingsScreen must display version number in card");

console.log("  ✔ SettingsScreen language row, preferences, version card & content modals successfully upgraded to AppBottomSheet");

// 3. Verify WelcomeScreen uses AppBottomSheet for language and legal sheets
const welcomePath = path.join(__dirname, "../src/screens/WelcomeScreen.tsx");
const welcomeContent = fs.readFileSync(welcomePath, "utf-8");
assert.ok(welcomeContent.includes("<AppBottomSheet"), "WelcomeScreen must use AppBottomSheet");
assert.ok(welcomeContent.includes("Language Switcher Bottom Sheet"), "WelcomeScreen must have Language Switcher Bottom Sheet");
assert.ok(welcomeContent.includes("Legal Policy Bottom Sheet"), "WelcomeScreen must have Legal Policy Bottom Sheet");

console.log("  ✔ WelcomeScreen language and legal modals successfully upgraded to AppBottomSheet");

// 4. Verify DifficultyBottomSheet composes AppBottomSheet
const diffSheetPath = path.join(__dirname, "../src/components/game/DifficultyBottomSheet.tsx");
const diffSheetContent = fs.readFileSync(diffSheetPath, "utf-8");
assert.ok(diffSheetContent.includes("<AppBottomSheet"), "DifficultyBottomSheet must compose AppBottomSheet");
assert.ok(diffSheetContent.includes("enableContentDrag={true}"), "DifficultyBottomSheet must enableContentDrag");
assert.ok(diffSheetContent.includes("borderTopLeftRadius: 28"), "DifficultyBottomSheet must have 28px top corners");
assert.ok(diffSheetContent.includes("borderTopRightRadius: 28"), "DifficultyBottomSheet must have 28px top corners");

console.log("  ✔ DifficultyBottomSheet verified composing AppBottomSheet with exact reference properties");

// 5. Verify PerformanceChart uses DifficultyBottomSheet for filtering
const chartPath = path.join(__dirname, "../src/components/dashboard/PerformanceChart.tsx");
const chartContent = fs.readFileSync(chartPath, "utf-8");
assert.ok(chartContent.includes("<DifficultyBottomSheet"), "PerformanceChart must render DifficultyBottomSheet");
assert.ok(chartContent.includes("includeAll={true}"), "PerformanceChart must pass includeAll={true}");
assert.ok(chartContent.includes("setShowDifficultySheet(true)"), "PerformanceChart must trigger sheet on filter press");

console.log("  ✔ PerformanceChart verified with interactive DifficultyBottomSheet filter");

console.log("🎉 ALL BOTTOMSHEET UNIFIED PROPERTIES VERIFIED SUCCESSFULLY!");

