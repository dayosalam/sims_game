import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home,
  Maximize,
  Minus,
  Plus,
  HelpCircle,
  X,
  MousePointer2,
  Move,
  Keyboard,
  BedDouble,
  Sofa,
  Tv,
  Refrigerator,
  ShowerHead,
  Droplets,
  ChevronDown,
} from "lucide-react";
import { GameCanvas } from "./components/GameCanvas";
import { NeedsPanel } from "./components/NeedsPanel";
import { GameClock } from "./components/GameClock";
import { objects } from "./data/objects";
import { useGameStore } from "./store/gameStore";
import "./styles.css";
class SceneBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="scene-error">
        <h2>The home couldn’t load</h2>
        <p>This game needs a browser with WebGL enabled.</p>
        <button onClick={() => location.reload()}>Try again</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
const quickIcons: Record<string, typeof Sofa> = {
  bed: BedDouble,
  sofa: Sofa,
  tv: Tv,
  fridge: Refrigerator,
  shower: ShowerHead,
  toilet: Droplets,
  sink: Droplets,
};
function Help({ close }: { close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="help-dialog"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="help-heading">
        <span className="eyebrow">MAKE YOURSELF AT HOME</span>
        <button onClick={close} aria-label="Close controls">
          <X size={20} />
        </button>
      </div>
      <h2>The little things.</h2>
      <p>Take care of Alex, one small moment at a time.</p>
      <div className="help-line">
        <MousePointer2 />
        <span>
          <b>Click the floor</b>
          <small>Alex will find a clear path there.</small>
        </span>
      </div>
      <div className="help-line">
        <Sofa />
        <span>
          <b>Click a household object</b>
          <small>Choose an activity to restore a need.</small>
        </span>
      </div>
      <div className="help-line">
        <Move />
        <span>
          <b>Right-drag or WASD / arrow keys</b>
          <small>Pan around the home. Scroll to zoom.</small>
        </span>
      </div>
      <div className="help-line">
        <Keyboard />
        <span>
          <b>Space to pause · Esc to close menus</b>
          <small>Use 1×, 2×, or 3× to set the pace.</small>
        </span>
      </div>
      <p className="help-note">
        Needs gently decrease as the day goes by. Activities restore them while
        Alex is busy. A fresh day starts when you reload.
      </p>
      <button className="primary-button" onClick={close}>
        Let’s settle in
      </button>
    </dialog>
  );
}
function Status() {
  const notice = useGameStore((s) => s.notice),
    paused = useGameStore((s) => s.speed === 0);
  return (
    <div className="status-note" role="status">
      <span>{paused ? "Ⅱ" : "✦"}</span>
      {paused ? "A moment on pause. Resume when you’re ready." : notice}
    </div>
  );
}
export default function App() {
  const [help, setHelp] = useState(false),
    [activities, setActivities] = useState(false);
  const helpButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) ||
          e.target.isContentEditable)
      )
        return;
      if (
        e.code === "Space" &&
        !e.repeat &&
        !document.querySelector("dialog[open]")
      ) {
        e.preventDefault();
        useGameStore.getState().togglePause();
      }
      if (e.key === "Escape") {
        useGameStore.getState().select(null);
        setActivities(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <main className="game">
      <div className="world">
        <SceneBoundary>
          <GameCanvas />
        </SceneBoundary>
      </div>
      <header className="topbar">
        <div className="brand">
          <b>
            little days<span>✳</span>
          </b>
          <small>A LITTLE SPACE TO CALL YOUR OWN</small>
        </div>
        <GameClock />
      </header>
      <div className="home-label">
        <span className="home-icon">
          <Home size={17} />
        </span>
        <span>
          <b>Maple Cottage</b>
          <small>YOUR LITTLE CORNER OF THE WORLD</small>
        </span>
      </div>
      <div className="camera-tools" aria-label="Camera controls">
        <button
          title="Zoom in"
          aria-label="Zoom in"
          onClick={() => useGameStore.getState().camera("in")}
        >
          <Plus size={18} />
        </button>
        <button
          title="Zoom out"
          aria-label="Zoom out"
          onClick={() => useGameStore.getState().camera("out")}
        >
          <Minus size={18} />
        </button>
        <span />
        <button
          title="Reset camera"
          aria-label="Reset camera"
          onClick={() => useGameStore.getState().camera("reset")}
        >
          <Maximize size={17} />
        </button>
      </div>
      <div className="bottom-ui">
        <NeedsPanel />
        <div className="bottom-right">
          <div className="activities-wrap">
            {activities ? (
              <div
                className="activities-menu"
                aria-label="Household activities"
              >
                <div className="eyebrow">A LITTLE TIME FOR YOU</div>
                {objects
                  .filter((o) => o.interactions.length)
                  .map((o) => {
                    const Icon = quickIcons[o.id] ?? Sofa;
                    return (
                      <button
                        key={o.id}
                        onClick={() => {
                          useGameStore.getState().interact(o.id, 0);
                          setActivities(false);
                        }}
                      >
                        <Icon size={17} />
                        <span>
                          {o.interactions[0].label}
                          <small>{o.name}</small>
                        </span>
                      </button>
                    );
                  })}
              </div>
            ) : null}
            <button
              className="activities-button"
              aria-expanded={activities}
              onClick={() => setActivities(!activities)}
            >
              <Sofa size={18} /> Things to do{" "}
              <ChevronDown
                size={15}
                style={{ transform: activities ? "rotate(180deg)" : undefined }}
              />
            </button>
          </div>
          <Status />
          <div className="control-hint">
            <MousePointer2 size={13} />
            <span>Click to wander. Click an object to interact.</span>
          </div>
        </div>
      </div>
      <footer>
        <span>LIFE, AT YOUR OWN PACE.</span>
        <button ref={helpButton} onClick={() => setHelp(true)}>
          <HelpCircle size={15} /> Controls & help
        </button>
      </footer>
      {help ? (
        <Help
          close={() => {
            setHelp(false);
            helpButton.current?.focus();
          }}
        />
      ) : null}
    </main>
  );
}
