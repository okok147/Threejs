# 光軌

一個簡單的 three.js 單頁網站，使用 Vite 建置，推送到 `main` 後會透過 GitHub Actions 自動部署到 GitHub Pages。

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 部署

將變更推送到 `main` 後，`.github/workflows/deploy.yml` 會自動建置並發布 Pages。
