# Style Notes

## 2026-03-26

### Trusted sources used

- [three.js responsive manual](https://threejs.org/manual/en/responsive.html)
- [W3C WAI in-page navigation tutorial](https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/)
- [Carbon 2x grid overview](https://carbondesignsystem.com/elements/2x-grid/overview/)
- [Apple design guidance on reduced motion](https://developer.apple.com/news/?id=g9q8j4i8)
- [NN/g menu and navigation checklist](https://media.nngroup.com/media/articles/attachments/Website_Menu_Design_Checklist.pdf)

### Principles

- 3D canvas 尺寸要跟顯示尺寸同步更新，並限制 pixel ratio；不能把解析度無限跟著裝置倍率放大。
- 長頁面要有可分享、可預測的頁內導覽與清楚標題階層，否則沉浸式版面很快會失去方向感。
- 大型作品集版面更適合用流體欄網與節奏性留白，而不是先堆卡片再補故事。
- 若動態會牽動大幅周邊移動，就一定要有 reduced-motion 收斂路徑。
- 同一頁只能有一個主導性的視覺論點；其他區塊只負責支援閱讀，不負責搶畫面。

### Anti-patterns

- 用滿版 WebGL 掩蓋資訊層級不足。
- 只有視覺驚喜，沒有版本識別與長頁導覽。
- 把所有風格語言混在同一頁，最後既不像品牌頁也不像作品集。
- 把 research 與 manifest 留在 repo 內部，導致實際體驗看不出方法論。
- 忽略 reduced-motion，讓滑動與視覺焦點不適。

### Possible style families

- Cinematic orbital narrative
- Editorial atlas / signal ledger
- Museum monograph
- Instrument dashboard
- Monochrome typography-first archive

### Possible feature ideas

- 版本搜尋器與 style family 篩選器
- 並排比較模式，直接對照兩版同一區塊
- 真實瀏覽器快照管線，自動更新 screenshots 目錄
- 版本差異摘要卡，列出 UX / visual / scene 變化

### Interaction ideas

- 版本切換時保留 dock，但內容區整體重建
- 讓 3D 場景根據 section progress 切換姿態，而不是只做背景粒子
- 在 editorial 版本裡把 scene 壓成儀表面板，而不是主舞台

### Preserve

- three.js 場景資源釋放紀律
- manifest / tokens / journal 這條版本治理鏈
- 同一份內容多版本翻譯的比較價值

### Reinvent

- 首頁 narrative framing
- 版面骨架與欄網節奏
- 色彩材質與字體主從關係
- 3D 場景在閱讀中的角色

## 2026-03-26 / Run 2

### Trusted sources used

- [three.js responsive manual](https://threejs.org/manual/en/responsive.html)
- [W3C WAI in-page navigation tutorial](https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/)
- [Carbon typography style strategies](https://carbondesignsystem.com/elements/typography/style-strategies/)
- [NN/g menu design checklist](https://media.nngroup.com/media/articles/attachments/Website_Menu_Design_Checklist.pdf)
- [Apple design guidance on reduced motion](https://developer.apple.com/news/?id=g9q8j4i8)

### Principles

- museum-style 頁面只能有一個主展件；其餘資訊應該像標牌、目錄與註腳一樣退後服務閱讀。
- 長頁版本若有固定切換器與深內容，仍需要可見的頁內導覽與 skip path，否則鍵盤與掃描式閱讀都會吃虧。
- typography system 應該明確區分 display、label、body 三種角色，靠字階與留白建立展覽節奏，而不是多層卡片。
- WebGL 不一定要重回滿版 spectacle；被框進 exhibit case 反而更能建立版本 identity，且更容易控管效能與焦點。
- reduced-motion 在這類策展式版本裡不是只關動畫，而是把「漂浮感」收斂到靜態標本。

### Anti-patterns

- 只是把 editorial 版換深色，卻沒有新的閱讀骨架。
- 展櫃、註腳、版本牆同時搶戲，最後變成視覺噪音。
- 章節導覽只在外層 dock，頁面本體沒有自己的 wayfinding。
- 用 museum 語彙包裝，但內容仍是 generic feature cards。
- 把 3D 畫面塞進裝飾框，卻沒有同步調整 hero、section 與 metadata 的角色分配。

### Possible style families

- Museum monograph / exhibition dossier
- Dark reading room
- Curatorial field notes
- Instrument archive with searchable shelves

### Possible feature ideas

- 頁內 version wall，直接列出所有已出版版本
- curator note / specimen register 雙層資訊結構
- framed canvas variants，讓不同版本探索不同展櫃比例
- 後續延伸為可搜尋的 archive browser

### Interaction ideas

- 左側固定 rail 顯示章節位置，右側固定展櫃維持主展件存在感
- section reveal 改成展牌式淡入，而不是廣告式大幅飛入
- 版本牆可成為之後 compare mode 的入口

### Preserve

- manifest / tokens / journal / screenshot 四件套
- shared scene lifecycle 與 resource cleanup
- 版本切換時使用者對目前版本的可辨識性

### Reinvent

- hero 的觀看角度與信息密度
- 共享內容在不同敘事框架中的排序
- 3D 場景與文字之間的主從關係
- 頁內版本 lineage 的展示方式

## 2026-03-26 / Run 3

### Sources reviewed

- [WAI-ARIA APG tabs example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/)
- [Carbon search component](https://v10.carbondesignsystem.com/components/search/style/)
- [Carbon disclosures pattern](https://carbondesignsystem.com/patterns/disclosures-pattern/)
- [Baymard comparison UX research](https://baymard.com/blog/provide-comparison-features)

### Source quality notes

- W3C APG：官方可近用模式來源，適合拿來定義 tabs 的鍵盤行為與語意邊界。
- Carbon search / disclosures：官方設計系統，對小型資料集搜尋、filter disclosure 與 focus 管理有直接可落地的 guidance。
- Baymard：高品質 UX 研究來源，對 comparison UI 在桌面與手機上的取捨有明確實證訊號。

### Extracted principles

- 版本切換若會造成整個 stage 重建，就應採 manual-activation tabs；方向鍵只移動 focus，Enter / Space 才正式切換。
- 資料量還小時，active search 比堆一排 filters 更有效；先讓使用者能用版本號、標題與 traits 快速收斂。
- archive browser 若是 disclosure / drawer 型互動，打開後應先把焦點送到第一個互動元素，並允許 `Esc` 關閉。
- compare 功能在手機上不應照搬大表格；用摘要卡列出最有辨識力的差異軸線，比 side-by-side 規格表更實用。
- 版本瀏覽器不只要能切換，也要能回答「目前這版適合什麼閱讀姿態、與前後版差在哪裡」。

### Anti-patterns

- 對三到五個版本就先做複雜 faceted filters，讓工具本身比版本內容還搶戲。
- 把 compare 做成橫向大表格，結果手機視窗只剩水平卷軸與資訊噪音。
- 用 auto-activation tabs 讓使用者一按方向鍵就整頁重建，破壞鍵盤瀏覽節奏。
- 把目前版本資訊藏進 drawer 裡，導致關閉 browser 後只剩 route 參數能辨識當前版本。

### Possible style families

- Archive browser / version library
- Instrument comparison desk
- Search-first catalog
- Taxonomy-led timeline index

### Possible feature ideas

- archive browser 內建 search + adjacent compare summary
- 版本 metadata 擴充為 best-for / navigation / motion / scene treatment
- 後續補 screenshot thumbnail pipeline，讓 browser 直接帶預覽
- 之後可把 source family 與 status 做成更細的篩選器

### Interaction ideas

- 工具列維持可見 tabs，確保小版本數時仍能一鍵切換
- 右上 browser toggle 打開 overlay archive，搜尋欄位先接 focus
- compare 區只顯示前後鄰近版本，維持快掃而不是變成資料表

### Preserve

- 直接可見的版本切換
- 目前版本必須永遠可辨識
- manifest / journal / screenshots 的版本治理鏈
- version route 與 shared-content 結構

### Reinvent

- manifest metadata 的比較粒度
- version switcher 的搜尋與比較能力
- 版本數量成長後的檢索入口

### Ideas rejected for being too derivative

- full e-commerce comparison table：太像商品規格比較頁，且在手機上效率差。
- command-palette 式全螢幕切換器：互動語氣過於產品化，會稀釋版本實驗室的展示感。
- 多層 filter chip 面板：對目前資料量過度設計，也容易變成 Carbon 明示要避免的擁擠 disclosure。

## 2026-03-26 / Run 4

### Sources reviewed

- [W3C WebDriver Screen Capture](https://www.w3.org/TR/webdriver/#screen-capture)
- [Playwright screenshot assertions](https://playwright.dev/docs/next/api/class-snapshotassertions)
- [Vite static asset handling](https://v4.vite.dev/guide/assets)

### Source quality notes

- W3C WebDriver：官方標準，直接定義 screenshot 的語意邊界，適合拿來區分「viewport framebuffer dump」與一般概念預覽資產。
- Playwright：官方自動化文件，清楚說明 screenshot 應該進入可比對、可落檔的 snapshot 流程，而不是只是做一張展示圖。
- Vite asset handling：官方框架文件，對「資產是否真的進 build graph」這件事有直接指引，適合修正 repo 內存在但部署時不可達的 preview 路徑問題。

### Extracted principles

- 版本實驗室的預覽資產必須揭露 fidelity 與 provenance；只有檔案路徑，沒有來源型別，會讓使用者誤把概念海報當成真實截圖。
- 若 preview asset 不在 build graph 內，registry 就算指向了檔案，部署後也不是真正可瀏覽的比較證據。
- compare UI 不應只比較文字 metadata；至少要同時帶一張可視化預覽與其來源說明，讓使用者知道自己在比較什麼。
- screenshot pipeline 尚未可用時，應該把狀態顯式標成 `preview-only` 或 `capture-blocked`，而不是用含糊命名掩蓋缺口。

### Anti-patterns

- `screenshots/` 內有檔案，但 build 後根本不會被部署。
- 用 `poster.svg` 當預覽，卻在 UI 與 manifest 裡暗示那是真實網站截圖。
- compare drawer 只顯示 style family 與概念，沒有任何可視化證據。
- 把 screenshot pipeline 的失敗靜默吞掉，最後讓 stable 版本看起來像已完整留檔。

### Possible feature ideas

- browser screenshot pipeline 一旦環境允許，就把 `preview-only` 升級成 `browser-captured` 並保留 provenance 歷史。
- 後續補 section-level capture strip，讓 compare panel 不只比較首頁海報，還能比較 narrative 片段。
- 增加 preview fidelity filter，例如只看真實瀏覽器截圖、只看概念海報、或顯示混合狀態。

### Interaction ideas

- 在 version browser 卡片頂部固定顯示 preview thumb，讓搜尋結果不是只剩文字。
- compare summary card 同時顯示預覽與 `snapshotReadiness`，縮短使用者判讀成本。
- current-version meta 區直接揭露 preview kind 與 origin，避免使用者要打開檔案才知道那是什麼。

### Preserve

- 版本切換與 compare 的快速可達性
- manifest / tokens / journal / screenshots 這條註冊鏈
- 同一份內容被不同視覺語言翻譯後的可比較性

### Reinvent

- preview asset 的部署路徑
- 預覽證據的誠實度與可辨識性
- metadata 與 visual evidence 在 browser 內的關係

### Ideas rejected for being too derivative

- 用假裝是 macOS / iPhone device frame 的縮圖牆來增加「作品集感」：太像成品展示平台，反而模糊版本研究的重點。
- 把 compare panel 做成 dashboard heatmap：資料語氣過強，會蓋掉每個版本本身的敘事差異。

## 2026-03-27 / Run 5

### Sources reviewed

- repo 內的 GitHub Pages workflow：`.github/workflows/deploy.yml`
- 目前工作樹與 `version-manifest.json` 的治理欄位
- 現有 GitHub Pages hosted URL 的可達性檢查

### Extracted principles

- 設計成熟度與發布真實度必須分開記錄；`stable` 不能自動等於「已上線」。
- 版本實驗室應把 `hostedUrl` 與最近一次 live 驗證時間寫進 manifest，而不是只在內容層留一個靜態連結。
- live verification 要記錄「看到了什麼」而不是只記錄「有個網址存在」；URL 可達不代表目前本地工作樹已部署。
- shared navigator 若提供 Hosted Site 入口，就必須同步揭露 release 狀態，否則使用者會把本地 registry 誤判成已發布版本。

### Anti-patterns

- 把既有 GitHub Pages URL 的存在，直接當成目前工作樹已部署的證據。
- 只用單一 `status` 欄位，同時描述設計成熟度與發佈狀態。
- browser shell 提供 live 連結，卻不說明目前 registry 是否只是 local-only。

### Possible feature ideas

- 之後可加入 release history strip，顯示每次推送、部署與 live 驗證節點。
- 若環境允許，可做 post-deploy probe，比對 hosted HTML title 或 manifest hash 是否與本地一致。

## 2026-03-26 / Run 4

### Sources reviewed

- [W3C WCAG Consistent Navigation](https://www.w3.org/WAI/GL/WCAG20/WD-UNDERSTANDING-WCAG20-20071211/consistent-behavior-consistent-locations.html)
- [Carbon UI shell header](https://v10.carbondesignsystem.com/components/UI-shell-header/usage/)
- [GitHub Command Palette docs](https://docs.github.com/en/get-started/accessibility/github-command-palette)
- [three.js disposal guide](https://threejs.org/manual/en/how-to-dispose-of-objects.html)

### Source scoring

- W3C / official accessibility guidance
  - 類別：官方可及性規範
  - credibility：5/5
  - originality：3/5
  - usability：5/5
  - technical relevance：4/5
  - derivative risk：1/5
- Carbon / official design system
  - 類別：官方設計系統
  - credibility：5/5
  - originality：3/5
  - usability：4/5
  - technical relevance：4/5
  - derivative risk：1/5
- GitHub docs / official product docs
  - 類別：官方產品文件
  - credibility：5/5
  - originality：4/5
  - usability：4/5
  - technical relevance：4/5
  - derivative risk：2/5
- three.js manual / official docs
  - 類別：官方 framework 文件
  - credibility：5/5
  - originality：3/5
  - usability：4/5
  - technical relevance：5/5
  - derivative risk：1/5

### Source quality notes

- W3C 給的是結構穩定性與一致位置原則，直接支撐「目前版本資訊不能只藏在 drawer 裡」。
- Carbon UI shell header 幫忙確認桌機 header 與小螢幕側欄/抽屜之間的 collapse 邏輯，適合做共享 navigator 的殼。
- GitHub Command Palette 提供 `Cmd/Ctrl+K`、scope-aware 搜尋與 Enter-to-open 的互動語意，但不能直接照抄它的產品語氣。
- three.js disposal guide 提醒版本切換仍然是 scene teardown 的高風險點，compare/navigation 升級不能破壞 cleanup discipline。

### Extracted principles

- 重複出現的版本導覽要維持一致位置與相對順序，讓使用者不用重新找目前版本與切換入口。
- 版本數仍少時，桌機保留可見 tabs，比強迫使用者每次都打開 browser 更直接。
- searchable browser 應該支援 version id、slug、title、concept、style family、traits、best-for 等多欄位索引，而不是只搜標題。
- compare 應先支援相鄰版本的快速摘要，比完整 side-by-side rendering 更適合目前版本數與手機情境。
- 版本切換與 compare 更新都不能影響 three.js 資源釋放，否則實驗室會在長時間切換後退化。

### Anti-patterns

- 只把 `Cmd/Ctrl+K` 當成漂亮捷徑，卻沒有讓 Enter 能直接進入第一個結果。
- mobile browser 只是縮小 desktop 面板，沒有轉成更清楚的 bottom-sheet 行為。
- version card 只有標題與概念，缺少 best-for / status / traits，導致無法快速比較。
- compare 做得像規格表，但完全沒有指出敘事、導覽與 scene treatment 的質性差異。

### Possible style families

- Instrument dashboard portfolio
- Search-first archive browser
- Monochrome taxonomy index
- Swiss minimal comparison desk

### Possible feature ideas

- compare query param 持久化，讓分享連結可直接開在某版 vs 某版
- version browser 顯示 screenshot thumbnail 與 status badge
- 之後補 keyboard roving focus，讓 tabs 更接近完整 APG 行為
- 建立真正的 side-by-side section compare route，而不是只比較 metadata

### Interaction ideas

- 工具列中央固定 current-version capsule，避免關掉 browser 後失去方向感
- 桌機以 nearby compare pills 提供一跳比較，手機則把 compare 放進 browser 區塊
- 搜尋欄 Enter 直接開第一個版本結果，減少 palette 多一步點擊

### Preserve

- manifest 驅動的版本註冊與 route 穩定性
- shared scene lifecycle / cleanup discipline
- 小版本數時的一鍵 tabs 體驗

### Reinvent

- archive browser 的 metadata 密度
- compare 的開啟方式與分享能力
- current-version awareness 的全域可見性

### Ideas rejected for being too derivative

- 完整複製 GitHub command palette 的 `>` command mode 與 scope token 標記：互動語氣太像產品工作台。
- 直接採用 Carbon UI shell 的資訊密度與比例：會把實驗室導覽做得過於企業產品化。
- 把 compare 做成 Framer/marketplace 式卡片牆：看起來漂亮，但對版本差異的辨識價值太低。

## 2026-03-27 / v005 Tidal Atlas Research

### Sources reviewed

- [NOAA Nautical Chart Manual](https://ocsdata.ncd.noaa.gov/mcs/03_ncm_vol1.pdf)
- [three.js responsive manual](https://threejs.org/manual/en/responsive.html)
- [W3C WAI in-page navigation tutorial](https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/)
- [Apple design guidance on reduced motion](https://developer.apple.com/news/?id=g9q8j4i8)

### Source quality notes

- NOAA chart manual：官方海圖規範，對 landmarks、contours 與 detail density 的取捨有直接原則，可拿來避免 nautical 風格淪為純裝飾。
- three.js responsive manual：持續作為 bounded chart window 的 renderer resize 與 pixel ratio 紀律來源。
- W3C in-page navigation：確保海圖式長頁仍有清楚章節定位，而不是只有氣氛與術語。
- Apple reduced motion：讓潮汐漂移與 beacon pulse 在 reduced-motion 下能確實收斂。

### Extracted principles

- 海圖語言的重點不是堆滿 nautical props，而是讓重要 landmarks 從較低密度的背景資訊中被辨識出來。
- contours、grid 與 route markings 應該服務導覽與節奏，不應和主內容競爭注意力。
- 只保留一個主 chart window，其他 annotation 退居為 route bands、sounding sheets 與 beacon panels，頁面才會像 atlas 而不是 themed dashboard。
- 3D 場景放進 light case 比 full-bleed 更符合 chart-table 的閱讀姿態，也更容易維持效能與部署穩定度。
- 長頁若採 cartographic framing，章節命名、固定 header 與 anchor flow 必須一樣清楚，否則使用者只會記得氣氛，不會記得方向。

### Anti-patterns

- 把海圖元素當貼紙，卻沒有真的改變資訊階層與導航邏輯。
- 一次疊太多等高線、符號與紋理，讓版面只剩質感噪音。
- 3D 場景仍佔滿整頁，導致 chart-language 只是外框皮膚。
- beacon / route / sounding 同時高對比搶戲，失去 atlas 應有的主從秩序。

### Possible style families

- Tidal atlas / illuminated archive
- Bathymetric reading room
- Survey table / route ledger
- Harbor signal bulletin

### Preserve

- 共享 navigator 與版本切換辨識性
- renderer cleanup discipline 與 bounded WebGL 結構
- manifest / tokens / journal / preview artifact 這條版本治理鏈

### Reinvent

- 首頁敘事從 dashboard 轉成 cartographic navigation
- annotation 的角色分配與空間階層
- scene 與 metadata 的結合方式

## 2026-03-28 / v006 Spectral Moth Research

### Sources reviewed

- user-provided monochrome data-decay prompt
- [three.js responsive manual](https://threejs.org/manual/en/responsive.html)
- [W3C WAI in-page navigation tutorial](https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/)
- [Apple design guidance on reduced motion](https://developer.apple.com/news/?id=g9q8j4i8)

### Source quality notes

- user prompt：直接定義了黑白、高密度點陣、像素崩解與數位腐蝕這四個不能被稀釋的核心條件。
- three.js responsive manual：保證 full-bleed monochrome poster 仍維持 renderer resize 與 pixel ratio 紀律，而不是為了氣氛犧牲穩定性。
- W3C in-page navigation：提醒這種極端海報頁仍要保有清楚的 anchor flow，否則會只剩視覺衝擊沒有方向。
- Apple reduced motion：glitch / flicker 類動效必須有收斂路徑，不能把刺激感直接硬塞給所有人。

### Extracted principles

- 黑白高對比頁面只能有一個真正主導的 silhouette；雜訊、點陣與 dispersion 都只能服務那個主體。
- data decay 最有力的位置是在邊緣，而不是把整頁做成平均髒亂；形成 / 崩解必須被看得懂。
- 若 UI 要和既有版本徹底切開，就不能沿用 card/grid 語氣，而要改成 poster、strip、field log 這種更偏印刷與訊號的骨架。
- 動物主題不該靠插圖貼圖硬撐，而要讓版面對稱性、wing-like composition 與 scene core 一起傳遞物種感。
- flicker 與 white-noise drift 可以提供 presence，但 reduced-motion 下必須可退回較穩定的 reveal。

### Anti-patterns

- 只是把舊版配色改黑白，卻沒有改變資訊層級與畫面主從。
- 把 dither、halftone、pixel dispersion 平均鋪滿全頁，讓內容失去辨識度。
- 用 generic cards 裝載 field log，結果語氣還是 dashboard。
- 動物只出現在文案名詞裡，畫面本身卻沒有任何物種特徵。

### Possible style families

- Monochrome glitch fauna
- White-noise specimen wall
- Corrupted field poster
- Simulation breakdown monograph

### Preserve

- 版本切換的可辨識性與 shared navigator 穩定度
- scene cleanup / responsive renderer discipline
- manifest / tokens / journal / preview artifact 註冊鏈

### Reinvent

- 視覺語言從彩色 atmosphere 改成黑白 poster violence
- 內容容器從 panels 改成 strips / logs / specimen labels
- scene 與版面之間的主從與對稱性
