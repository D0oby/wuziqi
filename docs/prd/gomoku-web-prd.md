# PRD: 人机对战五子棋网页

## Problem Statement

用户想要一个可以直接在桌面浏览器中游玩的五子棋网页，但当前仓库还没有可运行的网页、棋盘交互、胜负判断或电脑玩家。用户需要的是一个第一版就完整可玩的单局体验：打开页面即可开始人机对战，规则清晰，状态反馈明确，界面有辨识度，并且不需要账号、后端或在线匹配。

## Solution

构建一个桌面优先的人机对战五子棋网页。页面加载后展示 15x15 棋盘，人类玩家执黑并按自由规则五子棋先手落子，电脑玩家执白并在短暂思考延迟后自动落子。系统负责判断胜利、平局和棋局结束，并提供重新开始能力。

第一版采用赛博朋克视觉风格，整体呈现暗色、霓虹、高对比和科技感。实现形态为 Vite + React + TypeScript 的纯前端静态网页，不引入后端、数据库、账号系统或在线对战。

## User Stories

1. As a 人类玩家, I want to open the webpage and immediately see a playable 棋盘, so that I can start a game without setup.
2. As a 人类玩家, I want the 棋盘 to be a 15x15 intersection grid, so that it matches the expected 五子棋 layout.
3. As a 人类玩家, I want pieces to be placed on intersections rather than inside squares, so that the board behaves like 五子棋.
4. As a 人类玩家, I want to play under 自由规则五子棋, so that I can use familiar casual rules without learning 禁手规则.
5. As a 人类玩家, I want to control black pieces by default, so that I can make the first 落子.
6. As a 人类玩家, I want the first state to be “轮到你落子”, so that I know I should act first.
7. As a 人类玩家, I want to click an empty intersection to 落子, so that the game can progress naturally.
8. As a 人类玩家, I want occupied intersections to reject additional 落子, so that the 棋局 remains valid.
9. As a 人类玩家, I want invalid clicks to avoid changing the 棋局, so that accidental clicks do not corrupt the board.
10. As a 人类玩家, I want the 电脑玩家 to respond automatically after my 落子, so that I can play without a second human.
11. As a 人类玩家, I want a short “电脑玩家思考中” state, so that the computer response feels intentional rather than abrupt.
12. As a 人类玩家, I want the 电脑玩家 to place white pieces only on empty intersections, so that its moves follow the same board rules.
13. As a 人类玩家, I want the 电脑玩家 to block an immediate human 胜利, so that the opponent feels plausible.
14. As a 人类玩家, I want the 电脑玩家 to take an immediate winning move when available, so that it behaves competitively.
15. As a 人类玩家, I want the 电脑玩家 to prefer useful positions when no immediate win or block exists, so that the game feels like a real 对弈.
16. As a 人类玩家, I want horizontal five-in-a-row to be recognized as 胜利, so that common winning patterns work.
17. As a 人类玩家, I want vertical five-in-a-row to be recognized as 胜利, so that all straight-line wins work.
18. As a 人类玩家, I want diagonal five-in-a-row in both directions to be recognized as 胜利, so that diagonal wins are valid.
19. As a 人类玩家, I want five or more continuous same-color pieces to count as 胜利, so that overlines follow 自由规则五子棋.
20. As a 人类玩家, I want the status area to say “你赢了” when I win, so that the result is unambiguous.
21. As a 人类玩家, I want the status area to say “电脑玩家胜利” when the computer wins, so that the result is unambiguous.
22. As a 人类玩家, I want the 棋局 to end immediately after 胜利, so that no further 落子 can change the result.
23. As a 人类玩家, I want a full board without 胜利 to be treated as 平局, so that the game has a defined final state.
24. As a 人类玩家, I want the status area to say “平局” when the board fills without a winner, so that I understand the outcome.
25. As a 人类玩家, I want the 棋盘 to lock after 棋局结束, so that no moves are accepted after the result.
26. As a 人类玩家, I want a “重新开始” control, so that I can quickly play another game.
27. As a 人类玩家, I want 重新开始 to clear the current 棋盘, so that the new 棋局 starts cleanly.
28. As a 人类玩家, I want 重新开始 to restore the initial “轮到你落子” state, so that I know the new game is ready.
29. As a 人类玩家, I want no 悔棋 in the first version, so that the rules of 人机对战 stay simple.
30. As a 人类玩家, I want no first-player selection in the first version, so that the game starts immediately.
31. As a 人类玩家, I want no difficulty selection in the first version, so that the page remains focused on one polished experience.
32. As a 人类玩家, I want no timer, move list, score display, or 棋谱, so that the interface stays uncluttered.
33. As a 人类玩家, I want the page to work well on a desktop browser at 1024px width or wider, so that the 棋盘 and status area are usable on ordinary laptops.
34. As a 人类玩家, I want a visually clear hover or focus indication on intersections, so that I can tell where my 落子 will go.
35. As a 人类玩家, I want the 棋盘 to use a cyberpunk neon style, so that the game feels distinctive rather than like a plain grid.
36. As a 人类玩家, I want black and white pieces to be visually distinct under the dark neon theme, so that I can read the 棋局 quickly.
37. As a 人类玩家, I want animations to be restrained, so that visual effects do not interfere with reading the 棋盘.
38. As a 人类玩家, I want the status area and 重新开始 control to share the same neon visual language, so that the page feels coherent.
39. As a future maintainer, I want the rule logic to be expressed with clear typed concepts, so that 胜利, 平局, 落子, and 棋局结束 are hard to confuse.
40. As a future maintainer, I want the 电脑玩家 behavior separated from visual presentation, so that its heuristic can be improved later without redesigning the UI.
41. As a future maintainer, I want the first version to avoid backend dependencies, so that the game can be deployed as static assets.
42. As a future maintainer, I want the PRD to use the project glossary terms, so that implementation and tests share the same language.

