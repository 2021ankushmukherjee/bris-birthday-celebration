"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { birthday } from "@/config/birthday";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };
const zero: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function nextBirthday(): Date {
  const [month = "11", day = "19"] = birthday.date.split("-");
  const now = new Date();
  let date = new Date(now.getFullYear(), Number(month) - 1, Number(day), 0, 0, 0);
  // On the birthday itself, celebrate rather than beginning next year's countdown.
  if (now.getMonth() === Number(month) - 1 && now.getDate() === Number(day)) return now;
  if (date.getTime() <= now.getTime()) date = new Date(now.getFullYear() + 1, Number(month) - 1, Number(day), 0, 0, 0);
  return date;
}
function remaining(target: Date): Remaining {
  const milliseconds = Math.max(0, target.getTime() - Date.now());
  return { days: Math.floor(milliseconds / 86400000), hours: Math.floor(milliseconds / 3600000) % 24, minutes: Math.floor(milliseconds / 60000) % 60, seconds: Math.floor(milliseconds / 1000) % 60 };
}

export default function Countdown({ onEnter }: { onEnter: () => void }) {
  const [time, setTime] = useState<Remaining>(zero);
  useEffect(() => {
    const target = nextBirthday();
    const update = () => {
      const value = remaining(target);
      setTime(value);
      if (value.days === 0 && value.hours === 0 && value.minutes === 0 && value.seconds === 0) onEnter();
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [onEnter]);
  return <motion.section className="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="stars" /><p className="eyebrow">A birthday worth celebrating is getting closer</p><h1>Counting down to<br />{birthday.name}&apos;s day</h1><p className="countdown-date">The big day · in your local time</p><div className="time-grid" aria-label="Birthday countdown">{(["days", "hours", "minutes", "seconds"] as const).map((unit) => <div key={unit}><strong>{String(time[unit]).padStart(2, "0")}</strong><span>{unit}</span></div>)}</div><p className="countdown-note"><Sparkles /> A celebration for an amazing friend is waiting.</p></motion.section>;
}
