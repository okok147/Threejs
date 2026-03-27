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
