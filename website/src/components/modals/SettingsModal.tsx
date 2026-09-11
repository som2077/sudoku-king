"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Settings, ShieldAlert, CheckCircle2, Eye, Volume2, Clock, Sparkles } from "lucide-react";

export function SettingsModal() {
  const { activeModal, settings, closeModal, updateSettings } = useSudokuStore();
  const isOpen = activeModal === "settings";

  const options = [
    {
      key: "autoCheckMistakes" as const,
      label: "Auto-Check for Mistakes",
      desc: "Instantly highlight invalid placements in red.",
      icon: ShieldAlert,
    },
    {
      key: "mistakesLimit" as const,
      label: "3 Mistakes Limit",
      desc: "Game over after 3 mistakes. Turn off for unlimited free play.",
      icon: CheckCircle2,
    },
    {
      key: "highlightDuplicates" as const,
      label: "Highlight Duplicates",
      desc: "Highlight conflicting numbers in the same row, column, or block.",
      icon: Eye,
    },
    {
      key: "highlightArea" as const,
      label: "Highlight Row, Column & Block",
      desc: "Gently shade the relevant row, column, and 3x3 block.",
      icon: Eye,
    },
    {
      key: "highlightSameNumbers" as const,
      label: "Highlight Identical Numbers",
      desc: "Highlight all matching numbers across the board on selection.",
      icon: Sparkles,
    },
    {
      key: "autoRemoveNotes" as const,
      label: "Auto-Remove Candidate Notes",
      desc: "Automatically remove digits from pencil notes when a number is placed.",
      icon: Sparkles,
    },
    {
      key: "soundEnabled" as const,
      label: "Sound Effects",
      desc: "Crisp synthesizer tones for moves, erases, and victories.",
      icon: Volume2,
    },
    {
      key: "timerVisible" as const,
      label: "Timer Display",
      desc: "Display game elapsed timer in the top header.",
      icon: Clock,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-slate-100 flex items-center justify-center shadow-2xs">
              <Settings className="h-4 w-4 text-slate-700" />
            </div>
            <DialogTitle className="text-lg font-extrabold text-slate-950 tracking-tight">Game Settings</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            Configure your gameplay preferences, visual aids, and Web Audio synthesizer settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col divide-y divide-slate-100 max-h-[60vh] overflow-y-auto pr-1">
          {options.map((opt) => {
            const Icon = opt.icon;
            const checked = settings[opt.key];

            return (
              <div
                key={opt.key}
                className="flex items-center justify-between py-3 gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug font-normal">
                      {opt.desc}
                    </div>
                  </div>
                </div>

                <Switch
                  checked={checked}
                  onCheckedChange={(val) => updateSettings({ [opt.key]: val })}
                />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