## Implementation Decisions

- Build the first version as a pure frontend static web application.
- Use Vite + React + TypeScript for the frontend implementation.
- Do not introduce a backend, database, authentication system, or server-owned game state.
- Keep all 棋局 state in the browser for the current session.
- Model the 棋盘 as a 15x15 intersection grid.
- Represent each intersection as empty, occupied by the human black piece, or occupied by the computer white piece.
- Human black moves first under 黑方先手.
- The first version does not provide first-player selection.
- The first version uses 自由规则五子棋.
- Do not implement 禁手规则.
- Treat five or more continuous same-color pieces in a horizontal, vertical, or diagonal line as 胜利.
- Treat a full 棋盘 with no 胜利 as 平局.
- Treat 胜利 or 平局 as 棋局结束.
- Reject any 落子 after 棋局结束.
- Reject 落子 on occupied intersections.
- Provide 重新开始 as the only explicit game control.
- Do not provide 悔棋 in the first version.
- After a valid human 落子, run result detection before allowing the 电脑玩家 to act.
- If the human move does not end the game, show “电脑玩家思考中” before the computer move.
- Use a short 300-600ms delay for the computer response.
- After the computer move, run result detection before returning control to the human.
- Implement the 电脑玩家 as a heuristic opponent, not as a professional-strength engine.
- The 电脑玩家 should first choose a one-move winning point if available.
- If the human has an immediate one-move winning point, the 电脑玩家 should block it.
- If neither side has an immediate winning point, the 电脑玩家 should select a scored position.
- The scoring heuristic should prefer positions near existing pieces, extensions of computer lines, and blocks against human lines.
- Do not implement multi-depth search, opening books, or difficulty levels in the first version.
- Use a cyberpunk visual direction: dark background, neon accents, high contrast, subtle glow, and restrained motion.
- Avoid the traditional wood-board style for this PRD; the current design direction is cyberpunk.
- Ensure intersections remain easy to identify and click despite visual effects.
- Give black and white pieces distinct appearances that remain readable on the dark neon board.
- Show only current state or result in the status area.
- Required state/result messages are “轮到你落子”, “电脑玩家思考中”, “你赢了”, “电脑玩家胜利”, and “平局”.
- Prioritize desktop browsers at 1024px width and above.
- Mobile layout is not required for the first version.
- The completed build should be deployable as static assets.

## Testing Decisions

- The primary test seam is browser-level end-to-end behavior, because this repo currently has no implementation code and no lower-level test structure.
- Tests should verify external behavior visible to a user, not internal implementation details such as exact heuristic scores or component state shape.
- The highest-value tests should exercise a complete 人机对战 loop: page load, human 落子, computer response, status updates, and 重新开始.
- The 棋盘 interaction should be tested through user-visible clicks on intersections.
- Tests should confirm that occupied intersections reject additional 落子.
- Tests should confirm that no 落子 is accepted after 棋局结束.
- Tests should cover 胜利 detection for horizontal, vertical, and both diagonal directions.
- Tests should cover the 自由规则五子棋 overline case where more than five continuous pieces still counts as 胜利.
- Tests should cover 平局 when the 棋盘 is full and neither side has won.
- Tests should cover the 电脑玩家 immediate-win behavior when a winning move is available.
- Tests should cover the 电脑玩家 immediate-block behavior when the human has a direct winning threat.
- Tests should verify that “电脑玩家思考中” appears between the human move and computer move.
- Tests should verify that 重新开始 clears the board and restores the initial state.
- Tests should include a desktop viewport at or above 1024px and verify that the 棋盘 and status area are both usable and not overlapping.
- Visual tests should focus on readability and layout stability, not pixel-perfect reproduction of glow effects.
- Since there is no prior test suite in the repo, the initial testing setup should be minimal and oriented around the single browser-level seam.
- Lower-level rule tests may be added later if browser-level tests become too slow or too difficult to set up for specific board states.

## Out of Scope

- Online 对弈
- Local two-human 对弈
- User accounts
- Matchmaking
- Leaderboards
- Persistent 棋谱
- Move history display
- 悔棋
- Timer
- Difficulty levels
- Opening books
- Professional-strength AI
- Multi-depth search
- 禁手规则
- First-player selection
- Mobile-first layout
- Backend APIs
- Database storage
- Analytics
- Sound effects

## Further Notes

- This PRD is synthesized from the current design document and the project domain glossary.
- The project glossary defines the canonical vocabulary for 自由规则五子棋, 棋盘, 人机对战, 人类玩家, 电脑玩家, 落子, 重新开始, 胜利, 平局, 棋局结束, and 黑方先手.
- No ADR is required at this stage. The current decisions are useful product and implementation constraints, but they are still easy to revisit after the first version.
- The issue should be labeled `ready-for-agent` when published.
