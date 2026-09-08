"use client";

import { NewGameModal } from "./NewGameModal";
import { SettingsModal } from "./SettingsModal";
import { StatsModal } from "./StatsModal";
import { GameOverModal } from "./GameOverModal";
import { VictoryModal } from "./VictoryModal";
import { DailyChallengeModal } from "./DailyChallengeModal";
import { HowToPlayModal } from "./HowToPlayModal";

export function ModalContainer() {
  return (
    <>
      <NewGameModal />
      <SettingsModal />
      <StatsModal />
      <GameOverModal />
      <VictoryModal />
      <DailyChallengeModal />
      <HowToPlayModal />
    </>
  );
}
