import fs from 'fs';
import path from 'path';
import assert from 'assert';

async function run() {
  console.log('🧪 Verifying Haptics Engine and Onboarding Integration...');

  // 1. Verify src/utils/haptics.ts
  const hapticsPath = path.resolve('src/utils/haptics.ts');
  assert(fs.existsSync(hapticsPath), 'src/utils/haptics.ts must exist');

  const hapticsCode = fs.readFileSync(hapticsPath, 'utf8');
  assert(hapticsCode.includes('class HapticsEngine'), 'HapticsEngine class must be defined');
  assert(hapticsCode.includes('selection()'), 'selection() method must exist');
  assert(hapticsCode.includes('impactLight()'), 'impactLight() method must exist');
  assert(hapticsCode.includes('impactMedium()'), 'impactMedium() method must exist');
  assert(hapticsCode.includes('success()'), 'success() method must exist');
  assert(hapticsCode.includes('vibrationEnabled'), 'vibrationEnabled setting must be checked');
  assert(hapticsCode.includes('Vibration.vibrate'), 'Vibration.vibrate must be called safely');
  console.log('  ✔ Haptics utility verified with all impact & selection levels');

  // 2. Verify OnboardingScreen integration
  const onboardingPath = path.resolve('src/screens/OnboardingScreen.tsx');
  const onboardingCode = fs.readFileSync(onboardingPath, 'utf8');
  assert(onboardingCode.includes('import { haptics }'), 'OnboardingScreen must import haptics');
  assert(onboardingCode.includes('haptics.selection()'), 'OnboardingScreen must trigger haptics.selection');
  assert(onboardingCode.includes('haptics.impactMedium()'), 'OnboardingScreen must trigger haptics.impactMedium on Next');
  assert(onboardingCode.includes('haptics.impactLight()'), 'OnboardingScreen must trigger haptics.impactLight on Back');
  assert(onboardingCode.includes('haptics.success()'), 'OnboardingScreen must trigger haptics.success on complete');
  console.log('  ✔ OnboardingScreen wired with selection, step transitions, and success haptics');

  // 3. Verify WelcomeScreen integration
  const welcomePath = path.resolve('src/screens/WelcomeScreen.tsx');
  const welcomeCode = fs.readFileSync(welcomePath, 'utf8');
  assert(welcomeCode.includes('import { haptics }'), 'WelcomeScreen must import haptics');
  assert(welcomeCode.includes('haptics.impactMedium()'), 'WelcomeScreen must trigger haptics.impactMedium on Get Started');
  assert(welcomeCode.includes('haptics.selection()'), 'WelcomeScreen must trigger haptics.selection on language select');
  console.log('  ✔ WelcomeScreen wired with Get Started and language selection haptics');

  // 4. Verify board-cell integration
  const cellPath = path.resolve('src/components/game/Cell.tsx');
  const cellCode = fs.readFileSync(cellPath, 'utf8');
  assert(cellCode.includes('haptics.selection()'), 'Board cells must trigger selection haptics');
  console.log('  ✔ Sudoku board cells trigger selection haptics');

  console.log('🎉 All Haptics & Onboarding verification tests passed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
