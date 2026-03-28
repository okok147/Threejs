# Version Journal

## 2026-03-26 / v001-orbit-cinematic

- 動作：把原本單一首頁封裝成第一個不可覆蓋版本。
- 視覺論點：poster-first 的宇宙品牌首頁，3D 是舞台中央。
- 使用情境：品牌發表頁、世界觀首頁、展示型 landing page。
- 差異價值：它是之後所有版本的基線，因此保留最強的 cinematic 氣氛與最直覺的單頁敘事。
- 快照：`screenshots/v001/poster.svg`

## 2026-03-26 / v002-signal-ledger

- 動作：新增全新版本，不再把 three.js 首頁只當成品牌海報，而是當成編輯式作品集索引。
- Visual thesis：紙質編輯帳冊 + 右側被裁切的 3D 儀表。
- Content plan：hero manifesto -> style families -> lab method -> research archive。
- Interaction thesis：
  - 場景被裁成右側儀表，不再佔滿舞台。
  - section progress 仍驅動 3D，但整體運動幅度比 v001 更平靜。
  - 固定頁首導覽讓長頁閱讀有明確定位。
- 為何它明顯不同：v001 是世界觀首頁；v002 是作品集索引。主角已從品牌物件變成版本治理與方法論。
- 快照：`screenshots/v002/poster.svg`
- 風險：目前快照是生成式 poster snapshot，不是真實瀏覽器截圖；後續最好補自動化 capture pipeline。
- 下一個最佳方向：v003 可以探索 museum monograph，讓版本之間出現更強的紙本展覽感與搜尋瀏覽能力。

## 2026-03-26 / v003-museum-monograph

- 動作：新增第三個不可覆蓋版本，把實驗室翻成策展型案例敘事，而不是繼續沿用 editorial 版骨架。
- Visual thesis：dark reading room + framed specimen case + curator labels。
- Content plan：hero curator note -> exhibition plates -> specimen register -> study room / version wall。
- Interaction thesis：
  - 左側固定 rail 提供頁內 wayfinding，避免 museum 版只剩氣氛沒有方向。
  - 3D 場景被框成 exhibit case，維持主展件地位但不再搶走整頁。
  - 版本 lineage 被直接放進 study room，讓切換與比較不只存在於外層 dock。
- 為何它明顯不同：v001 是 cinematic launch，v002 是 editorial index，v003 則是案例深讀與策展式展示；閱讀姿態從「看海報」與「翻帳冊」變成「看展件與館藏卡」。
- 研究轉譯：
  - three.js responsive manual -> 延續受控 pixel ratio 與 responsive resize discipline。
  - W3C in-page navigation + NN/g menu checklist -> 加入全域 skip link 與版本內固定章節 rail。
  - Carbon typography strategies -> 讓 display / label / body 的層級更像 monograph，而不是 feature grid。
  - Apple reduce motion -> 場景動勢收斂成 gallery drift。
- 快照：`screenshots/v003/poster.svg`
- 風險：目前頁內 version wall 仍是 route link，不是即時 compare mode；真實瀏覽器快照管線也還沒建立。
- 下一個最佳方向：v004 應該探索 searchable archive browser 或 instrument dashboard，開始處理版本數量成長後的檢索問題。

## 2026-03-26T21:52:10+08:00 / Archive Browser Upgrade

- 動作類型：improve version-switching UX + improve metadata/comparison tools。
- Thesis：在版本數仍少的階段保留直接 tabs，但同步補上 searchable archive 與 nearby compare，讓實驗室開始具備「可切換、可檢索、可對照」的基本研究能力。
- Sources consulted：
  - WAI-ARIA APG tabs example
  - Carbon search component
  - Carbon disclosures pattern
  - Baymard comparison UX research
- Principles extracted：
  - tabs 採 manual activation，避免方向鍵巡覽時就觸發整頁重建。
  - 小型版本庫先用 active search，不急著堆複雜 filter。
  - overlay / disclosure 型 browser 開啟後把焦點送到搜尋欄，並允許 `Esc` 關閉。
  - compare 在手機上用摘要卡，不用 full table。
- Implementation summary：
  - 把 manifest 擴充成可比較的 metadata schema，新增 `sourceFamiliesConsulted`、`bestFor`、`keyTraits`、`navigationModel`、`motionLanguage`、`narrativeStructure`、`sceneTreatment`。
  - 重寫外層 lab shell，改成 `toolbar + tabs + archive browser drawer`，並加入 search、目前版本摘要與前後相鄰版本 compare。
  - 強化驗證腳本，正式檢查新 metadata schema、狀態值與檔案存在性。
- Validation results：
  - `npm run lab:validate`：通過，驗證 3 個 lab versions。
  - `npm run build`：通過，Vite production build 成功。
  - 目前 repo 沒有 typecheck、lint、tests、screenshot generation 或 perf scripts 可執行。
- Risks：
  - compare 目前仍是 metadata summary，不是真實 section-by-section 並排預覽。
  - `screenshots/` 仍是 poster asset，不是真實瀏覽器擷取。
  - 生產 bundle 約 607 kB（未 gzip 前 JS），後續版本增長時需留意 dock 與 scene code 的體積。
- Next likely direction：
  - 補真實 screenshot pipeline，讓 archive browser 能顯示可靠縮圖。
  - 或直接做 `v004`，把 version browser 內化為首頁主敘事，而不只是一個外層工具。

## 2026-03-26T22:39:00+08:00 / Preview Provenance Upgrade

- 動作類型：improve metadata / screenshots / comparison tools。
- Thesis：在真實 browser screenshot pipeline 尚未落地前，先把 preview 資產的 provenance、fidelity 與部署可達性說清楚，避免實驗室繼續把概念海報誤當成截圖證據。
- Sources consulted：
  - W3C WebDriver Screen Capture
  - Playwright screenshot assertions
  - Vite static asset handling
- Principles extracted：
  - screenshot 與概念預覽必須分型標示，不能只留一個 `screenshotPaths` 欄位就假定意義一致。
  - preview asset 必須進入 build graph，否則 manifest 裡的路徑只是 repo 內存在，對部署後使用者不可見。
  - compare panel 應同時顯示 visual preview 與其 provenance，讓使用者知道自己比較的是概念海報還是真實截圖。
- Implementation summary：
  - manifest 新增 `previewArtifacts`、`snapshotReadiness`、`snapshotNotes`，為每個現有版本補上預覽來源說明。
  - app shell 透過 Vite `import.meta.glob()` 把 `screenshots/` 納入 build graph，並在 version browser / compare summary 直接顯示 preview thumb 與來源標籤。
  - 補齊 validator，正式檢查 preview artifact schema 與 `screenshotPaths` 對應關係；README 也加上 provenance 說明。
