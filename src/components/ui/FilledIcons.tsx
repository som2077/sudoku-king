import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Solid filled Bell icon (Notification)
 */
export function FilledBell({ size = 20, color = "#111827" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C10.9 2 10 2.9 10 4V4.3C7.03 5.2 5 7.9 5 11.2V16.5L3.3 18.2C2.9 18.6 3.2 19.3 3.7 19.3H20.3C20.8 19.3 21.1 18.6 20.7 18.2L19 16.5V11.2C19 7.9 17 5.2 14 4.3V4C14 2.9 13.1 2 12 2Z"
        fill={color}
      />
      <Path
        d="M10 20.5C10 21.6 10.9 22.5 12 22.5C13.1 22.5 14 21.6 14 20.5H10Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * Solid filled Graduation Cap icon (How to Play)
 */
export function FilledGraduationCap({ size = 20, color = "#111827" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L1 8.5L12 14L21 9.5V16H23V8.5L12 3Z"
        fill={color}
      />
      <Path
        d="M5 12.8V17C5 19.5 8.1 21.5 12 21.5C15.9 21.5 19 19.5 19 17V12.8L12 16.2L5 12.8Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * Solid filled Book Open icon (Rules)
 */
export function FilledBookOpen({ size = 20, color = "#111827" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5.5C10.5 4.5 8 4 4 4C2.9 4 2 4.9 2 6V18.5C2 19.3 2.7 20 3.5 20C7 20 9.5 20.5 11.5 21.8C11.8 22 12.2 22 12.5 21.8C14.5 20.5 17 20 20.5 20C21.3 20 22 19.3 22 18.5V6C22 4.9 21.1 4 20 4C16 4 13.5 4.5 12 5.5Z"
        fill={color}
      />
      <Path
        d="M12 6.5V20.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Solid filled Mail Envelope icon (Help & Support / Support Email)
 */
export function FilledMail({ size = 20, color = "#111827" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="3" fill={color} />
      <Path
        d="M3.5 6.5L12 12.5L20.5 6.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Solid filled File / Document icon with text lines (Terms and Conditions)
 */
export function FilledFileText({ size = 20, color = "#111827" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 3C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8.5L15.5 3H5Z"
        fill={color}
      />
      <Path
        d="M15 3V8.5H20.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        fill="none"
      />
      <Path
        d="M7 12H14M7 15.5H16M7 18.5H12"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Solid filled Shield icon (Privacy Policy)
 */
export function FilledShield({ size = 20, color = "#111827" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5V11.5C4 16.5 7.4 21.1 12 22.3C16.6 21.1 20 16.5 20 11.5V5L12 2Z"
        fill={color}
      />
      <Path
        d="M9 11.8L11.2 14L15.5 9.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
