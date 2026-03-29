import './style.css'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('Missing #app mount point')
}

const summaryCards = [
  {
    label: 'New leads',
    value: '148',
    delta: '+12%',
    tone: 'sand',
  },
  {
    label: 'Won deals',
    value: '$84.2K',
    delta: '+8.4%',
    tone: 'ivory',
  },
  {
    label: 'Reply rate',
    value: '71%',
    delta: '+5.1%',
    tone: 'espresso',
  },
]

const clients = [
  {
    name: 'Ariana Cole',
    company: 'Northstar Labs',
    initials: 'AC',
    tag: 'Enterprise',
    tagTone: 'sand',
    lastTouch: '2h ago',
    stage: 'Proposal',
    stageTone: 'warm',
    revenue: '$18,400',
  },
  {
    name: 'Malik Chen',
    company: 'Ledger Works',
    initials: 'MC',
    tag: 'SMB',
    tagTone: 'olive',
    lastTouch: 'Today',
    stage: 'Qualified',
    stageTone: 'olive',
    revenue: '$6,900',
  },
  {
    name: 'Sofia Bennett',
    company: 'Cinder Health',
    initials: 'SB',
    tag: 'Renewal',
    tagTone: 'rose',
    lastTouch: 'Yesterday',
    stage: 'Negotiation',
    stageTone: 'warm',
    revenue: '$12,500',
  },
  {
    name: 'Dylan Park',
    company: 'Aster Motion',
    initials: 'DP',
    tag: 'Upsell',
    tagTone: 'olive',
    lastTouch: 'Mar 27',
    stage: 'Discovery',
    stageTone: 'muted',
    revenue: '$4,320',
  },
]

const focusDeals = [
  {
    title: 'Helio commerce migration',
    owner: 'Product sales',
    amount: '$32,000',
    progress: 82,
  },
  {
    title: 'Verve renewal package',
    owner: 'Account team',
    amount: '$16,800',
    progress: 61,
  },
  {
    title: 'Opal onboarding expansion',
    owner: 'Growth desk',
    amount: '$9,600',
    progress: 47,
  },
]

const activities = [
  {
    time: '09:20',
    title: 'Proposal opened by Northstar Labs',
    body: 'Ariana reviewed pricing and forwarded the scope deck.',
  },
  {
    time: '11:05',
    title: 'Meeting confirmed with Ledger Works',
    body: 'Malik accepted the Tuesday product walkthrough.',
  },
  {
    time: '14:30',
    title: 'Renewal risk flagged for Cinder Health',
    body: 'Customer success requested a pricing adjustment.',
  },
]