- Validation results：
  - `npm run lab:validate`：通過，驗證 3 個 lab versions 與 preview artifact schema。
  - `npm run build`：通過，production bundle 成功，JS 約 620.85 kB、CSS 約 58.68 kB（未 gzip 前）。
  - build 後確認 `screenshots/` 預覽已被 Vite 納入 bundle，而不是只存在 repo。
  - 嘗試以本地 HTTP listener + Safari WebDriver 建立真實截圖流程，但 sandbox 阻止 bind port，因此這輪只能標記為 `preview-only`。
- Risks：
  - 目前仍沒有真正的瀏覽器快照，只是把概念海報的語意說清楚並納入部署。
  - `previewArtifacts` 仍需手動維護；未來若版本數快速增加，最好再補生成或 capture pipeline。
  - 目前 SVG 預覽是跟著 app bundle 一起進 JS；若後續換成更多或更大的 screenshot，必須改成獨立資產輸出。
- Next likely direction：
  - 若環境允許本地 browser automation，優先補真實 screenshot capture。
  - 否則下一版可做 `v004`，探索更工具化或 dashboard 型的作品集語言。

## 2026-03-26T22:07:36+08:00 / Navigator Compare Shell Polish

- 動作類型：improve version-switching UX。
- Thesis：把共享 navigator 從「可切換」推進到「可辨識、可搜尋、可快速比較」，但不新增新版本，先把 archive shell 做成穩定基礎。
- Sources consulted：
  - W3C consistent navigation
  - Carbon UI shell header
  - GitHub Command Palette docs
  - three.js disposal guide
- Principles extracted：
  - current version 必須在全域 UI 中持續可見，而不是只存在於 drawer 內。
  - 搜尋索引要覆蓋 version id、slug、concept、style family、traits、best-for，才能支援版本數成長。
  - nearby compare 先用摘要卡，比 full side-by-side 更適合目前版本量與手機情境。
  - compare / search shell 升級不能犧牲 version switch 時的 scene cleanup。
- Implementation summary：
  - 重寫 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，加入 current-version capsule、metadata-rich browser card、`compare` query param、nearby compare pills 與 Enter-to-open 搜尋流程。
  - 擴充 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/style.css`](/Users/kelvinlau/Desktop/Repo/Threejs/src/style.css) 的共享 navigator 樣式，補上桌機 header、手機 bottom sheet、compare panel 與 status/trait badge。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json) 的 lab switcher metadata，標記為 `hybrid-browser-compare`。
- Validation results：
  - `npm run build`：通過。
  - `npm run lab:validate`：通過。
  - 已確認既有 Hosted URL 可開啟：`https://okok147.github.io/Threejs/`
  - 目前 repo 仍沒有 typecheck、lint、tests、browser screenshot 或 perf automation 可執行。
- Risks：
  - compare 目前仍是 metadata summary，不是真實 section-level preview。
  - tabs 尚未補完整 roving-focus / manual-activation 鍵盤行為。
  - browser UI 已升級，但尚未有自動化方式驗證手機導覽互動。
- Next likely direction：
  - `v004` 可探索 instrument dashboard / archive browser，把 comparison 與 screenshot preview 變成首頁主敘事。
  - 或先補真實 screenshot pipeline，讓 archive browser 能顯示可靠縮圖與 compare thumbnail。

## 2026-03-27T08:58:09+08:00 / Release Truth Upgrade

- 動作類型：improve deployment / release reliability。
- Thesis：把共享 lab shell 補成「設計狀態」與「發布狀態」分離的 registry，讓 hosted URL、live verification 與 local worktree 的差異都被明確說出來。
- Sources consulted：
  - repo 內的 `.github/workflows/deploy.yml`
  - 現有 `version-manifest.json` 與 shared browser shell
  - GitHub Pages hosted URL 可達性檢查
- Principles extracted：
  - `stable` 只能描述版本設計成熟度，不能代替 release truth。
  - hosted URL 與 live verification 時間需要進 manifest，避免 UI 只有外部連結沒有證據語境。
  - URL 可達不代表本地工作樹已部署；若本輪未 push / deploy，就必須維持 `local-only`。
- Implementation summary：
  - 在 `version-manifest.json` 補上 lab-level `hostedUrl`、`releaseStatus`、`releaseNotes`、`lastLiveVerificationAt`、`liveVerificationNotes`，並為每個版本新增 `releaseStatus` 與 `releaseNotes`。
  - 擴充 `scripts/validate-lab.mjs`，正式驗證 lab release metadata、version release metadata 與 `defaultVersion` 是否真的有註冊。
  - 更新 shared browser shell，讓 toolbar、browser meta、compare card 與 version card 都直接顯示 release truth，而不是只顯示 `status` 與 preview readiness。
  - README 與 research notes 同步補上 release truth 原則，避免後續 run 再把 live URL 誤當成已發布證據。
- Validation results：
  - `npm run lab:validate`：通過，已驗證 3 個 lab versions 與新的 release metadata schema。
  - `npm run build`：通過，production bundle 成功，JS 約 624.77 kB、CSS 約 59.54 kB（未 gzip 前）。
  - 目前 repo 仍沒有 typecheck、lint、tests、browser screenshot 或 perf automation 可執行。
- Release results：
  - 已完成本地 commit，本輪尚未 push，也未觸發 GitHub Pages deploy。
  - 依 repo 與 hosted URL 證據，當前狀態應標記為 `committed-not-pushed`，不能宣稱 `deployed-production` 或 `live-verified`。
- Live verification results：
  - GitHub Pages URL `https://okok147.github.io/Threejs/` 可達。
  - 但 hosted page 仍未反映這份本地工作樹的最新 lab shell，因此不能標成 `deployed-production` 或 `live-verified`。
- Next likely direction：
  - 若網路與權限允許，下一步應在 commit / push 後再次核對 hosted HTML 與 deploy 結果，讓 releaseStatus 從 `local-only` 真實推進。

## 2026-03-27T09:03:21+08:00 / Manual Activation Tab Completion

- 動作類型：improve version-switching UX。
- Thesis：把共享 quick switcher 從「看起來像 tabs」補成真正可用的 manual-activation tabs，避免鍵盤使用者只能停在目前版本，卻無法直接切換。
- Sources consulted：
  - repo 內既有 `research/version_journal.md` 的 tabs/manual-activation 原則
  - 當前 `src/main.js`、`src/style.css` 與 `version-manifest.json` 的 navigator/release metadata
