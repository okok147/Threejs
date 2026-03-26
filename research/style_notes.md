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