app.innerHTML = `
  <div class="crm-shell">
    <aside class="crm-sidebar">
      <div class="crm-brand-block">
        <div class="crm-brand-mark">C</div>
        <div>
          <p class="crm-overline">Customer OS</p>
          <h1>Clario</h1>
        </div>
      </div>

      <nav class="crm-nav" aria-label="Primary">
        <button class="crm-nav-item is-active" type="button">
          <span class="crm-nav-icon">◧</span>
          Overview
        </button>
        <button class="crm-nav-item" type="button">
          <span class="crm-nav-icon">◎</span>
          Clients
        </button>
        <button class="crm-nav-item" type="button">
          <span class="crm-nav-icon">◌</span>
          Deals
        </button>
        <button class="crm-nav-item" type="button">
          <span class="crm-nav-icon">△</span>
          Reports
        </button>
        <button class="crm-nav-item" type="button">
          <span class="crm-nav-icon">✦</span>
          Automations
        </button>
      </nav>

      <section class="crm-sidebar-card">
        <p class="crm-overline">This month</p>
        <strong>92 active accounts</strong>
        <p>Calm, neutral UI for tracking customer relationships and revenue motion.</p>
        <div class="crm-mini-metric">
          <span>Pipeline health</span>
          <strong>84%</strong>
        </div>
      </section>

      <footer class="crm-user-card">
        <div class="crm-avatar is-dark">KL</div>
        <div>
          <strong>Kelvin Lau</strong>
          <p>Sales director</p>
        </div>
      </footer>
    </aside>

    <main class="crm-main">
      <header class="crm-topbar">
        <div>
          <p class="crm-overline">Dashboard</p>
          <h2>CRM Dashboard</h2>
        </div>

        <div class="crm-topbar-actions">
          <label class="crm-search">
            <span class="crm-search-icon">⌕</span>
            <input type="search" placeholder="Search clients, deals, notes" />
          </label>

          <button class="crm-ghost-button" type="button">Export</button>
          <button class="crm-primary-button" type="button">New client</button>
        </div>
      </header>

      <section class="crm-hero-card">
        <div class="crm-hero-copy">
          <p class="crm-overline">Revenue overview</p>
          <div class="crm-hero-heading">
            <div>
              <h3>$128,480</h3>
              <p>Net sales this quarter across enterprise, renewal, and upsell segments.</p>
            </div>
            <div class="crm-period-switch" role="tablist" aria-label="Date range">
              <button class="crm-chip is-active" type="button" data-period="week">Week</button>
              <button class="crm-chip" type="button" data-period="month">Month</button>
              <button class="crm-chip" type="button" data-period="quarter">Quarter</button>
            </div>
          </div>

          <div class="crm-chart-wrap">
            <div class="crm-chart-legend">
              <span><i class="crm-dot is-dark"></i> Closed won</span>
              <span><i class="crm-dot is-sand"></i> Qualified</span>
              <span><i class="crm-dot is-line"></i> Forecast</span>
            </div>

            <div class="crm-chart-card">
              <svg viewBox="0 0 740 260" class="crm-chart" aria-hidden="true">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="rgba(145,101,64,0.32)" />
                    <stop offset="100%" stop-color="rgba(145,101,64,0)" />
                  </linearGradient>
                </defs>
                <g class="crm-chart-grid">
                  <line x1="0" y1="32" x2="740" y2="32"></line>
                  <line x1="0" y1="88" x2="740" y2="88"></line>
                  <line x1="0" y1="144" x2="740" y2="144"></line>
                  <line x1="0" y1="200" x2="740" y2="200"></line>
                </g>
                <path
                  class="crm-area"
                  d="M0,212 C40,194 70,154 110,158 C150,162 170,206 220,200 C270,194 288,128 332,122 C370,118 398,160 438,150 C478,140 510,82 548,88 C590,94 616,148 648,136 C680,124 706,78 740,86 L740,260 L0,260 Z"
                />
                <path
                  class="crm-line-secondary"
                  d="M0,176 C38,166 84,132 122,136 C156,140 198,184 238,176 C274,168 308,116 346,112 C390,108 422,136 462,132 C498,128 532,108 572,112 C612,116 660,164 740,146"
                />
                <path
                  class="crm-line-primary"
                  d="M0,212 C40,194 70,154 110,158 C150,162 170,206 220,200 C270,194 288,128 332,122 C370,118 398,160 438,150 C478,140 510,82 548,88 C590,94 616,148 648,136 C680,124 706,78 740,86"
                />
              </svg>
              <div class="crm-axis-labels" aria-hidden="true">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>
        </div>

        <div class="crm-pipeline-card">
          <p class="crm-overline">Engagement</p>
          <div class="crm-donut">
            <div class="crm-donut-hole">
              <strong>78%</strong>
              <span>active</span>
            </div>
          </div>
          <div class="crm-pipeline-stats">
            <div>
              <span>Warm</span>
              <strong>43</strong>
            </div>
            <div>
              <span>Hot</span>
              <strong>18</strong>
            </div>
            <div>
              <span>Cold</span>
              <strong>11</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="crm-summary-grid" aria-label="Key metrics">
        ${summaryCards
          .map(
            (card) => `
              <article class="crm-summary-card tone-${card.tone}">
                <p>${card.label}</p>
                <strong>${card.value}</strong>
                <span>${card.delta} vs last month</span>
              </article>
            `
          )
          .join('')}
      </section>

      <section class="crm-content-grid">
        <article class="crm-panel crm-panel-table">
          <div class="crm-panel-head">
            <div>
              <p class="crm-overline">Client list</p>
              <h3>Recent customer activity</h3>
            </div>
            <button class="crm-link-button" type="button">See all</button>
          </div>

          <div class="crm-table">
            <div class="crm-table-head" role="row">
              <span>Client</span>
              <span>Segment</span>
              <span>Last touch</span>
              <span>Stage</span>
              <span>Value</span>
            </div>

            ${clients
              .map(
                (client) => `
                  <article class="crm-table-row">
                    <div class="crm-client-cell">
                      <div class="crm-avatar">${client.initials}</div>
                      <div>
                        <strong>${client.name}</strong>
                        <p>${client.company}</p>
                      </div>
                    </div>
                    <span class="crm-pill tone-${client.tagTone}">${client.tag}</span>
                    <span>${client.lastTouch}</span>
                    <span class="crm-stage tone-${client.stageTone}">${client.stage}</span>
                    <strong>${client.revenue}</strong>
                  </article>
                `
              )
              .join('')}
          </div>
        </article>

        <article class="crm-panel crm-panel-deals">
          <div class="crm-panel-head">
            <div>
              <p class="crm-overline">Top focus</p>
              <h3>Deals in motion</h3>
            </div>
          </div>

          <div class="crm-deal-list">
            ${focusDeals
              .map(
                (deal) => `
                  <article class="crm-deal-card">
                    <div class="crm-deal-copy">
                      <strong>${deal.title}</strong>
                      <p>${deal.owner}</p>
                    </div>
                    <div class="crm-deal-meta">
                      <span>${deal.amount}</span>
                      <small>${deal.progress}%</small>
                    </div>
                    <div class="crm-progress">
                      <span style="width: ${deal.progress}%"></span>
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>
        </article>

        <aside class="crm-panel crm-panel-side">
          <div class="crm-panel-head">
            <div>
              <p class="crm-overline">Today</p>
              <h3>Team activity</h3>
            </div>
          </div>

          <div class="crm-activity-list">
            ${activities
              .map(
                (activity) => `
                  <article class="crm-activity-item">
                    <span class="crm-activity-time">${activity.time}</span>
                    <div>
                      <strong>${activity.title}</strong>
                      <p>${activity.body}</p>
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>

          <section class="crm-note-card">
            <p class="crm-overline">Next step</p>
            <strong>Prepare the renewal counter-offer for Cinder Health.</strong>
            <p>Include a 12-month term option and product onboarding support.</p>
            <button class="crm-primary-button" type="button">Open brief</button>
          </section>
        </aside>
      </section>
    </main>
  </div>
`

const periodButtons = [...app.querySelectorAll('[data-period]')]

periodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    periodButtons.forEach((item) => item.classList.remove('is-active'))
    button.classList.add('is-active')
  })
})
