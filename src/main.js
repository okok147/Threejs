import './style.css'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('Missing #app mount point')
}

const reviewPatients = [
  'EMILY SMITH',
  'OLIVIA CHEN',
  'BEN CARTER',
  'OLIVIA JOHNSON',
  'OLIVIA SMITH',
]

const riskPatients = [
  ['ANNA K.', 'LUNG RISK: HIGH'],
  ['DAVID L.', 'METABOLIC SHIFT'],
  ['MARIA G.', 'INFLAMMATORY SPIKE'],
]

const schedule = [
  ['10:00', 'am', true],
  ['10:30', 'am', false],
  ['01:00', 'pm', false],
  ['02:15', 'pm', false],
  ['03:10', 'pm', false],
  ['04:20', 'pm', false],
]

const heatmap = [
  [1, 1, 0, 1, 1, 1, 1],
  [0, 1, 2, 1, 1, 0, 1],
  [1, 3, 2, 3, 3, 1, 0],
  [1, 2, 1, 2, 2, 2, 0],
  [1, 1, 2, 3, 1, 1, 1],
  [1, 1, 2, 0, 2, 1, 1],
]

const insightColumns = [
  ['MO', 7],
  ['TU', 10],
  ['WE', 7],
  ['TH', 3],
  ['FR', 14],
  ['SA', 2],
  ['SU', 14],
]

const resultCards = [
  ['01', 'CAUTION', false],
  ['04', 'HIGH RISK', true],
  ['02', 'NORMAL', false],
]

app.innerHTML = `
  <div class="health-page">
    <div class="health-surface">
      <header class="health-topbar">
        <div class="health-brand">PULMIFY</div>

        <label class="health-search" aria-label="Search patients">
          <span class="health-search-icon" aria-hidden="true"></span>
          <input type="search" placeholder="SEARCH PATIENTS..." />
        </label>

        <nav class="health-nav" aria-label="Primary">
          <button class="health-nav-button is-active" type="button">DASHBOARD</button>
          <button class="health-nav-button" type="button">PATIENT LIST</button>
          <button class="health-nav-button" type="button">REPORTS</button>
          <button class="health-nav-button" type="button">ACCOUNT</button>
        </nav>
      </header>

      <section class="health-heading-row">
        <div>
          <h1>Today's Overview</h1>
          <p>Hello, Dr. Chen! You have 3 high-risk alerts.</p>
        </div>

        <div class="health-alert-strip">
          <span class="health-pill health-pill-count">3</span>
          <span class="health-pill">HIGH-RISK ALERTS</span>
          <span class="health-pill health-pill-count">7</span>
          <span class="health-pill">NEW RESULTS READY</span>
          <button class="health-pill health-pill-select" type="button">
            TODAY
            <span class="health-chevron" aria-hidden="true"></span>
          </button>
        </div>
      </section>

      <section class="health-grid health-grid-top">
        <article class="health-card health-card-quick">
          <header class="health-card-head">
            <span>QUICK ACCESS</span>
          </header>

          <div class="health-quick-panel">
            <ul class="health-link-list">
              <li>[+] NEW APPOINTMENT</li>
              <li>[->] ALL PATIENTS</li>
              <li>[->] GENERATE REPORT</li>
              <li>[->] ORDER KITS</li>
            </ul>
          </div>
        </article>

        <article class="health-card health-card-metric">
          <header class="health-card-head">
            <span>READY FOR REVIEW</span>
          </header>

          <div class="health-card-body">
            <strong class="health-big-number">05</strong>
            <ul class="health-data-list">
              ${reviewPatients
                .map(
                  (name) => `
                    <li>
                      <span>${name}</span>
                      <span>[VIEW ->]</span>
                    </li>
                  `
                )
                .join('')}
            </ul>
          </div>
        </article>

        <article class="health-card health-card-metric">
          <header class="health-card-head">
            <span>HIGH-RISK PATIENTS</span>
          </header>

          <div class="health-card-body">
            <strong class="health-big-number">03</strong>
            <ul class="health-data-list">
              ${riskPatients
                .map(
                  ([name, detail]) => `
                    <li>
                      <span>${name} <em>|</em> ${detail}</span>
                      <span>[VIEW ->]</span>
                    </li>
                  `
                )
                .join('')}
            </ul>
          </div>
        </article>

        <article class="health-card health-card-insight">
          <header class="health-card-head health-card-head-split">
            <span>TIME TO INSIGHT</span>
            <span>WEEKLY AVERAGE</span>
          </header>

          <div class="health-insight-panel">
            <div class="health-y-axis" aria-hidden="true">
              <span>16H</span>
              <span>12H</span>
              <span>8H</span>
              <span>4H</span>
              <span>0H</span>
            </div>

            <div class="health-bubble-chart" aria-hidden="true">
              ${insightColumns
                .map(
                  ([label, count]) => `
                    <div class="health-bubble-column">
                      <div class="health-bubbles">
                        ${Array.from({ length: count }, () => '<span class="health-bubble"></span>').join('')}
                      </div>
                      <small>${label}</small>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        </article>
      </section>

      <section class="health-grid health-grid-bottom">
        <article class="health-card health-card-schedule">
          <header class="health-card-head">
            <span>TODAY'S SCHEDULE</span>
          </header>

          <div class="health-time-grid">
            ${schedule
              .map(
                ([time, suffix, active]) => `
                  <div class="health-time-slot ${active ? 'is-active' : ''}">
                    <strong>${time}</strong>
                    <span>${suffix}</span>
                  </div>
                `
              )
              .join('')}
          </div>
        </article>

        <article class="health-card health-card-density">
          <header class="health-card-head health-card-head-split">
            <span>UPCOMING WEEK</span>
            <span>APPOINTMENT DENSITY</span>
          </header>

          <div class="health-density-wrap">
            <div class="health-density-legend">
              <span><i class="tone-0"></i>AVAILABLE</span>
              <span><i class="tone-1"></i>2 PATIENT</span>
              <span><i class="tone-2"></i>3 PATIENTS</span>
              <span><i class="tone-3"></i>FULLY BOOKED</span>
            </div>

            <div class="health-density-grid">
              <div class="health-density-hours" aria-hidden="true">
                <span>5 PM</span>
                <span>3 PM</span>
                <span>1 PM</span>
                <span>11 AM</span>
                <span>10 AM</span>
                <span>9 AM</span>
              </div>

              <div class="health-density-board">
                ${heatmap
                  .map(
                    (row) => `
                      <div class="health-density-row">
                        ${row.map((tone) => `<span class="health-density-cell tone-${tone}"></span>`).join('')}
                      </div>
                    `
                  )
                  .join('')}

                <div class="health-density-days" aria-hidden="true">
                  <span>MO</span>
                  <span>TU</span>
                  <span>WE</span>
                  <span>TH</span>
                  <span>FR</span>
                  <span>SA</span>
                  <span>SU</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="health-card health-card-results">
          <header class="health-card-head">
            <span>TODAY'S RESULTS</span>
          </header>

          <div class="health-result-stack">
            ${resultCards
              .map(
                ([count, label, highlight]) => `
                  <div class="health-result-card ${highlight ? 'is-highlight' : ''}">
                    <strong>${count}</strong>
                    <span>${label}</span>
                  </div>
                `
              )
              .join('')}
          </div>
        </article>
      </section>
    </div>
  </div>
`