- Principles extracted：
  - active version 應維持 `aria-selected`，方向鍵只移動 focus，不應立即觸發整頁版本重建。
  - quick switcher 需要 roving `tabIndex`、`Home` / `End`、`Enter` / `Space`，才能符合 keyboard-first 版本切換。
  - tablist 應清楚關聯單一 version panel，並對輔助科技揭露鍵盤操作模型。
- Implementation summary：
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，加入 quick switcher roving focus、方向鍵巡覽、`Home` / `End` 快速移動，以及 `Enter` / `Space` 手動啟用版本。
  - 為 tabs 與共享 panel 補上 `id`、`aria-controls`、`aria-labelledby`，並加入供輔助科技使用的 hidden keyboard hint。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/style.css`](/Users/kelvinlau/Desktop/Repo/Threejs/src/style.css) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json)，把 switcher metadata 明確標記為 `hybrid-browser-compare-manual-tabs`。
- Validation results：
  - `npm run lab:validate`：通過，3 個 versions registry 仍可正確驗證。
  - `npm run build`：通過，production bundle 成功，JS 約 624.76 kB、CSS 約 59.54 kB（未 gzip 前）。
  - 目前 repo 仍沒有 typecheck、lint、tests、browser automation 或 mobile navigator smoke test 可執行。
- Release results：
  - 這輪僅完成本地驗證與本地 commit 準備，尚未推送 main，也未觸發 GitHub Pages deploy。
- Live verification results：
  - 本輪沒有新的 live verification；現有 hosted URL 仍無法代表這份本地工作樹的最新 navigator 修補。
- Risks：
  - 目前仍沒有 browser automation 來驗證 tabs、drawer 與 mobile shell 的實際鍵盤流程。
  - version browser 仍未做完整 focus trap；雖然 `Esc` 與 focus return 已存在，但 modal 行為還不算完全封閉。
- Next likely direction：
  - 若環境允許，先補最小 browser smoke test，覆蓋 tabs keyboard flow、drawer 開關與 mobile navigator 主要互動。

## 2026-03-27T11:20:41+08:00 / Navigator Testability Upgrade

- 動作類型：improve version-switching UX。
- Thesis：不再只靠手動驗證共享 navigator，而是把版本解析、manual-activation tabs、compare 合法性與 search index 抽成可測核心規則，讓後續版本增長時仍能守住切換可信度。
- Sources consulted：
  - repo 內既有 `src/main.js`、`version-manifest.json` 與前一輪 journal 的 manual-activation 原則
  - Node.js 內建 `node:test` / `node:assert` 能力（無新增外部測試框架）
- Principles extracted：
  - 共享 shell 的高風險邏輯應先抽離成 pure module，否則測試只能綁整個 DOM 與 three.js renderer。
  - tabs 的 keyboard 規則要以 intent 層測試，而不是只在事件處理器裡重複寫一次不可驗證的邏輯。
  - compare target 與初始 version resolution 屬於跨版本治理邏輯，應和畫面 rendering 分開驗證。
  - 在 browser automation 缺席的情況下，內建 test runner 是目前最強、最可持續的保護網。
- Implementation summary：
  - 新增 `src/lib/version-navigator.js`，集中管理 `resolveInitialVersion`、`resolveInitialCompareVersion`、`isValidCompareTarget`、`getVersionTabIntent`、`buildSearchIndex`、`getSuggestedCompareVersions` 與 `getCompareAxes`。
  - 簡化 `src/main.js`，改為消費上述可測邏輯，避免 shared shell 再把搜尋、compare 與 tabs 規則散落在 UI handler 裡。
  - 新增 `tests/version-navigator.test.mjs` 與 `npm test`，覆蓋版本解析、compare 驗證、manual tabs、compare suggestion、search index 與差異軸線。
  - `README.md` 補上測試入口，讓後續 run 能先用相同檢查保護 switchability。
- Validation results：
  - `npm test`：通過，7 個 navigator 核心規則測試全數通過。
  - `npm run lab:validate`：通過，3 個 versions registry 仍可正確驗證。
  - `npm run build`：通過，production bundle 成功，JS 約 625.56 kB、CSS 約 59.54 kB（未 gzip 前）。
  - 目前 repo 仍沒有 typecheck、lint、browser automation、mobile smoke test 或真實 screenshot capture 可執行。
- Release results：
  - 本輪將以本地 commit 收束，但無法在此 sandbox 內證明 push / deploy 成功。
- Live verification results：
  - 本輪沒有新的 hosted verification；既有 GitHub Pages URL 不能代表這份本地工作樹的新測試保護層已上線。
- Risks：
  - 測試目前只覆蓋 pure rules，尚未涵蓋 drawer focus trap、`Esc` 關閉後 focus return 與 mobile shell 實際互動。
  - 仍沒有 browser-level smoke test 驗證 `searchInput`、`compare panel` 與 DOM aria wiring 的整體流程。
- Next likely direction：
  - 若環境允許，下一步應補最小 browser smoke test，直接驗證 drawer 開關、focus 管理與 mobile navigator 主要互動。

## 2026-03-27T18:32:49+08:00 / Navigator Verification Gate

- 動作類型：improve universal version navigator。
- Thesis：把共享 navigator 的核心規則抽成可測純函式，並把 unit tests 與 lab registry validation 接進本地與 deploy workflow，讓版本切換回歸不再只靠手動目測。
- Sources consulted：
  - repo 內既有 `research/version_journal.md` 的 manual-activation tabs / release truth 原則
  - 目前 `.github/workflows/deploy.yml` 的 GitHub Pages 發布流程
- Implementation summary：
  - 把 `src/main.js` 內與版本初始化、compare 合法性、search index、manual-activation tabs 相關的共享規則抽到 `src/lib/version-navigator.js`，讓 UI shell 與規則判斷分離。
  - 新增 `tests/version-navigator.test.mjs`，用 Node 內建 test runner 覆蓋初始版本解析、compare target 驗證、manual-activation intent、鄰近 compare 建議與 search index 組裝。
  - `package.json` 新增 `npm test` 與 `npm run lab:check`；GitHub Pages workflow 在 build 前先跑 `npm test` 與 `npm run lab:validate`，避免共享 navigator regression 直接進部署路徑。
  - `README.md` 與 `version-manifest.json` 同步更新目前的檢查入口與 release truth 描述。
- Validation results：
  - `npm test`：通過，7 個 navigator 單元測試全部成功。
  - `npm run lab:validate`：通過，3 個 lab versions registry 驗證成功。
  - `npm run build`：通過，production bundle 成功，JS 約 625.58 kB、CSS 約 59.54 kB（未 gzip 前）。
- Release results：
  - 這輪只完成本地驗證與 release gate 調整，尚未推送 main，也未觸發 GitHub Pages deploy。
- Live verification results：
  - 本輪沒有新的 live verification；仍只有先前確認的 hosted URL 可達證據，不能代表這份最新工作樹已上線。
- Risks：
  - 目前測試仍停在 pure logic 層，尚未覆蓋 drawer focus management、mobile navigator 與實際 DOM 鍵盤流程。
  - deploy workflow 現在會擋 manifest 與 navigator regression，但還沒有真實 screenshot 或 browser smoke tests。
- Next likely direction：
  - 若環境允許 browser automation，補最小 e2e smoke test，優先覆蓋 tabs keyboard flow、browser drawer 開關與 mobile shell。

## 2026-03-27T20:35:09+08:00 / Browser Dialog Focus Governance

- 動作類型：improve universal version navigator。
- Thesis：把 version browser 從「能打開的 drawer」補成真正的 modal dialog，讓焦點不再漏到背景，並把 open/close / focus trap 規則納入可測保護層。
- Sources consulted：
  - WAI-ARIA APG modal dialog pattern
  - MDN `inert` global attribute
  - repo 內既有 manual-activation tabs / release truth journal 原則
- Principles extracted：
  - modal dialog 開啟後，`Tab` / `Shift+Tab` 必須在 dialog 內循環，不能穿透到底層頁面。
  - dialog 關閉後要把焦點回送到觸發來源，維持使用者的 point of regard。
  - `aria-modal` 不是視覺宣告而已；背景內容也需要真的進入 inert / hidden 狀態，避免 modal 邏輯與實際互動不一致。
- Implementation summary：
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/browser-dialog.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/browser-dialog.js)，抽出 shared browser drawer 的 open/close、focus trap、background inert/aria-hidden 與 focus return 控制邏輯。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，把 browser panel 改接新 controller，並補上 dialog 的 `aria-labelledby` / `aria-describedby` 關聯。
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/browser-dialog.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/browser-dialog.test.mjs)，用 Node 內建 test runner 驗證 open/close 狀態同步、Tab 循環、`Escape` 關閉與 focus return。
- Validation results：
  - `npm test`：通過，10 個測試全部成功；新增 browser dialog 焦點治理覆蓋。
  - `npm run lab:validate`：通過，3 個 lab versions registry 驗證成功。
  - `npm run build`：通過，production bundle 成功，JS 約 627.45 kB、CSS 約 59.54 kB（未 gzip 前）。
- Release results：
  - 這輪僅完成本地驗證與本地 commit 準備，尚未推送 main，也未觸發 GitHub Pages deploy。
- Live verification results：
  - 本輪沒有新的 hosted verification；既有 Pages URL 不能代表這份最新 drawer accessibility 修補已上線。
- Risks：
  - 目前仍是 Node-level dialog smoke tests，不是真實瀏覽器或行動裝置上的完整 keyboard / screen reader 驗證。
  - 背景 inert 已補上，但尚未有 browser automation 驗證不同瀏覽器對 `inert` 與 dialog aria 行為的一致性。
- Next likely direction：
  - 若環境允許 browser automation，下一步應補最小 e2e smoke test，直接驗證 drawer 開關、focus trap、`Escape` 關閉與 mobile shell 主要互動。

## 2026-03-27T20:37:46+08:00 / Navigator UI Smoke Coverage

- 動作類型：improve universal version navigator。
- Thesis：把共享 navigator 的保護層從 dialog controller 再往前推一格，直接覆蓋 quick-switcher tabs、search submit、keyboard shortcut 與失效觸發節點的 fallback focus，避免 shared UI wiring 只能靠手動目測。
- Sources consulted：
  - repo 內既有 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js) navigator wiring
  - repo 內既有 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/browser-dialog.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/browser-dialog.js) dialog controller
  - 先前 journal 已整理的 manual-activation tabs / modal dialog 原則
- Principles extracted：
  - browser automation 缺席時，shared UI wiring 仍應抽成可測 helper，而不是把 tabs / shortcut / search 規則埋在事件 handler 裡。
  - dialog 關閉時不能盲目信任開啟時記住的 trigger；若節點已脫離 DOM，必須回退到穩定的 toggle/fallback focus。
  - manual-activation tabs 的 DOM wiring 應同時驗證 roving `tabIndex` 與「方向鍵只移動 focus、Enter 才啟用」兩件事。
- Implementation summary：
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator-ui.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator-ui.js)，抽出 quick-switcher tabs、search submit、keyboard shortcut 與 typing-target 判斷的共享 UI helper。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，改由新 helper 管理 tabs roving state、search Enter submit 與全域 drawer shortcut。
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/version-navigator-ui.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/version-navigator-ui.test.mjs)，覆蓋 tabs、search submit 與 shortcut 行為；並更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/browser-dialog.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/browser-dialog.test.mjs) 驗證失效 trigger 會 fallback 回穩定焦點。
  - 修正 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/browser-dialog.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/browser-dialog.js)，關閉 dialog 時會重新驗證 restore target 是否仍可聚焦，否則回退到 toggle。
- Validation results：
  - `npm test`：通過，15 個測試全部成功；包含 dialog + shared UI smoke coverage。
  - `npm run lab:validate`：通過，3 個 lab versions registry 驗證成功。
  - `npm run build`：通過，production bundle 成功，JS 約 628.35 kB、CSS 約 59.54 kB（未 gzip 前）。
- Release results：
  - 已完成本地 commit，並嘗試執行 `git push origin main`。
  - `git push origin main` 失敗：sandbox 無法解析 `github.com`，因此未推送 main，也未觸發 GitHub Pages deploy。
- Live verification results：
  - 本輪沒有新的 hosted verification；既有 Pages URL 不能代表這份最新 navigator smoke coverage 已上線。
- Blocker：
  - sandbox DNS 無法解析 `github.com`，目前無法從這個環境完成 push / deploy。
- Risks：
  - 目前仍是 Node-level smoke tests，不是真實瀏覽器或行動裝置上的完整 keyboard / screen reader 驗證。
  - 仍未涵蓋 compare panel 與 mobile shell 的實際 DOM/browser 互動。
- Next likely direction：
  - 若環境允許 browser automation，下一步應補最小 e2e smoke test，優先覆蓋 tabs keyboard flow、drawer 開關、compare panel 與 mobile shell。

## 2026-03-27T22:54:05+08:00 / v004-instrument-deck

- 動作類型：create one new version。
- Thesis：把 version browser 的邏輯直接拉進首頁主敘事，讓「掃描模式、判斷狀態、再進入版本」本身成為新的閱讀姿態，而不是再做一個外層切換工具。
- Theme world：telemetry console / instrument deck。
- 為何它明顯不同：
  - visual language 從 museum exhibit 轉成冷色監測台與 scanline scope。
  - layout system 從雙軸 monograph 改成三欄 operator console + registry rows。
  - navigation model 從 curator rail 改成 sticky command header 與 mode registry。
  - narrative structure 從案例深讀改成 operator command -> verification log -> signal library。
  - scene treatment 從 framed exhibit case 改成 scoped live well 內的 telemetry core。
- Sources / inspiration families consulted：
  - repo 內既有 official three.js documentation principles
  - repo 內既有 official design systems / typography guidance
  - repo 內既有 accessibility / dialog-navigation research
  - curated telemetry dashboard inspiration
- Implementation summary：
  - 整合工作樹中已存在的 [`/Users/kelvinlau/Desktop/Repo/Threejs/versions/v004-instrument-deck/index.js`](/Users/kelvinlau/Desktop/Repo/Threejs/versions/v004-instrument-deck/index.js)、[`/Users/kelvinlau/Desktop/Repo/Threejs/versions/v004-instrument-deck/styles.css`](/Users/kelvinlau/Desktop/Repo/Threejs/versions/v004-instrument-deck/styles.css)、[`/Users/kelvinlau/Desktop/Repo/Threejs/tokens/v004.json`](/Users/kelvinlau/Desktop/Repo/Threejs/tokens/v004.json) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/screenshots/v004/poster.svg`](/Users/kelvinlau/Desktop/Repo/Threejs/screenshots/v004/poster.svg)。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)、[`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/scene.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/scene.js) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/data/site-content.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/data/site-content.js)，把 v004 renderer、scene preset 與 feature track 接回 shared lab。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/README.md`](/Users/kelvinlau/Desktop/Repo/Threejs/README.md)，正式註冊第四個版本並把 defaultVersion 切到 `v004`。
