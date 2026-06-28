import { expect, test } from "@playwright/test";

test("人类玩家打开网页后看到 15x15 棋盘和初始状态", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("status")).toHaveText("轮到你落子");

  const board = page.getByRole("grid", { name: "棋盘" });
  await expect(board).toBeVisible();
  await expect(board.getByRole("gridcell")).toHaveCount(225);
});

test("1024px 桌面宽度下棋盘和状态区不重叠", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const board = page.getByRole("grid", { name: "棋盘" });
  const statusPanel = page.getByRole("complementary", { name: "棋局状态" });

  await expect(board).toBeVisible();
  await expect(statusPanel).toBeVisible();

  const boardBox = await board.boundingBox();
  const statusBox = await statusPanel.boundingBox();

  expect(boardBox).not.toBeNull();
  expect(statusBox).not.toBeNull();

  const boardRight = boardBox!.x + boardBox!.width;
  const boardBottom = boardBox!.y + boardBox!.height;
  const statusRight = statusBox!.x + statusBox!.width;
  const statusBottom = statusBox!.y + statusBox!.height;

  const overlaps =
    boardBox!.x < statusRight &&
    boardRight > statusBox!.x &&
    boardBox!.y < statusBottom &&
    boardBottom > statusBox!.y;

  expect(overlaps).toBe(false);
});

test("人类玩家可以在空交叉点落黑棋", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("gridcell", { name: "第 8 行第 8 列" }).click();

  await expect(page.getByRole("gridcell", { name: "第 8 行第 8 列，黑棋" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("轮到你落子");
});

test("重新开始会清空棋盘并恢复初始状态", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("gridcell", { name: "第 8 行第 8 列" }).click();
  await expect(page.getByRole("gridcell", { name: "第 8 行第 8 列，黑棋" })).toBeVisible();

  await page.getByRole("button", { name: "重新开始" }).click();

  await expect(page.getByRole("gridcell", { name: "第 8 行第 8 列" })).toBeVisible();
  await expect(page.getByRole("gridcell", { name: /黑棋/ })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("轮到你落子");
});

test("已占用交叉点不会被重复落子覆盖", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("gridcell", { name: "第 8 行第 8 列" }).click();
  await page.getByRole("gridcell", { name: "第 8 行第 8 列，黑棋" }).click();

  await expect(page.getByRole("gridcell", { name: /黑棋/ })).toHaveCount(1);
  await expect(page.getByRole("gridcell", { name: "第 8 行第 8 列，黑棋" })).toBeVisible();
});

test("人类玩家落子后电脑玩家思考并自动落白棋", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("gridcell", { name: "第 8 行第 8 列" }).click();

  await expect(page.getByRole("status")).toHaveText("电脑玩家思考中");
  await expect(page.getByRole("gridcell", { name: /白棋/ })).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("轮到你落子");
});
