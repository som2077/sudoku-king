"use client";

import { useState } from "react";
import {
  getPlayerProfile,
  savePlayerProfile,
  PlayerProfile,
  COUNTRIES,
} from "@/lib/leaderboardService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Check } from "lucide-react";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: PlayerProfile) => void;
}

export function PlayerProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: PlayerProfileModalProps) {
  const [profile, setProfile] = useState<PlayerProfile>(() => getPlayerProfile());
  const [name, setName] = useState<string>(profile.username);
  const [selectedCountry, setSelectedCountry] = useState<string>(profile.countryCode);

  const handleSave = () => {
    const trimmed = name.trim() || profile.username;
    const country = COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];
    const updated: PlayerProfile = {
      username: trimmed,
      countryCode: country.code,
      countryName: country.name,
      avatarSeed: trimmed,
    };
    savePlayerProfile(updated);
    setProfile(updated);
    onProfileUpdated?.(updated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <User className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-extrabold text-slate-950 tracking-tight">Player Profile</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            Customize your display handle and country flag for the Daily Challenge Global Consensus Leaderboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 tracking-tight">
              Display Handle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. MasterSolver_99"
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-black/[0.08] text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
            />
          </div>

          {/* Country Flag Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 tracking-tight">
              Country Affiliation
            </label>
            <div
              role="listbox"
              aria-label="Select Country"
              className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1"
            >
              {COUNTRIES.map((c) => {
                const isSelected = c.code === selectedCountry;
                return (
                  <button
                    key={c.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-label={`Select ${c.name}`}
                    onClick={() => setSelectedCountry(c.code)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer apple-press-subtle ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/80 text-blue-700 font-bold shadow-2xs"
                        : "border-black/[0.06] bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="tracking-tight">{c.name}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-black/[0.06]">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs rounded-full border-black/[0.08] text-slate-700 hover:bg-slate-50 apple-press cursor-pointer">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-full px-4 h-9 shadow-xs apple-press cursor-pointer border border-white/10"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
