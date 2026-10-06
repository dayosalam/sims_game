# Little Days

A playable browser life-simulation MVP: one character, four furnished rooms, and a small daily-care loop. All models are original procedural low-poly geometry.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

```sh
npm run build       # TypeScript check and production build in dist/
npm run preview     # Serve the production build
npm test            # Navigation and simulation tests
npm run test:e2e    # Desktop and mobile browser tests
npm run format      # Format project sources
```

Browser tests use Google Chrome at its standard macOS location. Set `CHROME_PATH` to another Chrome/Chromium executable on other systems. The Playwright configuration starts Vite if it is not already running. Screenshots are written to `tests/artifacts/`.

## Run with Docker

Start Docker Desktop (or Docker Engine with the Compose plugin), then run:

```sh
docker compose up --build -d
```

Open **http://localhost:8080**. This builds and tests the app with Node.js, then serves the production files with Nginx. Node.js and build dependencies are not included in the final image. The container runs as a non-root user with a read-only filesystem and temporary runtime files in `/tmp`.

```sh
docker compose ps           # Container and health status
docker compose logs -f web  # Server logs
docker compose down         # Stop and remove the container
```

After changing source files, run `docker compose up --build -d` again. To choose a different local port:

```sh
PORT=8090 docker compose up --build -d
```

Compose binds to localhost by default. For access from other computers, use `BIND_ADDRESS=0.0.0.0 docker compose up --build -d`. Container port 8080 remains the same. The health endpoint is `/healthz`; hashed assets are cached long-term, while HTML is revalidated on each visit.

Without Compose:

```sh
docker build -t little-days:local .
docker run --rm --name little-days -p 127.0.0.1:8080:8080 little-days:local
```

Docker does not add persistence: game state still resets when the browser page reloads. No database, environment secrets, or data volumes are needed.

## Play

- Left-click an open floor to walk. Blocked destinations are rejected.
- Click the bed, sofa, refrigerator, TV, shower, toilet, or sink, then choose its activity. The menu appears beside the object.
- “Things to do” provides keyboard-accessible shortcuts to the same activities.
- Right-drag or use WASD / arrow keys to pan. Scroll or use + / − to zoom. The frame button restores the camera.
- Space pauses/resumes; 1×, 2×, and 3× change the pace of movement, needs, activities, and time.
- Escape closes menus. The × in the current-action row cancels movement or an activity.

Activities restore needs gradually while Alex is busy. All needs are bounded between 0 and 100. At 1×, one real second advances the clock by two simulated minutes. Pausing freezes the simulation while allowing camera movement and selection of the next activity.

## Structure

- `src/components/`: Three.js world, procedural furniture and character, camera controls, projected HTML interaction menus, clock, and needs HUD.
- `src/data/objects.ts`: furniture positions, collision footprints, reachable interaction points, duration, and need effects; wall geometry is shared by rendering and navigation.
- `src/data/needs.ts`: need labels, colors, and decay rates.
- `src/systems/pathfinding.ts`: A* on a 0.25-unit grid, clearance for the character radius, diagonal collision checks, and safe path smoothing.
- `src/systems/simulation.ts`: pure movement, needs, and clock logic.
- `src/store/gameStore.ts`: Zustand state and orchestration. A single frame-driven simulation advances the current route or activity.
- `src/systems/pathfinding.test.ts`: navigation, collisions, full activity lifecycle, need bounds, time rollover, and pause/speed checks.
- `tests/game.spec.ts`: real floor and furniture mouse clicks, recovery of needs, keyboard and camera controls, help dialog, and mobile layout.

To add furniture, add a configuration entry and its geometry in `Furniture.tsx`. Collision uses the configured axis-aligned footprint; the current MVP models have no rotation. Keep its interaction point outside obstacles and run the reachability tests. Add future needs to the `Need` union, definitions, initial state, and HUD icon map.

## Scope

Desktop-first prototype with a responsive HUD. WebGL is required. State lives in memory and resets on reload; no server, account, storage, cloud saves, economy, building mode, or additional characters. Interaction animations are represented by an activity label and progress bar; walking and idle motion are procedural. Navigation is designed for this small static home.
