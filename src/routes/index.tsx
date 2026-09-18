import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Sparkles, Timer } from "lucide-react";

import campusAsset from "@/assets/jis-campus.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JIS Zakovat | Tasodifiy raqam barabani" },
      { name: "description", content: "JIS International School Zakovat bellashuvi uchun interaktiv, takrorlanmaydigan raqam tanlash barabani." },
      { property: "og:title", content: "JIS Zakovat raqam barabani" },
      { property: "og:description", content: "Zakovat bellashuvi uchun interaktiv raqam tanlash." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ZakovatDrum,
});

const PRESETS = [10, 20, 30, 50, 100];

function formatTime(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function ZakovatDrum() {
  const [count, setCount] = useState(30);
  const [history, setHistory] = useState<number[]>([]);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(60);
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused" | "done">("idle");
  const drawTimers = useRef<number[]>([]);
  const audioContext = useRef<AudioContext | null>(null);

  const allNumbers = useMemo(() => Array.from({ length: count }, (_, index) => index + 1), [count]);
  const available = useMemo(() => allNumbers.filter((value) => !history.includes(value)), [allNumbers, history]);
  const visibleBalls = useMemo(() => allNumbers.slice(0, 60), [allNumbers]);

  const getAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return null;
    const context = audioContext.current ?? new AudioContextClass();
    audioContext.current = context;
    if (context.state === "suspended") void context.resume();
    return context;
  }, []);

  const tone = useCallback((frequency: number, duration = 0.12, delay = 0) => {
    const context = getAudioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    const startsAt = context.currentTime + delay;
    gain.gain.setValueAtTime(0.16, startsAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startsAt + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(startsAt);
    oscillator.stop(startsAt + duration);
  }, [getAudioContext]);

  const playTimerAlarm = useCallback(() => {
    tone(880, 0.28, 0);
    tone(880, 0.28, 0.4);
    tone(1046, 0.55, 0.8);
  }, [tone]);

  useEffect(() => {
    if (timerState !== "running") return;
    const tick = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(tick);
          setTimerState("done");
          playTimerAlarm();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [playTimerAlarm, timerState]);

  useEffect(() => () => drawTimers.current.forEach(window.clearTimeout), []);

  const resetPool = () => {
    drawTimers.current.forEach(window.clearTimeout);
    drawTimers.current = [];
    setHistory([]);
    setDisplayNumber(null);
    setHasResult(false);
    setIsSpinning(false);
  };

  const changeCount = (value: number) => {
    const safe = Math.min(200, Math.max(2, value || 2));
    setCount(safe);
    setHistory([]);
    setDisplayNumber(null);
    setHasResult(false);
  };

  const spin = () => {
    if (isSpinning || available.length === 0) return;
    setIsSpinning(true);
    setHasResult(false);
    const winner = available[Math.floor(Math.random() * available.length)];
    if (winner === undefined) {
      setIsSpinning(false);
      return;
    }
    const steps = 24;
    let elapsed = 0;
    drawTimers.current = [];
    for (let step = 0; step < steps; step += 1) {
      const delay = 50 + Math.pow(step / steps, 3) * 220;
      elapsed += delay;
      const id = window.setTimeout(() => {
        const candidate = available[Math.floor(Math.random() * available.length)] ?? winner;
        setDisplayNumber(step === steps - 1 ? winner : candidate);
        if (step === steps - 1) {
          setHistory((items) => [winner, ...items]);
          setIsSpinning(false);
          setHasResult(true);
        }
      }, elapsed);
      drawTimers.current.push(id);
    }
  };

  const setTimer = () => {
    const value = Math.max(0, minutes * 60 + seconds);
    setRemaining(value);
    setTimerState("idle");
  };

  const resetTimer = () => {
    setRemaining(Math.max(0, minutes * 60 + seconds));
    setTimerState("idle");
  };

  const toggleTimer = () => {
    if (timerState !== "running") getAudioContext();
    setTimerState(timerState === "running" ? "paused" : "running");
  };

  const timerButtonLabel = timerState === "paused" ? "Davom etish" : timerState === "running" ? "Pauza" : "Start";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img src={campusAsset.url} alt="JIS maktabi kirish binosi" width={881} height={495} className="fixed inset-0 size-full object-cover scale-105 blur-[4px]" />
      <div className="campus-overlay fixed inset-0" />
      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1400px] items-center gap-5 px-4 py-5 md:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] sm:px-7 lg:gap-8 lg:px-10">
          <section className="flex min-w-0 flex-col items-center">
            <div className="relative aspect-square w-full max-w-[min(72vh,720px)]">
              <div className="absolute inset-[3%] rounded-full border border-glass-border bg-glass shadow-[inset_0_0_70px_oklch(0.91_0.12_82/10%),0_30px_80px_oklch(0.06_0.03_20/60%)] backdrop-blur-md">
                <div className="absolute inset-[2.5%] rounded-full border border-secondary/40" />
                <div className={`absolute inset-[7%] ${isSpinning ? "drum-orbit-fast" : "drum-orbit"}`}>
                  {visibleBalls.map((number, index) => {
                    const angle = (index / visibleBalls.length) * Math.PI * 2 + (index % 4) * 0.08;
                    const radius = 39 - (index % 5) * 6.2;
                    const left = (50 + Math.cos(angle) * radius).toFixed(3);
                    const top = (50 + Math.sin(angle) * radius).toFixed(3);
                    const used = history.includes(number);
                    return (
                      <span key={number} className={`absolute flex size-7 items-center justify-center rounded-full border text-[10px] font-extrabold shadow-lg sm:size-8 sm:text-xs ${isSpinning ? "counter-orbit-fast" : "counter-orbit"} ${used ? "border-glass-border bg-glass text-muted-foreground opacity-25" : "border-secondary/60 bg-foreground text-primary"}`} style={{ left: `${left}%`, top: `${top}%` }}>{number}</span>
                    );
                  })}
                </div>
                <div className={`absolute left-1/2 top-1/2 flex size-[34%] min-h-28 min-w-28 items-center justify-center rounded-full border-2 border-secondary bg-[radial-gradient(circle_at_35%_28%,var(--gold-soft),var(--secondary)_38%,var(--primary)_100%)] shadow-[0_0_55px_var(--danger-glow),inset_0_2px_5px_oklch(1_0_0/45%)] ${isSpinning ? "center-spin" : hasResult ? "result-pop" : "-translate-x-1/2 -translate-y-1/2"}`}>
                  <span aria-live="polite" className="text-[clamp(3rem,8vw,6.8rem)] font-black tabular-nums text-primary-foreground drop-shadow-lg">{displayNumber ?? "?"}</span>
                </div>
              </div>
            </div>
            <div className="min-h-12 text-center">
              {hasResult && <p className="animate-fade-in text-xl font-bold text-gold-soft sm:text-2xl">Omad yor bo’lsin</p>}
            </div>
            <Button type="button" variant="draw" size="projector" onClick={spin} disabled={isSpinning || available.length === 0} className="w-full max-w-sm sm:w-auto">
              <Sparkles className="size-5" />{isSpinning ? "Aylanmoqda…" : "Aylantirish"}
            </Button>
          </section>

          <aside className="grid gap-5 self-center">
            <section className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 text-secondary">
              <Sparkles className="size-5" />
              <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Baraban</h2>
            </div>
            <label htmlFor="number-count" className="mt-6 block text-sm font-medium text-muted-foreground">Raqamlar soni</label>
            <Input id="number-count" type="number" min={2} max={200} value={count} disabled={isSpinning} onChange={(event) => changeCount(Number(event.target.value))} className="mt-2 h-14 border-glass-border bg-glass-strong text-center text-xl font-bold" />
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {PRESETS.map((value) => <Button key={value} type="button" variant={count === value ? "secondary" : "glass"} size="sm" disabled={isSpinning} onClick={() => changeCount(value)} className="px-1">{value}</Button>)}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-glass-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Qolgan raqamlar</span>
                <strong className="text-xl text-secondary">{available.length}</strong>
              </div>
              <Button type="button" variant="glass" size="icon" onClick={resetPool} disabled={history.length === 0 && !isSpinning} aria-label="Raqamlarni qayta boshlash"><RotateCcw /></Button>
            </div>
            </section>

            <section className="glass-panel rounded-2xl p-5">
              <div className="flex items-center gap-2 text-secondary"><Timer className="size-5" /><h2 className="text-sm font-bold uppercase tracking-[0.16em]">Vaqt</h2></div>
              <div className={`my-5 text-center text-[clamp(3.25rem,6vw,5.4rem)] font-extrabold leading-none tabular-nums ${timerState === "done" ? "text-secondary" : "text-foreground"}`}>{formatTime(remaining)}</div>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-muted-foreground">Daqiqa<Input type="number" min={0} max={99} value={minutes} disabled={timerState === "running"} onChange={(event) => setMinutes(Math.max(0, Number(event.target.value)))} onBlur={setTimer} className="mt-1 h-11 bg-glass-strong text-center text-foreground" /></label>
                <label className="text-xs text-muted-foreground">Soniya<Input type="number" min={0} max={59} value={seconds} disabled={timerState === "running"} onChange={(event) => setSeconds(Math.min(59, Math.max(0, Number(event.target.value))))} onBlur={setTimer} className="mt-1 h-11 bg-glass-strong text-center text-foreground" /></label>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <Button type="button" variant={timerState === "running" ? "glass" : "secondary"} className="h-11" disabled={remaining === 0} onClick={toggleTimer}>
                  {timerState === "running" ? <Pause /> : <Play />}{timerButtonLabel}
                </Button>
                <Button type="button" variant="glass" size="icon" className="size-11" onClick={resetTimer} aria-label="Taymerni qayta o‘rnatish"><RotateCcw /></Button>
              </div>
            </section>
          </aside>
      </main>
    </div>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}