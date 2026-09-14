const fs = require('fs');
const path = require('path');
const { newTranslations } = require('./update-translations');

const translationsPath = path.join(__dirname, '../src/i18n/translations.ts');
let content = fs.readFileSync(translationsPath, 'utf8');

// 1. Add missing keys to interface Translations before line "}\n\nexport type TranslationKey"
const interfaceAdditions = `  'welcome.termsNoticePre'?: string;
  'welcome.termsNoticeMid'?: string;
  'onboarding.startPlaying'?: string;
  'onboarding.s0Title'?: string;
  'onboarding.s0Subtitle'?: string;
  'onboarding.s0StartingDiff'?: string;
  'onboarding.s0Beginner'?: string;
  'onboarding.s0BeginnerSub'?: string;
  'onboarding.s0Casual'?: string;
  'onboarding.s0CasualSub'?: string;
  'onboarding.s0Expert'?: string;
  'onboarding.s0ExpertSub'?: string;
  'onboarding.s1MinPerDay'?: string;
  'onboarding.s2GoalTitle'?: string;
  'onboarding.s2GoalSubtitle'?: string;
  'onboarding.goalFocusTitle'?: string;
  'onboarding.goalFocusDesc'?: string;
  'onboarding.goalRelaxTitle'?: string;
  'onboarding.goalRelaxDesc'?: string;
  'onboarding.goalStreakTitle'?: string;
  'onboarding.goalStreakDesc'?: string;
  'onboarding.goalMasterTitle'?: string;
  'onboarding.goalMasterDesc'?: string;
  'onboarding.s3ReminderTitle'?: string;
  'onboarding.s3ReminderSubtitle'?: string;
  'onboarding.remindMorning'?: string;
  'onboarding.remindMorningSub'?: string;
  'onboarding.remindAfternoon'?: string;
  'onboarding.remindAfternoonSub'?: string;
  'onboarding.remindEvening'?: string;
  'onboarding.remindEveningSub'?: string;
  'onboarding.remindNone'?: string;
  'onboarding.remindNoneSub'?: string;
  'onboarding.s4SummaryTitle'?: string;
  'onboarding.s4SummarySubtitle'?: string;
  'game.youWin'?: string;
  'game.dailySolved'?: string;
  'game.gameOver'?: string;
  'game.winSubtitle'?: string;
  'game.lossSubtitle'?: string;
  'game.backToHome'?: string;
  'game.secondChance'?: string;
`;

content = content.replace("  'welcome.restoring'?: string;\n}", `  'welcome.restoring'?: string;\n${interfaceAdditions}}`);

// 2. Add keys to each language
for (const [langCode, keys] of Object.entries(newTranslations)) {
  const langHeader = `'${langCode}': {`;
  const langIndex = content.indexOf(langHeader);
  if (langIndex === -1) {
    console.error(`Language ${langCode} not found!`);
    continue;
  }

  // Find closing '  },' for this language
  let nextSearch = content.indexOf('\n  },', langIndex);
  if (nextSearch === -1) {
    console.error(`Closing brace for ${langCode} not found!`);
    continue;
  }

  const additions = [];
  for (const [k, v] of Object.entries(keys)) {
    const escapedVal = v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    const blockContent = content.substring(langIndex, nextSearch);
    if (blockContent.includes(`'${k}':`)) {
      const regex = new RegExp(`'${k.replace(/\./g, '\\.')}':\\s*('[^']*'|"[^"]*"),?`, 'g');
      content = content.substring(0, langIndex) + blockContent.replace(regex, `'${k}': '${escapedVal}',`) + content.substring(nextSearch);
      nextSearch = content.indexOf('\n  },', langIndex);
    } else {
      additions.push(`    '${k}': '${escapedVal}',`);
    }
  }

  if (additions.length > 0) {
    const insertPos = nextSearch;
    content = content.substring(0, insertPos) + '\n' + additions.join('\n') + content.substring(insertPos);
  }
}

fs.writeFileSync(translationsPath, content, 'utf8');
console.log('✅ Successfully updated translations.ts for all 20 languages!');