- Validation results：
  - `npm test`：通過，15 個 shared navigator / dialog / tabs tests 全數成功。
  - `npm run lab:validate`：通過，已驗證 4 個 lab versions。
  - `npm run build`：通過，production bundle 成功，JS 約 644.32 kB、CSS 約 72.39 kB（未 gzip 前）。
- Release results：
  - 已完成本地 commit：`fb1766c` (`Add v004 instrument deck`)。
  - `git push origin main` 失敗：sandbox 無法解析 `github.com`，因此未推送 main，也未觸發 GitHub Pages deploy。
- Live verification results：
  - 本輪沒有新的 live verification；既有 GitHub Pages URL 仍不能代表這份 v004 工作樹已上線。
- Risks：
  - 目前仍只有概念海報 preview，沒有真實瀏覽器快照。
  - 共享 navigator 有 Node-level 測試，但沒有 browser-level smoke test 覆蓋 mobile shell 與實際 DOM 互動。
- Next likely direction：
  - 若環境允許 browser automation，優先補最小 e2e smoke test，驗證 v004 成為 default 後的 tabs、drawer、compare 與 mobile shell 行為。

## 2026-03-27T23:25:58+08:00 / Hosted HTML Release Fingerprint

- 動作類型：improve deployment / release reliability。
- Thesis：把 lab-level HTML metadata 與 release fingerprint 同步進 manifest、`index.html` 與 validator，讓 hosted 原始 HTML 有可比對的版本指紋，而不是只剩手寫 release notes。
- Sources consulted：
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/index.html`](/Users/kelvinlau/Desktop/Repo/Threejs/index.html)
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json)
  - hosted GitHub Pages URL `https://okok147.github.io/Threejs/` 的目前可觀測頁面標題
