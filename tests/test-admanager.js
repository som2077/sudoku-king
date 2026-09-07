// Automated tests for AdMob configuration and Ad Unit ID decoding

async function run() {
  const {
    getBannerAdUnitId,
    getRewardedAdUnitId,
    getInterstitialAdUnitId,
  } = await import('../src/utils/secrets.ts');

  console.log('Verifying AdMob Obfuscated Unit IDs...');
  const bannerId = getBannerAdUnitId();
  const rewardedId = getRewardedAdUnitId();
  const interstitialId = getInterstitialAdUnitId();

  if (!bannerId.startsWith('ca-app-pub-') || bannerId.length < 20) {
    throw new Error(`Invalid Banner ID: ${bannerId}`);
  }
  if (!rewardedId.startsWith('ca-app-pub-') || rewardedId.length < 20) {
    throw new Error(`Invalid Rewarded ID: ${rewardedId}`);
  }
  if (!interstitialId.startsWith('ca-app-pub-') || interstitialId.length < 20) {
    throw new Error(`Invalid Interstitial ID: ${interstitialId}`);
  }

  console.log('✅ Decoded Production Unit IDs:');
  console.log(`   Banner: ${bannerId}`);
  console.log(`   Rewarded: ${rewardedId}`);
  console.log(`   Interstitial: ${interstitialId}`);

  console.log('✅ All AdMob Secret and Configuration tests passed!');
}

run().catch((err) => {
  console.error('❌ AdMob Test Failed:', err);
  process.exit(1);
});
