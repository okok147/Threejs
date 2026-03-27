# 光軌

一個 versioned three.js frontend style laboratory。現在這個 repo 不再只保留單一首頁，而是會持續累積 `v001`、`v002`、`v003` 等完整網站版本，讓同一份內容可以被不同的風格、版面與 3D 語言重新翻譯。

## 開發

```bash
npm install
npm run dev
npm test
npm run lab:validate
npm run lab:check
```

## 建置

```bash
npm run build
```

## 版本實驗室結構

- `versions/v###-slug/`: 每個不可覆蓋的網站版本
- `tokens/v###.json`: 對應版本的設計 token
- `screenshots/v###/`: 版本快照資產
- `research/style_notes.md`: 可信來源研究與原則整理
- `research/version_journal.md`: 每次版本演化的紀錄
- `version-manifest.json`: 穩定的版本註冊表與切換器來源

## 目前版本

- `v001 / Orbit Cinematic`: 品牌世界觀首頁，強調 cinematic single-object narrative
- `v002 / Signal Ledger`: 編輯式作品集索引，強調版本條目、方法論與 research archive
- `v003 / Museum Monograph`: 策展型案例深讀頁，強調展件框景、固定 rail 與 version wall

## Three.js 實作品質基線

目前專案已經採用幾個來自 Three.js 官方文件與範例的做法，作為版本實驗室的品質基線：

- 使用 `renderer.setAnimationLoop()` 管理動畫迴圈，而不是手動遞迴 `requestAnimationFrame()`。
- 使用 `RoomEnvironment` + `PMREMGenerator` 建立 PBR 環境光照，讓 `MeshStandardMaterial` 有更穩定的反射與明暗。
- 啟用 `ACESFilmicToneMapping`、`toneMappingExposure` 與 `SRGBColorSpace`，維持輸出色彩的一致性。
- 對 `CanvasTexture` 標註 `colorSpace`，避免 glow texture 的色彩解讀錯誤。
- 以 scene preset 方式重用 three.js 核心結構，讓不同版本可以共用資源管理與 responsive discipline。
- 在頁面隱藏與銷毀時停止動畫並釋放 geometry、material、texture 與 renderer 資源。

## Preview / Snapshot Provenance

- `version-manifest.json` 會同時保留 `screenshotPaths` 與 `previewArtifacts`；前者維持 registry 相容性，後者則明確標註預覽資產的 `kind`、`origin` 與 `snapshotReadiness`。
- 目前 `v001` 到 `v003` 都只有 repo 內維護的概念海報預覽，不是假裝成真實瀏覽器截圖。
- 這個 sandbox 無法在本輪開本地 HTTP listener，因此真實 browser screenshot pipeline 仍待後續環境放行後再接上。

## Release Truth

- `version-manifest.json` 現在把設計狀態與發布狀態分開記錄：版本繼續用 `status` 表示設計成熟度，另用 `releaseStatus` 表示目前是否只在本地、已推送、或已 live 驗證。
- `lab.hostedUrl`、`lastLiveVerificationAt` 與 `liveVerificationNotes` 會明確記錄目前觀察到的 hosted site 證據，避免把「URL 可達」誤當成「本地工作樹已上線」。
- 若本地變更尚未 push / deploy，就算既有 GitHub Pages URL 仍可開啟，也必須維持 `local-only` 或其他較低 release 狀態，不能直接宣稱 live。
- `npm test` 目前會先覆蓋共享 navigator 的核心規則，包括初始版本解析、manual-activation tabs、compare target 驗證與 search index 組裝，作為跨版本切換的最小保護網。
- `npm run lab:check` 會串起 `npm test`、`npm run lab:validate` 與 `npm run build`；GitHub Pages workflow 也會在 build 前先跑同一組保護檢查。

官方參考：

- [Renderer docs](https://threejs.org/docs/pages/Renderer.html)
- [RoomEnvironment docs](https://threejs.org/docs/pages/RoomEnvironment.html)
- [Color Management manual](https://threejs.org/manual/en/color-management.html)
- [Cleanup manual](https://threejs.org/manual/zh/cleanup.html)

## 部署

將變更推送到 `main` 後，`.github/workflows/deploy.yml` 會先執行 `npm test` 與 `npm run lab:validate`，再建置並發布 Pages。
