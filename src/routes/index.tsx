import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { History, Pause, Play, RotateCcw, Sparkles, Timer, Volume2, VolumeX } from "lucide-react";

import campusAsset from "@/assets/jis-campus.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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

function JisMark() {
  return (
    <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-[26px] border border-glass-border bg-primary shadow-draw sm:size-28" aria-label="JIS emblemasi">
      <span className="absolute left-[13%] top-[17%] font-sans text-[3.4rem] font-black leading-none text-primary-foreground sm:text-[4rem]">J</span>
      <span className="absolute right-[12%] top-[17%] font-sans text-[3.4rem] font-black leading-none text-primary-foreground sm:text-[4rem]">S</span>
      <span className="absolute left-1/2 top-[12%] h-[76%] w-[18%] -translate-x-1/2 bg-secondary [clip-path:polygon(0_0,100%_0,100%_100%,50%_87%,0_100%)]" />
    </div>
  );
}

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
  const [soundOn, setSoundOn] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(60);
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused" | "done">("idle");
  const drawTimers = useRef<number[]>([]);
  const audioContext = useRef<AudioContext | null>(null);

  const allNumbers = useMemo(() => Array.from({ length: count }, (_, index) => index + 1), [count]);
  const available = useMemo(() => allNumbers.filter((value) => !history.includes(value)), [allNumbers, history]);
  const visibleBalls = useMemo(() => allNumbers.slice(0, 60), [allNumbers]);

  useEffect(() => {
    if (timerState !== "running") return;
    const tick = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(tick);
          setTimerState("done");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [timerState]);

  useEffect(() => () => drawTimers.current.forEach(window.clearTimeout), []);

  const tone = useCallback((frequency: number, duration = 0.08) => {
    if (!soundOn) return;
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = audioContext.current ?? new AudioContextClass();
    audioContext.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.06, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }, [soundOn]);

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
        if (step % 3 === 0) tone(360 + step * 10, 0.06);
        if (step === steps - 1) {
          setHistory((items) => [winner, ...items]);
          setIsSpinning(false);
          setHasResult(true);
          tone(760, 0.5);
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

  const timerButtonLabel = timerState === "paused" ? "Davom etish" : timerState === "running" ? "Pauza" : "Start";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img src={campusAsset.url} alt="JIS maktabi kirish binosi" width={881} height={495} className="fixed inset-0 size-full object-cover scale-105 blur-[4px]" />
      <div className="fixed inset-0 bg-[linear-gradient(115deg,oklch(0.16_0.08_22/92%),oklch(0.25_0.1_25/72%),oklch(0.1_0.035_22/88%))]" />
      {hasResult && Array.from({ length: 22 }, (_, index) => (
        <i key={index} className="pointer-events-none fixed top-0 z-40 h-4 w-1 rounded-full bg-secondary" style={{ left: `${6 + (index * 89) / 21}%`, animation: `confetti-fall ${1.8 + (index % 5) * 0.2}s ${index * 0.035}s ease-out both` }} />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1720px] flex-col px-4 py-5 sm:px-7 lg:px-10 lg:py-7">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <JisMark />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-soft">JIS taqdim etadi</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">ZAKOVAT</h1>
            </div>
          </div>
          <label className="glass-panel flex min-h-12 items-center gap-3 rounded-full px-4 text-sm font-semibold">
            {soundOn ? <Volume2 className="size-5 text-secondary" /> : <VolumeX className="size-5 text-muted-foreground" />}
            <span>Ovoz</span>
            <Switch checked={soundOn} onCheckedChange={setSoundOn} aria-label="Ovozni yoqish" />
          </label>
        </header>

        <div className="mt-5 grid flex-1 items-center gap-5 lg:grid-cols-[minmax(240px,0.72fr)_minmax(500px,1.7fr)_minmax(250px,0.78fr)] xl:gap-8">
          <aside className="glass-panel order-2 rounded-2xl p-5 lg:order-1">
            <div className="flex items-center gap-2 text-secondary">
              <Sparkles className="size-5" />
              <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Baraban</h2>
            </div>
            <label htmlFor="number-count" className="mt-6 block text-sm font-medium text-muted-foreground">Raqamlar soni</label>
            <Input id="number-count" type="number" min={2} max={200} value={count} disabled={isSpinning} onChange={(event) => changeCount(Number(event.target.value))} className="mt-2 h-14 border-glass-border bg-glass-strong text-center text-xl font-bold" />
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {PRESETS.map((value) => <Button key={value} type="button" variant={count === value ? "secondary" : "glass"} size="sm" disabled={isSpinning} onClick={() => changeCount(value)} className="px-1">{value}</Button>)}
            </div>
            <div className="mt-6 border-t border-glass-border pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Qolgan raqamlar</span>
                <strong className="text-xl text-secondary">{available.length}</strong>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-glass-strong">
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${(available.length / count) * 100}%` }} />
              </div>
            </div>
          </aside>

          <section className="order-1 flex min-w-0 flex-col items-center lg:order-2">
            <div className="relative aspect-square w-full max-w-[min(76vh,760px)]">
              <div className="absolute inset-[3%] rounded-full border border-glass-border bg-glass shadow-[inset_0_0_70px_oklch(0.91_0.12_82/10%),0_30px_80px_oklch(0.06_0.03_20/60%)] backdrop-blur-md">
                <div className="absolute inset-[2.5%] rounded-full border border-secondary/40" />
                <div className={`absolute inset-[7%] ${isSpinning ? "drum-orbit-fast" : "drum-orbit"}`}>
                  {visibleBalls.map((number, index) => {
                    const angle = (index / visibleBalls.length) * Math.PI * 2 + (index % 4) * 0.08;
                    const radius = 39 - (index % 5) * 6.2;
                    const left = 50 + Math.cos(angle) * radius;
                    const top = 50 + Math.sin(angle) * radius;
                    const used = history.includes(number);
                    return (
                      <span key={number} className={`absolute flex size-7 items-center justify-center rounded-full border text-[10px] font-extrabold shadow-lg sm:size-8 sm:text-xs ${isSpinning ? "counter-orbit-fast" : "counter-orbit"} ${used ? "border-glass-border bg-glass text-muted-foreground opacity-35" : "border-secondary/60 bg-foreground text-primary"}`} style={{ left: `${left}%`, top: `${top}%` }}>{number}</span>
                    );
                  })}
                </div>
                <div className={`absolute left-1/2 top-1/2 flex size-[34%] min-h-28 min-w-28 items-center justify-center rounded-full border-2 border-secondary bg-[radial-gradient(circle_at_35%_28%,var(--gold-soft),var(--secondary)_38%,var(--primary)_100%)] shadow-[0_0_55px_var(--danger-glow),inset_0_2px_5px_oklch(1_0_0/45%)] ${isSpinning ? "center-spin" : hasResult ? "result-pop" : "-translate-x-1/2 -translate-y-1/2"}`}>
                  <span aria-live="polite" className="text-[clamp(3rem,8vw,6.8rem)] font-black tabular-nums text-primary-foreground drop-shadow-lg">{displayNumber ?? "?"}</span>
                </div>
              </div>
            </div>
            <div className="-mt-1 h-6 w-[46%] rounded-[50%] bg-background/60 blur-xl" />
            <div className="mt-1 min-h-16 text-center">
              {hasResult ? <p className="animate-fade-in text-xl font-bold text-gold-soft sm:text-2xl">Omad yor bo’lsin</p> : <p className="text-sm text-muted-foreground">{available.length ? "Keyingi raqam tayyor" : "Barcha raqamlar tanlandi"}</p>}
            </div>
            <Button type="button" variant="draw" size="projector" onClick={spin} disabled={isSpinning || available.length === 0} className="w-full max-w-sm sm:w-auto">
              <Sparkles className="size-5" />{isSpinning ? "Aylanmoqda…" : "Aylantirish"}
            </Button>
          </section>

          <aside className="order-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <section className="glass-panel rounded-2xl p-5">
              <div className="flex items-center gap-2 text-secondary"><Timer className="size-5" /><h2 className="text-sm font-bold uppercase tracking-[0.16em]">Vaqt</h2></div>
              <div className={`my-5 text-center text-[clamp(3.25rem,6vw,5.4rem)] font-extrabold leading-none tabular-nums ${timerState === "done" ? "text-secondary" : "text-foreground"}`}>{formatTime(remaining)}</div>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-muted-foreground">Daqiqa<Input type="number" min={0} max={99} value={minutes} disabled={timerState === "running"} onChange={(event) => setMinutes(Math.max(0, Number(event.target.value)))} onBlur={setTimer} className="mt-1 h-11 bg-glass-strong text-center text-foreground" /></label>
                <label className="text-xs text-muted-foreground">Soniya<Input type="number" min={0} max={59} value={seconds} disabled={timerState === "running"} onChange={(event) => setSeconds(Math.min(59, Math.max(0, Number(event.target.value))))} onBlur={setTimer} className="mt-1 h-11 bg-glass-strong text-center text-foreground" /></label>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <Button type="button" variant={timerState === "running" ? "glass" : "secondary"} className="h-11" disabled={remaining === 0 && timerState !== "done"} onClick={() => setTimerState(timerState === "running" ? "paused" : "running")}>
                  {timerState === "running" ? <Pause /> : <Play />}{timerButtonLabel}
                </Button>
                <Button type="button" variant="glass" size="icon" className="size-11" onClick={resetTimer} aria-label="Taymerni qayta o‘rnatish"><RotateCcw /></Button>
              </div>
            </section>

            <section className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-secondary"><History className="size-5" /><h2 className="text-sm font-bold uppercase tracking-[0.16em]">Tarix</h2></div>
                <span className="text-xs text-muted-foreground">{history.length}/{count}</span>
              </div>
              <div className="mt-4 flex min-h-20 flex-wrap content-start gap-2">
                {history.length ? history.slice(0, 15).map((number, index) => <span key={`${number}-${index}`} className={`flex size-10 items-center justify-center rounded-full border font-bold ${index === 0 ? "border-secondary bg-secondary text-secondary-foreground" : "border-glass-border bg-glass-strong text-foreground"}`}>{number}</span>) : <p className="m-auto text-sm text-muted-foreground">Hali raqam tanlanmadi</p>}
              </div>
              <Button type="button" variant="glass" className="mt-4 w-full" onClick={resetPool} disabled={history.length === 0 && !isSpinning}><RotateCcw />Qayta boshlash</Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}