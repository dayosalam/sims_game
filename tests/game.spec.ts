import { test, expect, type Page } from "@playwright/test";
import { OrthographicCamera, Vector3 } from "three";
async function worldClick(page: Page, x: number, y: number, z: number) {
  const box = (await page.locator("canvas").boundingBox())!;
  const camera = new OrthographicCamera(
    -box.width / 2,
    box.width / 2,
    box.height / 2,
    -box.height / 2,
    0.1,
    100,
  );
  camera.position.set(14, 16, 18);
  camera.zoom = Math.min(48, box.height / 14, box.width / 19);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const point = new Vector3(x, y, z).project(camera);
  await page.mouse.click(
    box.x + ((point.x + 1) * box.width) / 2,
    box.y + ((1 - point.y) * box.height) / 2,
  );
}
async function state(page: Page) {
  return page.evaluate(async () => {
    const { useGameStore } = await import(
      "/src/store/gameStore.ts" /* @vite-ignore */
    );
    const s = useGameStore.getState();
    return {
      position: s.position,
      action: s.action,
      needs: s.needs,
      minutes: s.minutes,
      speed: s.speed,
      selected: s.selected,
      task: s.task,
    };
  });
}
test("mouse movement, real furniture interaction, needs, pause, speed and camera controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator(".character-tag")).toHaveText("Alex");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await worldClick(page, -2.7, 0, 1);
  await expect.poll(async () => (await state(page)).action).toBe("Walking");
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect.poll(async () => (await state(page)).action).toBe("Idle");
  const p = (await state(page)).position;
  expect(Math.hypot(p[0] + 2.7, p[1] - 1)).toBeLessThan(0.1);
  await worldClick(page, 5, 1.2, -3.4);
  await expect(page.locator(".interaction-menu")).toContainText("Fresh fridge");
  await page.getByRole("button", { name: "3× speed" }).click();
  const hunger = (await state(page)).needs.hunger;
  await page.getByRole("button", { name: /Have a snack/ }).click();
  await expect
    .poll(async () => (await state(page)).action, { timeout: 15000 })
    .toBe("Eating");
  await expect(page.locator(".character-tag")).toHaveText("Eating");
  await expect
    .poll(async () => (await state(page)).action, { timeout: 10000 })
    .toBe("Idle");
  expect((await state(page)).needs.hunger).toBeGreaterThan(hunger + 25);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await state(page);
  await page.waitForTimeout(500);
  const frozen = await state(page);
  expect(frozen.minutes).toBe(paused.minutes);
  expect(frozen.needs).toEqual(paused.needs);
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("Space");
  expect((await state(page)).speed).toBe(3);
  await page.keyboard.press("Space");
  expect((await state(page)).speed).toBe(0);
  const initial = (await page.locator(".character-tag").boundingBox())!;
  await page.keyboard.down("d");
  await page.waitForTimeout(400);
  await page.keyboard.up("d");
  const moved = (await page.locator(".character-tag").boundingBox())!;
  expect(Math.abs(moved.x - initial.x)).toBeGreaterThan(10);
  await page.getByRole("button", { name: "Reset camera" }).click();
  await expect
    .poll(async () =>
      Math.abs(
        (await page.locator(".character-tag").boundingBox())!.x - initial.x,
      ),
    )
    .toBeLessThan(1);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  await page.mouse.move(680, 280);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(760, 320, { steps: 8 });
  await page.mouse.up({ button: "right" });
  await page.waitForTimeout(400);
  expect(
    Math.abs(
      (await page.locator(".character-tag").boundingBox())!.x - initial.x,
    ),
  ).toBeGreaterThan(15);
  await page.getByRole("button", { name: "Reset camera" }).click();
  await page.waitForTimeout(400);
  await worldClick(page, -3.8, 0.8, -3.2);
  await expect(page.locator(".interaction-menu")).toContainText("Cloud bed");
  await page.keyboard.press("Escape");
  await expect(page.locator(".interaction-menu")).toHaveCount(0);
  await page.getByRole("button", { name: "Controls & help" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.screenshot({ path: "tests/artifacts/desktop.png" });
  expect(errors).toEqual([]);
});
test("mobile layout and quick activities remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".character-tag")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.getByRole("button", { name: "Things to do" }).click();
  await page.getByRole("button", { name: /Freshen up/ }).click();
  await expect.poll(async () => (await state(page)).action).toBe("Walking");
  await page.screenshot({ path: "tests/artifacts/mobile.png" });
  await page.getByRole("button", { name: "Controls & help" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Let’s settle in" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
