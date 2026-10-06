import { Pause, Play, Sun } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { formatTime } from "../systems/simulation";
export function GameClock() {
  const minutes = useGameStore((s) => Math.floor(s.minutes)),
    speed = useGameStore((s) => s.speed),
    clock = formatTime(minutes);
  return (
    <section className="clock-panel" aria-label="Game time">
      <Sun className="sun" size={27} strokeWidth={1.5} />
      <div className="clock-text">
        <span>{clock.day}</span>
        <strong>
          {clock.time} <small>{clock.period}</small>
        </strong>
      </div>
      <div className="speed-controls">
        <button
          title="Pause or resume (Space)"
          aria-label={speed ? "Pause" : "Resume"}
          aria-pressed={speed === 0}
          className={speed === 0 ? "active" : ""}
          onClick={() => useGameStore.getState().togglePause()}
        >
          {speed ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
        </button>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            aria-label={`${n}× speed`}
            aria-pressed={speed === n}
            className={speed === n ? "active" : ""}
            onClick={() => useGameStore.getState().setSpeed(n)}
          >
            {n}×
          </button>
        ))}
      </div>
    </section>
  );
}
