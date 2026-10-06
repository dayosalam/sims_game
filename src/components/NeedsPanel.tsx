import {
  Apple,
  BatteryMedium,
  Droplets,
  Sparkles,
  Smile,
  X,
} from "lucide-react";
import { needDefinitions } from "../data/needs";
import { useGameStore } from "../store/gameStore";
const icons = {
  hunger: Apple,
  energy: BatteryMedium,
  hygiene: Droplets,
  fun: Sparkles,
};
export function NeedsPanel() {
  const needs = useGameStore((s) => s.needs),
    action = useGameStore((s) => s.action),
    task = useGameStore((s) => s.task);
  const average = Object.values(needs).reduce((a, b) => a + b, 0) / 4;
  return (
    <section className="needs-panel" aria-label="Alex’s needs">
      <div className="profile">
        <div className="avatar">
          <Smile size={37} strokeWidth={1.5} />
        </div>
        <div>
          <div className="profile-title">
            Alex <span>AT HOME</span>
          </div>
          <div className="mood">
            {average > 65
              ? "Feeling good"
              : average > 40
                ? "Doing alright"
                : "Could use some care"}
          </div>
        </div>
      </div>
      <div className="needs-grid">
        {needDefinitions.map((n) => {
          const Icon = icons[n.id];
          return (
            <div className="need" key={n.id}>
              <div className="need-label">
                <span>
                  <Icon size={15} />
                  {n.label}
                </span>
                <span>
                  {Math.round(needs[n.id])}
                  <small>/100</small>
                </span>
              </div>
              <div
                className="need-track"
                role="progressbar"
                aria-label={n.label}
                aria-valuenow={Math.round(needs[n.id])}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  style={{
                    width: `${needs[n.id]}%`,
                    background: needs[n.id] < 25 ? "#ca765f" : n.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="action-row">
        <span className={`action-dot ${action === "Idle" ? "idle" : ""}`} />
        <span>{action === "Idle" ? "Enjoying a quiet moment" : action}</span>
        {action !== "Idle" ? (
          <button
            onClick={() => useGameStore.getState().cancel()}
            aria-label="Cancel current action"
          >
            <X size={14} />
          </button>
        ) : (
          <small>NO RUSH</small>
        )}
      </div>
      {task?.started ? (
        <div className="action-progress">
          <div
            style={{
              width: `${(task.elapsed / task.interaction.duration) * 100}%`,
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