- Principles extracted：
  - deployment truth 不該只靠 app hydration 後的 UI 敘述；原始 HTML 也需要暴露足夠的 lab metadata，讓 hosted state 可直接比對。
  - `title`、`description` 與 release fingerprint 若沒有與 manifest 綁定，很容易讓部署後仍殘留舊單版本語境。
  - validator 必須直接檢查 `index.html` 與 manifest 的對齊，否則 release truth 仍會退化成手動約定。
- Implementation summary：
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/release-fingerprint.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/release-fingerprint.js) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/scripts/sync-html-metadata.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/scripts/sync-html-metadata.mjs)，用 `defaultVersion|releaseStatus|lastUpdated` 產生穩定的 lab release fingerprint。
  - 擴充 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json) 的 `lab.htmlTitle`、`lab.htmlDescription` 與 `lab.releaseFingerprint`，並同步更新 live verification notes。
  - 讓 [`/Users/kelvinlau/Desktop/Repo/Threejs/scripts/validate-lab.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/scripts/validate-lab.mjs) 直接檢查 `index.html` 的 `<title>`、`description`、`lab-default-version`、`lab-release-status`、`lab-last-updated` 與 `lab-release-fingerprint`。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/style.css`](/Users/kelvinlau/Desktop/Repo/Threejs/src/style.css)，在 shared browser meta 直接顯示預期 HTML title 與 fingerprint。
- Validation results：
  - `npm run lab:sync-html`：通過，已同步 manifest 與 `index.html` 的 lab metadata。
  - `npm test`：通過，16 個 tests 全數成功，包含新的 fingerprint utility test。
  - `npm run lab:validate`：通過，4 個 lab versions 與 HTML metadata 對齊檢查全部成功。
  - `npm run build`：通過，production bundle 成功；`dist/index.html` 內含新的 fingerprint metadata，JS 約 644.93 kB、CSS 約 72.81 kB（未 gzip 前）。
- Live verification results：
  - 2026-03-27 觀測 hosted URL 時，頁面標題仍是舊的 Cinematic 單版本標題，顯示目前線上頁面尚未跟上這份本地工作樹。
- Risks：
  - 目前 release fingerprint 只保證本地 manifest 與 `index.html` 對齊；真正的 hosted update 仍要等 push / deploy 成功。
  - sandbox 內仍無法從 repo 腳本直接對外抓 hosted HTML，因此 live verification 仍需依賴外部觀測結果。
- Next likely direction：
  - 若網路限制解除，優先 push 最新 commit，然後重新核對 hosted HTML title 與 release fingerprint 是否和本地 manifest 一致。

## 2026-03-27T23:42:35+08:00 / v005-tidal-atlas

