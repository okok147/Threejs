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
