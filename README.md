# 光軌

一個 versioned three.js frontend style laboratory。現在這個 repo 不再只保留單一首頁，而是會持續累積 `v001`、`v002`、`v003` 等完整網站版本，讓同一份內容可以被不同的風格、版面與 3D 語言重新翻譯。

## 開發

```bash
npm install
npm run dev
npm run lab:validate
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

## Three.js 實作品質基線

目前專案已經採用幾個來自 Three.js 官方文件與範例的做法，作為版本實驗室的品質基線：

- 使用 `renderer.setAnimationLoop()` 管理動畫迴圈，而不是手動遞迴 `requestAnimationFrame()`。
- 使用 `RoomEnvironment` + `PMREMGenerator` 建立 PBR 環境光照，讓 `MeshStandardMaterial` 有更穩定的反射與明暗。
- 啟用 `ACESFilmicToneMapping`、`toneMappingExposure` 與 `SRGBColorSpace`，維持輸出色彩的一致性。
- 對 `CanvasTexture` 標註 `colorSpace`，避免 glow texture 的色彩解讀錯誤。
- 以 scene preset 方式重用 three.js 核心結構，讓不同版本可以共用資源管理與 responsive discipline。
- 在頁面隱藏與銷毀時停止動畫並釋放 geometry、material、texture 與 renderer 資源。

官方參考：

- [Renderer docs](https://threejs.org/docs/pages/Renderer.html)
- [RoomEnvironment docs](https://threejs.org/docs/pages/RoomEnvironment.html)
- [Color Management manual](https://threejs.org/manual/en/color-management.html)
- [Cleanup manual](https://threejs.org/manual/zh/cleanup.html)

## 部署

將變更推送到 `main` 後，`.github/workflows/deploy.yml` 會自動建置並發布 Pages。
