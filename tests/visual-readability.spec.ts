import { expect, test, type Locator, type Page } from "@playwright/test";

test("1024px 桌面宽度下赛博朋克棋盘、状态区和重新开始控件保持可读", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const board = page.getByRole("grid", { name: "棋盘" });
  const statusPanel = page.getByRole("complementary", { name: "棋局状态" });
  const restartButton = page.getByRole("button", { name: "重新开始" });

  await expect(board).toBeVisible();
  await expect(statusPanel).toBeVisible();
  await expect(restartButton).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("轮到你落子");

  const layout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);

  const boardBox = await requireBoundingBox(board);
  const statusBox = await requireBoundingBox(statusPanel);
  const restartBox = await requireBoundingBox(restartButton);

  expect(boardBox.width).toBeGreaterThanOrEqual(580);
  expect(boardBox.height).toBeGreaterThanOrEqual(580);
  expect(statusBox.width).toBeGreaterThanOrEqual(220);
  expect(restartBox.height).toBeGreaterThanOrEqual(44);

  expect(boardBox.x).toBeGreaterThanOrEqual(24);
  expect(statusBox.x + statusBox.width).toBeLessThanOrEqual(1000);
  expect(boardBox.y + boardBox.height).toBeLessThanOrEqual(744);
});

test("交叉点、棋子和控件在暗色霓虹主题下有清晰可见的视觉反馈", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const emptyIntersection = page.getByRole("gridcell", { name: "第 5 行第 5 列" });
  await expectRenderedIntersectionLines(page, emptyIntersection);

  await emptyIntersection.hover();
  const hoverStyle = await readVisibleStyle(emptyIntersection);
  expect(hoverStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(hoverStyle.outlineStyle).not.toBe("none");
  expect(hoverStyle.outlineColor).not.toBe("rgba(0, 0, 0, 0)");

  await page.keyboard.press("Tab");
  const focusStyle = await readVisibleStyle(page.getByRole("gridcell", { name: "第 1 行第 1 列" }));
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineColor).not.toBe("rgba(0, 0, 0, 0)");

  await page.getByRole("gridcell", { name: "第 8 行第 8 列" }).click();

  const blackStone = page.getByRole("gridcell", { name: "第 8 行第 8 列，黑棋" }).locator(".stone");
  await expect(blackStone).toBeVisible();
  await expect(page.getByRole("gridcell", { name: /白棋/ })).toHaveCount(1);

  const whiteStone = page.getByRole("gridcell", { name: /白棋/ }).locator(".stone");
  await expect(whiteStone).toBeVisible();

  const blackStyle = await readVisibleStyle(blackStone);
  const whiteStyle = await readVisibleStyle(whiteStone);
  expect(blackStyle.width).toBeGreaterThan(24);
  expect(whiteStyle.width).toBeGreaterThan(24);
  expect(blackStyle.backgroundImage).not.toBe(whiteStyle.backgroundImage);
  expect(blackStyle.boxShadow).not.toBe("none");
  expect(whiteStyle.boxShadow).not.toBe("none");

  const restartButton = page.getByRole("button", { name: "重新开始" });
  await restartButton.hover();
  const restartHoverStyle = await readVisibleStyle(restartButton);
  expect(restartHoverStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(restartHoverStyle.outlineStyle).not.toBe("none");
});

async function expectRenderedIntersectionLines(page: Page, intersection: Locator) {
  const board = page.getByRole("grid", { name: "棋盘" });
  const boardBox = await requireBoundingBox(board);
  const intersectionBox = await requireBoundingBox(intersection);
  const screenshot = await page.screenshot({ clip: boardBox, scale: "css" });

  const centerX = intersectionBox.x - boardBox.x + intersectionBox.width / 2;
  const centerY = intersectionBox.y - boardBox.y + intersectionBox.height / 2;

  const sample = await page.evaluate(
    async ({ dataUrl, centerX, centerY }) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas 2D context is unavailable");
      }

      context.drawImage(image, 0, 0);

      const maxLuminance = (x: number, y: number, radius: number) => {
        const left = Math.max(0, Math.round(x - radius));
        const top = Math.max(0, Math.round(y - radius));
        const size = radius * 2 + 1;
        const pixels = context.getImageData(left, top, size, size).data;
        let max = 0;

        for (let index = 0; index < pixels.length; index += 4) {
          const luminance = pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
          max = Math.max(max, luminance);
        }

        return max;
      };

      const line = maxLuminance(centerX, centerY, 2);
      const surfaceSamples = [
        maxLuminance(centerX - 12, centerY - 12, 2),
        maxLuminance(centerX + 12, centerY - 12, 2),
        maxLuminance(centerX - 12, centerY + 12, 2),
        maxLuminance(centerX + 12, centerY + 12, 2),
      ];

      return {
        line,
        surface: Math.max(...surfaceSamples),
      };
    },
    {
      centerX,
      centerY,
      dataUrl: `data:image/png;base64,${screenshot.toString("base64")}`,
    },
  );

  expect(sample.line).toBeGreaterThan(sample.surface + 24);
}

async function readVisibleStyle(locator: Locator) {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return {
      backgroundImage: style.backgroundImage,
      boxShadow: style.boxShadow,
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      width: rect.width,
    };
  });
}

async function requireBoundingBox(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}
