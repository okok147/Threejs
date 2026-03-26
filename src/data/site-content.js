export const siteContent = {
  brand: '光軌',
  repoUrl: 'https://github.com/okok147/Threejs',
  liveUrl: 'https://okok147.github.io/Threejs/',
  labSummary: '把同一份 three.js 內容拆成可切換、可註冊、可比較的前端風格版本。',
  referenceSignals: [
    {
      name: 'three.js Responsive Manual',
      description: '場景必須跟著顯示尺寸更新，而不是盲目重設 render buffer。',
      url: 'https://threejs.org/manual/en/responsive.html',
    },
    {
      name: 'W3C In-Page Navigation',
      description: '長頁面需要可預測的頁內目錄與標題層級，避免方向感流失。',
      url: 'https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/',
    },
    {
      name: 'Carbon 2x Grid',
      description: '大版面應該用流體欄網維持節奏，而不是靠零碎卡片堆疊。',
      url: 'https://carbondesignsystem.com/elements/2x-grid/overview/',
    },
    {
      name: 'Apple Reduce Motion',
      description: '多軸與大幅周邊動態要有節制，保留 reduced-motion 對應。',
      url: 'https://developer.apple.com/news/?id=g9q8j4i8',
    },
    {
      name: 'Carbon Typography Style Strategies',
      description: '版面層級要靠字體系統與閱讀節奏建立，而不是依賴零碎卡片。',
      url: 'https://carbondesignsystem.com/elements/typography/style-strategies/',
    },
    {
      name: 'NN/g Menu Design Checklist',
      description: '長頁導覽必須可見、可預測，標籤也要讓人一眼理解章節用途。',
      url: 'https://media.nngroup.com/media/articles/attachments/Website_Menu_Design_Checklist.pdf',
    },
  ],
  storySignals: [
    {
      name: 'BlueYard',
      detail: '取它把 3D 當導覽系統的能力，而不是只取發光宇宙背景。',
    },
    {
      name: 'Igloo Inc',
      detail: '取它的滾動鏡頭節奏，把段落切成能逐步接管注意力的章節。',
    },
    {
      name: 'Star Atlas',
      detail: '取它的世界觀密度與高對比首屏，但壓回可部署的實作品質。',
    },
  ],
  chapters: [
    {
      step: '01 / ORBIT',
      title: '先讓品牌像海報一樣站穩。',
      body: '第一屏只做一件事：讓品牌、主物件與 CTA 形成同一個視覺重心。',
      note: '品牌第一、敘事第二、細節最後補。',
    },
    {
      step: '02 / DRIFT',
      title: '滾動不是捲頁，而是推動鏡頭。',
      body: '場景、字幕與欄位慢慢偏移，讓閱讀感接近案例影片而不是簡報。',
      note: '段落一個接一個接管注意力，而不是同時喧嘩。',
    },
    {
      step: '03 / DEPLOY',
      title: '最後把氣氛收束成能上線的 repo。',
      body: 'stack、參考與部署說明都放在終段，讓這個版本能成為下一輪演化的母體。',
      note: '不是 moodboard，而是可繼續增殖的實驗室基線。',
    },
  ],
  implementationLines: [
    {
      label: 'Scene Core',
      title: '單一核心物件 + 軌跡 + 粒子帶',
      body: '用少量幾何把畫面做厚，避免模型堆砌把 frame time 吃光。',
    },
    {
      label: 'Page Layer',
      title: '共享內容資料，版本只改版面與動態語言',
      body: '文案與來源被抽成資料層，讓之後新增 v003、v004 不必重寫內容。',
    },
    {
      label: 'Version Registry',
      title: 'manifest + tokens + snapshots 固定註冊',
      body: '每次大改都會留下獨立入口與設計 token，不再把風格直接覆蓋掉。',
    },
  ],
  featureTracks: [
    {
      name: 'Immersive Launch',
      family: 'Cinematic orbit',
      fit: '品牌發表頁 / 首頁世界觀',
      summary: '主角是一個畫面重心，文字只做必要支援。',
    },
    {
      name: 'Editorial Portfolio',
      family: 'Signal ledger',
      fit: '作品集 / 設計方法索引',
      summary: '主角變成版本與方法，3D 被壓成氣氛儀表而不是舞台中央。',
    },
    {
      name: 'Archive Browser',
      family: 'Searchable version library',
      fit: '版本變多後的檢索入口',
      summary: '之後可延伸成搜尋、篩選、比較與快照瀏覽的控制台。',
    },
    {
      name: 'Exhibition Monograph',
      family: 'Museum monograph',
      fit: '案例深讀 / 策展型作品頁',
      summary: '把 3D 物件當成展件，讓註腳、版本牆與研究來源一起進入主舞台。',
    },
  ],
  methodSteps: [
    {
      label: 'Research',
      title: '只抓原理，不抄成品表層。',
      detail: '優先讀官方與研究來源，把版面、動態、易用性拆成能落地的原則。',
    },
    {
      label: 'Distill',
      title: '明確寫出 style thesis 與 use-case emphasis。',
      detail: '每個版本只服務一種主敘事，避免把不相干的語言硬拼在一起。',
    },
    {
      label: 'Generate',
      title: '共享資料，替換整體構圖、材質與互動。',
      detail: '內容不變，風格全變，才能真正看出版本之間的差異。',
    },
    {
      label: 'Validate',
      title: '建置、註冊、快照與 journal 一起過。',
      detail: '沒有 manifest、tokens 與研究紀錄的版本不算正式版本。',
    },
  ],
  archiveNotes: [
    {
      title: 'Keep the version switcher stable',
      body: '版本再多也要一眼知道自己在哪一版，否則整個實驗室會退化成分支墓園。',
    },
    {
      title: 'Separate content from presentation',
      body: '共享內容讓比較更公平，也讓未來加入篩選器與版本搜尋更容易。',
    },
    {
      title: 'Respect reduced motion',
      body: '強氣氛版本也不能犧牲舒適性，場景與 reveal 都必須在 reduced-motion 下收斂。',
    },
    {
      title: 'Expose version lineage in the page',
      body: '版本切換器不能是唯一入口；頁面內也要看得到版本牆與家族關係。',
    },
  ],
}