- 動作：新增第五個不可覆蓋版本，從操作型控制台轉向潮汐圖譜與海圖桌語言，完成一個新的 style world 與 art direction。
- Visual thesis：tidal atlas + illuminated archive + bathymetric light case。
- Content plan：chart preface -> current routes -> soundings -> beacon room。
- Interaction thesis：
  - hero 改成單一 chart window，3D 核心像被封存在海圖光盒裡，而不是佔滿整頁舞台。
  - 版本列表被改寫成 route bands，切換版本時像選擇航道與閱讀方向，而不是切 mode row。
  - 方法、UX 與效能紀錄被翻成 sounding sheets 與 annotation corridor，讓資訊層級跟主題世界一致。
- 為何它明顯不同：v004 是控制台與 verification log 的操作介面；v005 則把同一份實驗室翻成導航型長頁，主視覺、版面骨架、敘事順序、互動語氣與 3D 呈現都轉為 cartographic / atlas 語境。
- 研究轉譯：
  - NOAA Nautical Chart Manual -> 控制 landmark 密度，讓 contours、route marks 與關鍵 annotation 有主從，而不是堆滿 nautical 裝飾。
  - three.js responsive manual -> 維持 bounded chart window 的 renderer resize 與 pixel ratio discipline。
  - W3C in-page navigation -> 用固定 header 與清楚 anchor 讓 atlas 式長頁仍保有方向感。
  - Apple reduce motion -> 把 tidal drift 與 beacon pulse 收斂到 reduced-motion 可接受的節奏。
- 快照：`screenshots/v005/poster.svg`
- 驗證：
  - `npm run lab:sync-html`
  - `npm test`
  - `npm run lab:validate`
  - `npm run build`
- 風險：目前快照仍是概念 poster，不是真實瀏覽器截圖；此外這份最新 v005 工作樹尚未推送 main，因此 hosted site 仍停留在上一個已部署版本。
- 下一個最佳方向：先把這輪 commit 推上 main 並核對 hosted HTML fingerprint；若部署成功，再補最小 browser screenshot / smoke test 來替 v005 留下更可信的視覺證據。

## 2026-03-28T09:19:36+08:00 / Navigator History State Sync

- 動作類型：improve universal version navigator。
- Thesis：把 shared navigator 從「只會改 query string」補成真正受 URL / history 驅動的切換器，讓版本與 compare 狀態能被瀏覽器前進 / 返回忠實重播，而不是只在單次 render 裡成立。
- Sources consulted：
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js) 的現有 navigator wiring
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator.js) 與既有 `tests/` 保護層
  - 既有 journal 內的 manual-activation tabs / release truth 原則
- Principles extracted：
  - 版本切換若暴露 `?v=` / `?compare=`，就不能只有 shareable-looking URL；history stack 也必須能回放同一組狀態。
  - 初始載入應用 `replace` 做 canonicalization，但使用者明確切換版本或 compare 時應建立新的 history entry。
  - `popstate` 重播不能回頭讀 localStorage 決策，應以當前 URL 為準，否則返回行為會被本地偏好覆蓋。
  - deployment truth 需要避免過時斷言；若本輪無法重新驗證 hosted site，就必須把線上觀測寫成帶時間戳的最後已知狀態。
- Implementation summary：
  - 擴充 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator.js)，新增 `resolveNavigatorRouteState()` 與 `buildNavigatorUrl()`，集中管理 URL -> navigator state 與 canonical URL 組裝。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，讓初始 render 使用 `replace` 正規化 URL、使用者切換版本/compare 時改用 `pushState`，並補上 `popstate` 重播。
  - 擴充 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/version-navigator.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/version-navigator.test.mjs)，覆蓋 route-state 正規化、compare 清理、query/hash 保留與 canonical URL 組裝。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json) 與 [`/Users/kelvinlau/Desktop/Repo/Threejs/index.html`](/Users/kelvinlau/Desktop/Repo/Threejs/index.html)，把 lab release truth 降回 `committed-not-pushed`，並把 live note 改寫成「最後一次已知觀測」而非當前線上斷言。
- Validation results：
  - `npm test`：通過，18 個 tests 全數成功。
  - `npm run lab:sync-html`：通過，已同步最新 `releaseFingerprint` 到 `index.html`。
  - `npm run lab:check`：通過，串起 `npm test`、`npm run lab:validate` 與 `npm run build`；目前驗證 5 個 versions，production bundle 為 JS 約 664.63 kB、CSS 約 86.60 kB（未 gzip 前）。
- Release results：
  - 已嘗試執行 `git push origin main`。
  - push 失敗：sandbox DNS 無法解析 `github.com`，因此本輪最高真實狀態仍是 `committed-not-pushed`。
- Live verification results：
  - 本輪無法重新抓取 hosted URL；因此沒有新的 live verification。
  - 目前只保留最後一次已知觀測：2026-03-27T23:37:13+08:00 的 hosted page 尚未反映當時的 v005 工作樹。
- Risks：
  - 新增的是 browser history state correctness，不是真實瀏覽器自動化；仍缺少 browser-level smoke test 驗證不同瀏覽器對 back/forward、focus 與 compare 的整體互動。
  - hosted site 目前狀態未知；直到網路限制解除前，都不能宣稱這輪 shared navigator 已上線。
- Next likely direction：
  - 若網路限制解除，先 push 這輪 commit 並重新核對 hosted HTML fingerprint。
  - 之後再補最小 browser smoke test，直接驗證 back/forward、compare panel 與 mobile shell。

## 2026-03-28T11:14:15+08:00 / Route-Effective Release Truth

- 動作類型：improve deployment / release reliability。
- Thesis：shared navigator 不應再把 `version.releaseStatus` 直接當成整體 route truth；當版本條目比 shared lab shell 更超前時，UI 必須自動降到較低的有效發布狀態，避免本地未推送的 shell 被錯看成已推送版本。
- Sources consulted：
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json) 的 lab-level / version-level release metadata
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js) 的 shared navigator rendering
  - repo 內既有 release truth journal 與 validator/fingerprint 結構
- Principles extracted：
  - 對使用者可見的 release badge 應描述「目前這條 route 的真實狀態」，而不是只描述某個版本條目的歷史狀態。
  - shared lab shell 與 version entry 的發布真實度若不一致，整體 route 必須以較低狀態為準。
  - `blocked` 應優先蓋過其他 release label，因為任何單層受阻都足以讓整體 route 失真。
  - deployment truth 的補強要進 shared metadata 與 shared UI，而不是逐版手改文案。
