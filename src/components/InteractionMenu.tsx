import { X, Play } from "lucide-react";
import type { HomeObject } from "../data/objects";
import { useGameStore } from "../store/gameStore";
export function InteractionMenu({ object }: { object: HomeObject }) {
  return (
    <div
      className="interaction-menu"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="menu-title">
        <span>{object.name}</span>
        <button
          aria-label="Close interaction menu"
          onClick={() => useGameStore.getState().select(null)}
        >
          <X size={15} />
        </button>
      </div>
      {object.interactions.map((interaction, i) => (
        <button
          className="interaction-option"
          key={interaction.label}
          onClick={() => useGameStore.getState().interact(object.id, i)}
        >
          <span className="play-icon">
            <Play size={14} />
          </span>
          <span>
            <b>{interaction.label}</b>
            <small>
              {Object.entries(interaction.effects)
                .map(([need, value]) => `+${value} ${need}`)
                .join(" · ")}{" "}
              · {interaction.duration}s
            </small>
          </span>
        </button>
      ))}
    </div>
  );
}
