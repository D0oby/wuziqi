# 测试结果

生成时间：2026-06-28 22:47 Asia/Shanghai

## 汇总

| 命令 | 结果 |
| --- | --- |
| `npm run test:unit` | 通过，8 tests passed |
| `npm run test:e2e` | 通过，8 tests passed |
| `npm run build` | 通过 |

## `npm run test:unit`

```text
> wuziqi@0.1.0 test:unit
> vitest run tests/game.unit.spec.ts


 RUN  v4.1.9 /Users/admin/Documents/五子棋


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  22:47:03
   Duration  110ms (transform 16ms, setup 0ms, import 23ms, tests 6ms, environment 0ms)
```

## `npm run test:e2e`

```text
> wuziqi@0.1.0 test:e2e
> playwright test

[WebServer] (node:98682) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 8 tests using 2 workers

(node:98705) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:98706) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  2 [chromium] › tests/gomoku.spec.ts:3:1 › 人类玩家打开网页后看到 15x15 棋盘和初始状态 (329ms)
  ✓  1 [chromium] › tests/visual-readability.spec.ts:3:1 › 1024px 桌面宽度下赛博朋克棋盘、状态区和重新开始控件保持可读 (353ms)
  ✓  3 [chromium] › tests/gomoku.spec.ts:13:1 › 1024px 桌面宽度下棋盘和状态区不重叠 (157ms)
  ✓  5 [chromium] › tests/gomoku.spec.ts:43:1 › 人类玩家可以在空交叉点落黑棋 (966ms)
  ✓  4 [chromium] › tests/visual-readability.spec.ts:36:1 › 交叉点、棋子和控件在暗色霓虹主题下有清晰可见的视觉反馈 (1.2s)
  ✓  6 [chromium] › tests/gomoku.spec.ts:52:1 › 重新开始会清空棋盘并恢复初始状态 (238ms)
  ✓  7 [chromium] › tests/gomoku.spec.ts:65:1 › 已占用交叉点不会被重复落子覆盖 (165ms)
  ✓  8 [chromium] › tests/gomoku.spec.ts:75:1 › 人类玩家落子后电脑玩家思考并自动落白棋 (935ms)

  8 passed (3.8s)
```

## `npm run build`

```text
> wuziqi@0.1.0 build
> tsc --noEmit && vite build

vite v8.1.0 building client environment for production...
transforming...✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.39 kB │ gzip:  0.28 kB
dist/assets/index-Czz66xhM.css    3.70 kB │ gzip:  1.40 kB
dist/assets/index-Bq-_SJ53.js   193.69 kB │ gzip: 61.46 kB

✓ built in 109ms
```