- Implementation summary：
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/release-truth.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/release-truth.js)，集中計算 lab shell 與 version entry 之間的有效發布狀態與限制層。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，讓 toolbar、browser meta、compare card 與 browser card 都顯示 route-effective release truth，並在詳細區塊同時揭露 version entry / shared lab shell 的原始狀態。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-navigator.js)，把 effective release status 也納入搜尋索引，避免搜尋與 UI 呈現使用不同 truth model。
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/release-truth.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/release-truth.test.mjs)，覆蓋 aligned、lab-limited、version-limited 與 blocked 四種 shared release truth 情境。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json)，記錄這輪 route-effective release truth 調整與新的 lab `lastUpdated` / `releaseFingerprint`。
- Validation results：
  - `npm test`：通過，22 個 tests 全數成功，包含新的 shared release truth 規則。
  - `npm run lab:validate`：通過，5 個 versions registry 與 HTML metadata schema 仍然有效。
  - `npm run build`：通過，production bundle 成功；JS 約 666.71 kB、CSS 約 86.60 kB（未 gzip 前）。
- Release results：
  - 已建立本地 commit：`a60d10d Clarify effective route release truth`。
  - 已嘗試執行 `git push origin main`，但 sandbox DNS 無法解析 `github.com`，因此 push 失敗；本輪最高真實狀態仍是 `committed-not-pushed`。
- Live verification results：
  - 本輪沒有新的 hosted verification。
  - 仍只保留最後一次已知觀測：2026-03-27T23:37:13+08:00 的 hosted page 尚未反映當時的 v005 工作樹。
- Risks：
  - 這輪補的是 release truth 呈現與 shared rule，不是實際 push / deploy；線上狀態依然未知。
  - compare / browser cards 現在會顯示更保守的 route truth，但仍沒有 browser-level smoke test 驗證各 viewport 下的完整 DOM 互動。
- Next likely direction：
  - 若網路限制解除，先把目前本地 commit 推上 main，再重新核對 hosted HTML fingerprint 與 route-effective release badge 是否一致。
  - 若網路限制仍存在，下一步就補最小 browser smoke test，讓 shared navigator 的 compare / mobile shell 也有更接近真實互動層的保護網。

## 2026-03-28T14:00:41+08:00 / Idempotent HTML Metadata Sync

- 動作類型：improve deployment / release reliability。
- Thesis：`lab:sync-html` 不應在每次執行時持續把 `<meta>` 行往右推，因為 release metadata 同步器若不冪等，就會讓 daily run 無端產生 drift，削弱發布真實度與工作樹可信度。
- Sources consulted：
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/scripts/sync-html-metadata.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/scripts/sync-html-metadata.mjs) 的現有 HTML metadata 同步流程
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/index.html`](/Users/kelvinlau/Desktop/Repo/Threejs/index.html) 已出現的 meta 行縮排漂移
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/`](/Users/kelvinlau/Desktop/Repo/Threejs/tests) 既有 Node test 保護方式
- Principles extracted：
  - release / deployment metadata 的同步器必須可重跑且不產生額外 diff，否則 daily automation 會被自己的工具污染。
  - HTML metadata 的字串替換若會保留舊行前空白，就應先正規化整行，再寫入標準縮排。
  - 這種 shared reliability 修補必須進可測 helper，而不是把 regex 細節留在 side-effect script 裡難以回歸驗證。
- Implementation summary：
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/lab-html-metadata.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/lab-html-metadata.js)，集中處理 lab HTML metadata 的同步與 fingerprint 回傳，並把 `<meta>` 行替換改成整行正規化。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/scripts/sync-html-metadata.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/scripts/sync-html-metadata.mjs)，改為使用共享 helper，避免 script 本體再持有難測的替換邏輯。
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/lab-html-metadata.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/lab-html-metadata.test.mjs)，覆蓋漂移縮排正規化與 repeated sync idempotence。
  - 重新同步 [`/Users/kelvinlau/Desktop/Repo/Threejs/index.html`](/Users/kelvinlau/Desktop/Repo/Threejs/index.html)，把 lab meta 行還原為穩定的四空格縮排。
- Validation results：
  - `npm test`：通過，24 個 tests 全數成功，包含新的 HTML metadata idempotence 回歸測試。
  - `npm run lab:sync-html`：連續執行兩次後，`index.html` 的 SHA1 皆為 `98d8754a624ebd0ff94cb829d657f52212b46533`，確認同步器重跑不再產生新 diff。
  - `npm run lab:validate`：通過，5 個 versions registry 與 HTML metadata schema 仍然有效。
  - `npm run build`：通過，production bundle 成功；JS 約 666.74 kB、CSS 約 86.60 kB（未 gzip 前）。
- Release results：
  - 已建立本地 commit：`20e8346 Make lab HTML sync idempotent`。
  - 已嘗試執行 `git push origin main`，但 sandbox DNS 無法解析 `github.com`，因此 push 失敗；本輪最高真實狀態仍是 `committed-not-pushed`。
- Live verification results：
  - 本輪沒有新的 hosted verification。
  - 仍只保留最後一次已知觀測：2026-03-27T23:37:13+08:00 的 hosted page 尚未反映當時的 v005 工作樹。
- Risks：
  - 這輪修的是 metadata 同步器的冪等性，不是實際 deploy；線上頁面是否已更新仍未知。
  - 目前仍缺少 browser-level smoke test，無法直接驗證 navigator 與 browser dialog 在真實 viewport 下的整體互動。
- Next likely direction：
  - 若網路限制解除，先 push 目前累積的本地 commits，並重新核對 hosted HTML fingerprint。
  - 若網路限制仍存在，優先補最小 browser smoke test，覆蓋 tabs、history 與 browser dialog 的真實互動層。

## 2026-03-28T15:04:15+08:00 / Auto Renderer Registry

- 動作類型：improve universal version navigator。
- Thesis：version manifest 已經是註冊真相來源，shared shell 就不該再手寫 `VERSION_RENDERERS`；renderer registry 必須直接從 `entryFile` 自動建立，才能避免新增版本時 manifest 已註冊、切換器卻漏接 renderer 的靜默失配。
- Sources consulted：
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js) 的手寫 renderer registry
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json`](/Users/kelvinlau/Desktop/Repo/Threejs/version-manifest.json) 的 `entryFile` 註冊欄位
  - repo 內 [`/Users/kelvinlau/Desktop/Repo/Threejs/scripts/validate-lab.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/scripts/validate-lab.mjs) 的現有 manifest 驗證流程
- Principles extracted：
  - 版本切換器若要可持續擴充，版本 renderer 的來源必須和 manifest 註冊保持單一真相。
  - shared shell 不應要求每新增一版就手動維護第二份 version-to-renderer 對照表，否則 switchability 會先被註冊漂移擊穿。
  - validator 除了檢查檔案存在，也應確認版本 entry module 真的暴露 `renderVersion` 介面，避免 runtime 才爆出缺口。
- Implementation summary：
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-registry.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/lib/version-registry.js)，集中處理 `import.meta.glob()` module path 正規化、renderer registry 建立，以及 `renderVersion` export 偵測。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js`](/Users/kelvinlau/Desktop/Repo/Threejs/src/main.js)，移除手寫 `VERSION_RENDERERS`，改為從 `../versions/**/index.js` 自動建立 registry，並以 `manifestEntry.entryFile` 取得 renderer。
  - 更新 [`/Users/kelvinlau/Desktop/Repo/Threejs/scripts/validate-lab.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/scripts/validate-lab.mjs)，在既有檔案存在檢查外，再驗證每個 version entry file 具備 `renderVersion` export。
  - 新增 [`/Users/kelvinlau/Desktop/Repo/Threejs/tests/version-registry.test.mjs`](/Users/kelvinlau/Desktop/Repo/Threejs/tests/version-registry.test.mjs)，覆蓋 module path 正規化、自動 registry 收錄與 export 偵測。
- Validation results：
  - `npm test`：通過，27 個 tests 全數成功。
  - `npm run lab:validate`：通過，5 個 versions registry 驗證成功，且新增 renderer export 檢查。
  - `npm run build`：通過，production bundle 成功；JS 約 667.54 kB、CSS 約 86.60 kB（未 gzip 前）。
- Release results：
  - 已建立本地 commit：`13ba706 Automate version renderer registry`。
  - 已嘗試執行 `git push origin main`，但 sandbox DNS 無法解析 `github.com`，因此 push 失敗；本輪最高真實狀態仍是 `committed-not-pushed`。
- Live verification results：
  - 本輪沒有新的 hosted verification。
  - 仍只保留最後一次已知觀測：2026-03-27T23:37:13+08:00 的 hosted page 尚未反映當時的 v005 工作樹。
- Risks：
  - 這輪解決的是 manifest 與 renderer registry 的一致性，不是 browser-level 互動整合測試；history、drawer 與 mobile shell 仍主要靠目前的 unit-level 保護層。
  - shared shell 仍依賴 Vite `import.meta.glob()` 的 build-time module 收集；若未來 entry 命名慣例改變，需同步調整 glob 範圍。
- Next likely direction：
  - 若網路限制解除，先 push 目前累積的本地 commits，並重新核對 hosted HTML fingerprint。
  - 若網路限制仍存在，下一步可補最小 integration-style navigator test，直接驗證 history / compare / storage 的協同狀態切換。

## 2026-03-28T15:26:45+08:00 / v006-spectral-moth

- 動作：新增第六個不可覆蓋版本，直接轉向黑白 glitch fauna 海報語言，讓 `v006` 和前面的 atlas / dashboard / exhibition 版本有明確斷層。
- Visual thesis：monochrome dither poster + spectral moth silhouette + pixel dispersion edges。
- Content plan：specimen poster -> pack index -> decay log -> white-noise field。
- Interaction thesis：
  - hero 以單一 poster 視覺錨點主導，3D core 像正在點陣裡形成與崩解的夜蛾標本。
  - 版本切換被改寫成黑白 strips，hover 反相，讓瀏覽像掃描 field tape 而不是點卡片。
  - noise、flicker 與 dispersion 都只放在邊界與 stage 周邊，維持高張力但不讓全頁失焦。
- 為何它明顯不同：v005 是彩色 atlas / chart-window 長頁，v006 則把整個頁面改成黑底白噪海報；視覺語言、版面系統、導航模型、互動語氣與 scene treatment 都切到另一個世界。
- 研究轉譯：
  - user-provided prompt -> 把「高對比黑白 + heavy dithering + pixel dispersion + digital decay」直接變成版面和 stage 的核心條件。
  - three.js responsive manual -> 保留 full-bleed poster 下的 renderer resize 與 pixel ratio discipline。
  - W3C in-page navigation -> 即使是極端海報頁，也維持可掃描的 section anchors。
  - Apple reduce motion -> flicker pulse 與 white-noise drift 在 reduced-motion 下仍有收斂路徑。
- 快照：`screenshots/v006/poster.svg`
- 風險：目前 `v006` 仍只有概念 poster，沒有真實瀏覽器截圖；此外這輪若尚未 push，線上 hosted site 仍會停在上一個已部署版本。
- 下一個最佳方向：在 validation 通過後 push 新版本，然後直接核對 hosted HTML / bundle 是否已回傳 `v006` 指紋。

## 2026-03-28T15:41:19+08:00 / v007-chroma-parade

- 動作：新增第七個不可覆蓋版本，明確離開 orbit-led hero，改用高彩、白天、typography-driven 的 procession UI。
- Visual thesis：daylight chroma stage + layered veils + giant condensed type + afterglow archive。
- Content plan：overture stage -> procession lane -> score sheets -> afterglow archive。
- Interaction thesis：
  - hero 不再依賴中央旋轉物件，而是讓多層幕布、色帶與巨型字體一起接管第一屏。
  - 版本切換被改寫成 horizontal procession lane，閱讀節奏更像巡遊而不是列表。
  - 後段用 dark afterglow room 收束 references 與 lineage，讓頁面在強首屏之後仍保留方向感。
- 為何它明顯不同：v006 是黑白 glitch poster；v007 直接翻成高彩 daylight performance system，視覺語言、版面骨架、動態語法與敘事順序都切到另一個世界，而且主動畫不再由 orbit core 主導。
- 研究轉譯：
  - Maskatorium -> 取 layered parallax 與 horizontal scroll 的注意力交接方式，不複製其文化題材與具體構圖。
  - Haus -> 取 giant type、強對比配色與 reveal 節奏，讓少量元素也能撐起高度表演感。
  - WebKit responsive motion -> 保留 reduced-motion 路徑，避免大幅幕布與視差造成不必要刺激。
  - web.dev animation guide -> 將主要動畫壓在 transform / opacity，讓 UI 高張力但仍維持可部署效能。
- 快照：`screenshots/v007/poster.svg`
- 風險：目前 `v007` 仍只有概念 poster，尚未補真實瀏覽器截圖；此外此刻 release truth 仍要等 validation、commit、push 與 hosted verification 完成後才能升級。
- 下一個最佳方向：先跑完整 validation 與 release path，再核對 hosted HTML / bundle 是否已切到 `v007` 指紋。
