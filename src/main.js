import './style.css'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('Missing #app mount point')
}

const rangeOptions = [
  ['today', 'TODAY'],
  ['week', 'THIS WEEK'],
  ['month', 'THIS MONTH'],
]

const patients = [
  {
    id: 'emily-smith',
    name: 'EMILY SMITH',
    displayName: 'Emily Smith',
    risk: 'CAUTION',
    condition: 'Pulmonary fibrosis',
    summary: 'Spirometry variance flagged after the morning upload.',
    reviewReady: true,
    newResult: true,
    nextAppointment: '10:00 am',
    insightHours: 9,
    densityDay: 'MO',
    densityHour: '11 AM',
    notes: 'Needs physician sign-off before protocol adjustment.',
  },
  {
    id: 'olivia-chen',
    name: 'OLIVIA CHEN',
    displayName: 'Olivia Chen',
    risk: 'NORMAL',
    condition: 'Post-op respiratory follow-up',
    summary: 'Home saturation has stayed stable for the last 48 hours.',
    reviewReady: true,
    newResult: true,
    nextAppointment: '10:30 am',
    insightHours: 6,
    densityDay: 'TU',
    densityHour: '1 PM',
    notes: 'Eligible for remote follow-up next week.',
  },
  {
    id: 'ben-carter',
    name: 'BEN CARTER',
    displayName: 'Ben Carter',
    risk: 'HIGH RISK',
    condition: 'Oxygen desaturation',
    summary: 'Two overnight alerts exceeded the configured threshold.',
    reviewReady: true,
    newResult: true,
    nextAppointment: '01:00 pm',
    insightHours: 14,
    densityDay: 'FR',
    densityHour: '3 PM',
    notes: 'Consider same-day consult and medication review.',
  },
  {
    id: 'olivia-johnson',
    name: 'OLIVIA JOHNSON',
    displayName: 'Olivia Johnson',
    risk: 'NORMAL',
    condition: 'Asthma control',
    summary: 'Peak flow trend is improving after plan update.',
    reviewReady: true,
    newResult: true,
    nextAppointment: '02:15 pm',
    insightHours: 5,
    densityDay: 'WE',
    densityHour: '9 AM',
    notes: 'Prepare refill recommendation for next visit.',
  },
  {
    id: 'olivia-smith',
    name: 'OLIVIA SMITH',
    displayName: 'Olivia Smith',
    risk: 'HIGH RISK',
    condition: 'Sleep apnea escalation',
    summary: 'CPAP compliance dropped below target for three consecutive nights.',
    reviewReady: true,
    newResult: true,
    nextAppointment: '03:10 pm',
    insightHours: 12,
    densityDay: 'TH',
    densityHour: '10 AM',
    notes: 'Escalate to respiratory therapist if trend continues.',
  },
  {
    id: 'anna-k',
    name: 'ANNA K.',
    displayName: 'Anna K.',
    risk: 'HIGH RISK',
    condition: 'LUNG RISK: HIGH',
    summary: 'CT model identified progression markers in the upper right lobe.',
    reviewReady: false,
    newResult: true,
    nextAppointment: '04:20 pm',
    insightHours: 15,
    densityDay: 'SU',
    densityHour: '5 PM',
    notes: 'Recommend immediate multidisciplinary review.',
  },
  {
    id: 'david-l',
    name: 'DAVID L.',
    displayName: 'David L.',
    risk: 'HIGH RISK',
    condition: 'METABOLIC SHIFT',
    summary: 'Blood panel and respiratory readings suggest systemic stress.',
    reviewReady: false,
    newResult: true,
    nextAppointment: 'Tomorrow 09:30 am',
    insightHours: 13,
    densityDay: 'SU',
    densityHour: '1 PM',
    notes: 'Cross-reference with endocrine notes before outreach.',
  },
]

const appointments = [
  {
    id: 'slot-1000',
    time: '10:00',
    suffix: 'am',
    patientId: 'emily-smith',
    type: 'Review scan anomaly',
    location: 'Clinic room A',
  },
  {
    id: 'slot-1030',
    time: '10:30',
    suffix: 'am',
    patientId: 'olivia-chen',
    type: 'Remote follow-up',
    location: 'Video consult',
  },
  {
    id: 'slot-0100',
    time: '01:00',
    suffix: 'pm',
    patientId: 'ben-carter',
    type: 'Urgent risk review',
    location: 'Clinic room C',
  },
  {
    id: 'slot-0215',
    time: '02:15',
    suffix: 'pm',
    patientId: 'olivia-johnson',
    type: 'Routine check-in',
    location: 'Clinic room B',
  },
  {
    id: 'slot-0310',
    time: '03:10',
    suffix: 'pm',
    patientId: 'olivia-smith',
    type: 'Therapy adherence review',
    location: 'Video consult',
  },
  {
    id: 'slot-0420',
    time: '04:20',
    suffix: 'pm',
    patientId: 'anna-k',
    type: 'Escalation consult',
    location: 'Clinic room D',
  },
]

const insightColumns = [
  { day: 'MO', count: 7, average: '6.8h', note: 'Moderate turnaround after morning intake surge.' },
  { day: 'TU', count: 10, average: '8.4h', note: 'Additional imaging raised clinician review time.' },
  { day: 'WE', count: 7, average: '6.2h', note: 'Stable day with balanced remote monitoring load.' },
  { day: 'TH', count: 3, average: '2.9h', note: 'Lightest day with fewer escalations.' },
  { day: 'FR', count: 14, average: '12.1h', note: 'Peak insight delay due to compounded alerts.' },
  { day: 'SA', count: 2, average: '2.1h', note: 'Weekend staffing handled limited result volume.' },
  { day: 'SU', count: 14, average: '11.8h', note: 'High Sunday intake from home-monitoring alerts.' },
]

const densityRows = ['5 PM', '3 PM', '1 PM', '11 AM', '10 AM', '9 AM']
const densityDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
const heatmap = [
  [1, 1, 0, 1, 1, 1, 1],
  [0, 1, 2, 1, 1, 0, 1],
  [1, 3, 2, 3, 3, 1, 0],
  [1, 2, 1, 2, 2, 2, 0],
  [1, 1, 2, 3, 1, 1, 1],
  [1, 1, 2, 0, 2, 1, 1],
]

const reports = [
  {
    id: 'clinical-summary',
    title: 'Clinical summary',
    description: 'Consolidate all new pulmonary alerts into a physician-ready digest.',
    status: 'Ready',
    lastGenerated: 'Today, 08:10',
  },
  {
    id: 'weekly-risk',
    title: 'Weekly risk digest',
    description: 'Aggregate high-risk events, adherence gaps, and recommended follow-ups.',
    status: 'Needs refresh',
    lastGenerated: 'Yesterday, 17:40',
  },
  {
    id: 'operations-load',
    title: 'Operations load report',
    description: 'Break down appointment density, lab turnaround, and staffing pressure.',
    status: 'Ready',
    lastGenerated: 'Today, 06:30',
  },
]

const accountState = {
  alerts: true,
  digest: true,
  autoAssign: false,
}

const state = {
  view: 'dashboard',
  search: '',
  alertFilter: 'all',
  resultFilter: 'all',
  range: 'today',
  rangeMenuOpen: false,
  selectedInsight: 'FR',
  selectedSchedule: appointments[0].id,
  selectedDensity: 'FR-1 PM',
  drawer: null,
}

const patientMap = new Map(patients.map((patient) => [patient.id, patient]))
const reportMap = new Map(reports.map((report) => [report.id, report]))

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getRangeLabel(range) {
  return rangeOptions.find(([value]) => value === range)?.[1] ?? 'TODAY'
}

function getSearchFilteredPatients() {
  const query = state.search.trim().toLowerCase()
  if (!query) {
    return [...patients]
  }

  return patients.filter((patient) => {
    const haystack = [
      patient.name,
      patient.displayName,
      patient.risk,
      patient.condition,
      patient.summary,
      patient.notes,
      patient.nextAppointment,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

function getDashboardPatients() {
  let list = getSearchFilteredPatients()

  if (state.alertFilter === 'high-risk') {
    list = list.filter((patient) => patient.risk === 'HIGH RISK')
  } else if (state.alertFilter === 'new-results') {
    list = list.filter((patient) => patient.newResult)
  }

  if (state.resultFilter !== 'all') {
    list = list.filter((patient) => patient.risk === state.resultFilter)
  }

  return list
}

function getCounts() {
  const searchFiltered = getSearchFilteredPatients()

  return {
    reviewReady: searchFiltered.filter((patient) => patient.reviewReady).length,
    highRiskAlerts: searchFiltered.filter((patient) => patient.risk === 'HIGH RISK').length,
    newResults: searchFiltered.filter((patient) => patient.newResult).length,
    caution: searchFiltered.filter((patient) => patient.risk === 'CAUTION').length,
    highRisk: searchFiltered.filter((patient) => patient.risk === 'HIGH RISK').length,
    normal: searchFiltered.filter((patient) => patient.risk === 'NORMAL').length,
  }
}

function getSelectedPatient() {
  if (!state.drawer || state.drawer.type !== 'patient') {
    return null
  }

  return patientMap.get(state.drawer.patientId) ?? null
}

function getSelectedInsight() {
  return insightColumns.find((column) => column.day === state.selectedInsight) ?? insightColumns[0]
}

function getSelectedAppointment() {
  return appointments.find((slot) => slot.id === state.selectedSchedule) ?? appointments[0]
}

function getSelectedDensityCell() {
  const [day, hour] = state.selectedDensity.split('-')
  const dayIndex = densityDays.indexOf(day)
  const hourIndex = densityRows.indexOf(hour)
  const load = heatmap[hourIndex]?.[dayIndex] ?? 0

  return {
    day,
    hour,
    load,
  }
}

function describeLoad(load) {
  if (load === 0) return 'Available'
  if (load === 1) return '2 patients'
  if (load === 2) return '3 patients'
  return 'Fully booked'
}

function renderTopbar() {
  return `
    <header class="health-topbar">
      <div class="health-brand">PULMIFY</div>

      <label class="health-search" aria-label="Search patients">
        <span class="health-search-icon" aria-hidden="true"></span>
        <input
          data-search-input
          type="search"
          placeholder="SEARCH PATIENTS..."
          value="${escapeHtml(state.search)}"
        />
      </label>

      <nav class="health-nav" aria-label="Primary">
        ${[
          ['dashboard', 'DASHBOARD'],
          ['patients', 'PATIENT LIST'],
          ['reports', 'REPORTS'],
          ['account', 'ACCOUNT'],
        ]
          .map(
            ([value, label]) => `
              <button
                class="health-nav-button ${state.view === value ? 'is-active' : ''}"
                type="button"
                data-nav="${value}"
              >
                ${label}
              </button>
            `
          )
          .join('')}
      </nav>
    </header>
  `
}

function renderHeading() {
  const counts = getCounts()

  const headingCopy = {
    dashboard: {
      title: "Today's Overview",
      body: `Hello, Dr. Chen! You have ${counts.highRiskAlerts} high-risk alerts.`,
    },
    patients: {
      title: 'Patient List',
      body: `${getSearchFilteredPatients().length} patient profiles match the current filters.`,
    },
    reports: {
      title: 'Clinical Reports',
      body: 'Generate, refresh, and review operational and patient-level report packages.',
    },
    account: {
      title: 'Account Settings',
      body: 'Manage notification preferences, workflow automation, and clinician profile details.',
    },
  }[state.view]

  return `
    <section class="health-heading-row">
      <div>
        <h1>${escapeHtml(headingCopy.title)}</h1>
        <p>${escapeHtml(headingCopy.body)}</p>
      </div>

      <div class="health-alert-strip">
        <button
          class="health-pill health-pill-count ${state.alertFilter === 'high-risk' ? 'is-active' : ''}"
          type="button"
          data-alert-filter="high-risk"
        >
          ${counts.highRiskAlerts}
        </button>
        <button
          class="health-pill health-pill-filter ${state.alertFilter === 'high-risk' ? 'is-active' : ''}"
          type="button"
          data-alert-filter="high-risk"
        >
          HIGH-RISK ALERTS
        </button>
        <button
          class="health-pill health-pill-count ${state.alertFilter === 'new-results' ? 'is-active' : ''}"
          type="button"
          data-alert-filter="new-results"
        >
          ${counts.newResults}
        </button>
        <button
          class="health-pill health-pill-filter ${state.alertFilter === 'new-results' ? 'is-active' : ''}"
          type="button"
          data-alert-filter="new-results"
        >
          NEW RESULTS READY
        </button>
        <div class="health-range-menu">
          <button class="health-pill health-pill-select" type="button" data-range-toggle>
            ${getRangeLabel(state.range)}
            <span class="health-chevron ${state.rangeMenuOpen ? 'is-open' : ''}" aria-hidden="true"></span>
          </button>

          ${
            state.rangeMenuOpen
              ? `
                <div class="health-range-options">
                  ${rangeOptions
                    .map(
                      ([value, label]) => `
                        <button
                          class="health-range-option ${state.range === value ? 'is-active' : ''}"
                          type="button"
                          data-range-option="${value}"
                        >
                          ${label}
                        </button>
                      `
                    )
                    .join('')}
                </div>
              `
              : ''
          }
        </div>
      </div>
    </section>
  `
}

function renderQuickActions() {
  return `
    <article class="health-card health-card-quick">
      <header class="health-card-head">
        <span>QUICK ACCESS</span>
      </header>

      <div class="health-quick-panel">
        <div class="health-link-list">
          <button class="health-link-button" type="button" data-quick-action="new-appointment">[+] NEW APPOINTMENT</button>
          <button class="health-link-button" type="button" data-quick-action="all-patients">[->] ALL PATIENTS</button>
          <button class="health-link-button" type="button" data-quick-action="generate-report">[->] GENERATE REPORT</button>
          <button class="health-link-button" type="button" data-quick-action="order-kits">[->] ORDER KITS</button>
        </div>
      </div>
    </article>
  `
}

function renderReviewCard(list) {
  return `
    <article class="health-card health-card-metric">
      <header class="health-card-head">
        <span>READY FOR REVIEW</span>
      </header>

      <div class="health-card-body">
        <strong class="health-big-number">${String(list.length).padStart(2, '0')}</strong>
        <ul class="health-data-list">
          ${
            list.length
              ? list
                  .map(
                    (patient) => `
                      <li>
                        <span>${escapeHtml(patient.name)}</span>
                        <button class="health-inline-action" type="button" data-open-patient="${patient.id}">[VIEW ->]</button>
                      </li>
                    `
                  )
                  .join('')
              : '<li class="health-empty-row"><span>No matching patients.</span></li>'
          }
        </ul>
      </div>
    </article>
  `
}

function renderRiskCard(list) {
  return `
    <article class="health-card health-card-metric">
      <header class="health-card-head">
        <span>HIGH-RISK PATIENTS</span>
      </header>

      <div class="health-card-body">
        <strong class="health-big-number">${String(list.length).padStart(2, '0')}</strong>
        <ul class="health-data-list">
          ${
            list.length
              ? list
                  .map(
                    (patient) => `
                      <li>
                        <span>${escapeHtml(patient.name)} <em>|</em> ${escapeHtml(patient.condition)}</span>
                        <button class="health-inline-action" type="button" data-open-patient="${patient.id}">[VIEW ->]</button>
                      </li>
                    `
                  )
                  .join('')
              : '<li class="health-empty-row"><span>No matching alerts.</span></li>'
          }
        </ul>
      </div>
    </article>
  `
}

function renderInsightCard() {
  const selectedInsight = getSelectedInsight()

  return `
    <article class="health-card health-card-insight">
      <header class="health-card-head health-card-head-split">
        <span>TIME TO INSIGHT</span>
        <span>${escapeHtml(selectedInsight.average)} / ${getRangeLabel(state.range)}</span>
      </header>

      <div class="health-insight-panel">
        <div class="health-y-axis" aria-hidden="true">
          <span>16H</span>
          <span>12H</span>
          <span>8H</span>
          <span>4H</span>
          <span>0H</span>
        </div>

        <div class="health-bubble-chart">
          ${insightColumns
            .map(
              (column) => `
                <button
                  class="health-bubble-column ${state.selectedInsight === column.day ? 'is-active' : ''}"
                  type="button"
                  data-open-insight="${column.day}"
                >
                  <div class="health-bubbles" aria-hidden="true">
                    ${Array.from({ length: column.count }, () => '<span class="health-bubble"></span>').join('')}
                  </div>
                  <small>${column.day}</small>
                </button>
              `
            )
            .join('')}
        </div>
      </div>

      <p class="health-card-footnote">${escapeHtml(selectedInsight.note)}</p>
    </article>
  `
}

function renderScheduleCard() {
  return `
    <article class="health-card health-card-schedule">
      <header class="health-card-head">
        <span>TODAY'S SCHEDULE</span>
      </header>

      <div class="health-time-grid">
        ${appointments
          .map(
            (slot) => `
              <button
                class="health-time-slot ${state.selectedSchedule === slot.id ? 'is-active' : ''}"
                type="button"
                data-open-slot="${slot.id}"
              >
                <strong>${slot.time}</strong>
                <span>${slot.suffix}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </article>
  `
}

function renderDensityCard() {
  const selectedDensity = getSelectedDensityCell()

  return `
    <article class="health-card health-card-density">
      <header class="health-card-head health-card-head-split">
        <span>UPCOMING WEEK</span>
        <span>${escapeHtml(describeLoad(selectedDensity.load).toUpperCase())}</span>
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
            ${densityRows.map((hour) => `<span>${hour}</span>`).join('')}
          </div>

          <div class="health-density-board">
            ${heatmap
              .map(
                (row, rowIndex) => `
                  <div class="health-density-row">
                    ${row
                      .map((tone, columnIndex) => {
                        const day = densityDays[columnIndex]
                        const hour = densityRows[rowIndex]
                        const key = `${day}-${hour}`

                        return `
                          <button
                            class="health-density-cell tone-${tone} ${state.selectedDensity === key ? 'is-active' : ''}"
                            type="button"
                            data-open-density="${key}"
                            aria-label="${day} ${hour} ${describeLoad(tone)}"
                          ></button>
                        `
                      })
                      .join('')}
                  </div>
                `
              )
              .join('')}

            <div class="health-density-days" aria-hidden="true">
              ${densityDays.map((day) => `<span>${day}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </article>
  `
}

function renderResultsCard() {
  const counts = getCounts()
  const options = [
    ['CAUTION', counts.caution, false],
    ['HIGH RISK', counts.highRisk, true],
    ['NORMAL', counts.normal, false],
  ]

  return `
    <article class="health-card health-card-results">
      <header class="health-card-head">
        <span>TODAY'S RESULTS</span>
      </header>

      <div class="health-result-stack">
        ${options
          .map(
            ([label, count, highlight]) => `
              <button
                class="health-result-card ${highlight ? 'is-highlight' : ''} ${state.resultFilter === label ? 'is-active' : ''}"
                type="button"
                data-result-filter="${label}"
              >
                <strong>${String(count).padStart(2, '0')}</strong>
                <span>${label}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </article>
  `
}

function renderDashboard() {
  const dashboardPatients = getDashboardPatients()
  const reviewList = dashboardPatients.filter((patient) => patient.reviewReady).slice(0, 5)
  const riskList = dashboardPatients.filter((patient) => patient.risk === 'HIGH RISK').slice(0, 3)

  return `
    <section class="health-grid health-grid-top">
      ${renderQuickActions()}
      ${renderReviewCard(reviewList)}
      ${renderRiskCard(riskList)}
      ${renderInsightCard()}
    </section>

    <section class="health-grid health-grid-bottom">
      ${renderScheduleCard()}
      ${renderDensityCard()}
      ${renderResultsCard()}
    </section>
  `
}

function renderPatientsView() {
  const list = getSearchFilteredPatients()

  return `
    <section class="health-view-card health-view-card-wide">
      <header class="health-card-head health-card-head-split">
        <span>PATIENT DIRECTORY</span>
        <span>${list.length} MATCHING RECORDS</span>
      </header>

      <div class="health-patient-table">
        <div class="health-patient-table-head">
          <span>PATIENT</span>
          <span>RISK</span>
          <span>NEXT APPOINTMENT</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>

        ${
          list.length
            ? list
                .map(
                  (patient) => `
                    <article class="health-patient-row">
                      <div>
                        <strong>${escapeHtml(patient.displayName)}</strong>
                        <p>${escapeHtml(patient.condition)}</p>
                      </div>
                      <span class="health-tag ${patient.risk === 'HIGH RISK' ? 'is-dark' : ''}">${escapeHtml(patient.risk)}</span>
                      <span>${escapeHtml(patient.nextAppointment)}</span>
                      <span>${patient.reviewReady ? 'Ready for review' : 'Monitoring'}</span>
                      <button class="health-inline-action" type="button" data-open-patient="${patient.id}">OPEN</button>
                    </article>
                  `
                )
                .join('')
            : '<p class="health-empty-state">No patient records match the current search.</p>'
        }
      </div>
    </section>
  `
}

function renderReportsView() {
  return `
    <section class="health-reports-grid">
      ${reports
        .map(
          (report) => `
            <article class="health-view-card">
              <header class="health-card-head health-card-head-split">
                <span>${escapeHtml(report.title.toUpperCase())}</span>
                <span>${escapeHtml(report.status.toUpperCase())}</span>
              </header>
              <div class="health-view-body">
                <p>${escapeHtml(report.description)}</p>
                <small>LAST GENERATED: ${escapeHtml(report.lastGenerated.toUpperCase())}</small>
                <div class="health-card-actions">
                  <button class="health-action-button" type="button" data-report-action="generate" data-report-id="${report.id}">
                    ${report.status === 'Ready' ? 'REFRESH' : 'GENERATE'}
                  </button>
                  <button class="health-action-button is-ghost" type="button" data-report-action="open" data-report-id="${report.id}">
                    OPEN
                  </button>
                </div>
              </div>
            </article>
          `
        )
        .join('')}
    </section>
  `
}

function renderAccountView() {
  return `
    <section class="health-account-grid">
      <article class="health-view-card">
        <header class="health-card-head">
          <span>PROFILE</span>
        </header>
        <div class="health-view-body">
          <strong class="health-profile-name">Dr. Ethan Chen</strong>
          <p>Pulmonary monitoring lead with AI-assisted triage workflow enabled for all incoming result streams.</p>
          <small>PRIMARY CLINIC: CENTRAL RESPIRATORY UNIT</small>
        </div>
      </article>

      <article class="health-view-card">
        <header class="health-card-head">
          <span>PREFERENCES</span>
        </header>
        <div class="health-toggle-list">
          ${[
            ['alerts', 'HIGH-RISK ALERT PUSH', accountState.alerts],
            ['digest', 'DAILY CLINICAL DIGEST', accountState.digest],
            ['autoAssign', 'AUTO-ASSIGN FOLLOW-UPS', accountState.autoAssign],
          ]
            .map(
              ([key, label, enabled]) => `
                <button
                  class="health-toggle ${enabled ? 'is-enabled' : ''}"
                  type="button"
                  data-account-toggle="${key}"
                >
                  <span>${label}</span>
                  <strong>${enabled ? 'ON' : 'OFF'}</strong>
                </button>
              `
            )
            .join('')}
        </div>
      </article>
    </section>
  `
}

function renderDrawer() {
  if (!state.drawer) {
    return ''
  }

  let title = 'DETAIL'
  let body = ''

  if (state.drawer.type === 'patient') {
    const patient = patientMap.get(state.drawer.patientId)

    if (!patient) {
      return ''
    }

    title = patient.displayName
    body = `
      <div class="health-drawer-metrics">
        <div><span>RISK</span><strong>${escapeHtml(patient.risk)}</strong></div>
        <div><span>INSIGHT</span><strong>${escapeHtml(`${patient.insightHours}h avg`)}</strong></div>
        <div><span>NEXT</span><strong>${escapeHtml(patient.nextAppointment)}</strong></div>
      </div>
      <p>${escapeHtml(patient.summary)}</p>
      <p>${escapeHtml(patient.notes)}</p>
      <div class="health-card-actions">
        <button class="health-action-button" type="button" data-mark-reviewed="${patient.id}">
          ${patient.reviewReady ? 'MARK REVIEWED' : 'REOPEN REVIEW'}
        </button>
        <button class="health-action-button is-ghost" type="button" data-schedule-followup="${patient.id}">
          SCHEDULE FOLLOW-UP
        </button>
      </div>
    `
  } else if (state.drawer.type === 'slot') {
    const slot = appointments.find((appointment) => appointment.id === state.drawer.slotId)
    const patient = slot ? patientMap.get(slot.patientId) : null

    if (!slot || !patient) {
      return ''
    }

    title = `${slot.time} ${slot.suffix}`
    body = `
      <div class="health-drawer-metrics">
        <div><span>PATIENT</span><strong>${escapeHtml(patient.displayName)}</strong></div>
        <div><span>TYPE</span><strong>${escapeHtml(slot.type)}</strong></div>
        <div><span>LOCATION</span><strong>${escapeHtml(slot.location)}</strong></div>
      </div>
      <p>${escapeHtml(patient.summary)}</p>
      <div class="health-card-actions">
        <button class="health-action-button" type="button" data-open-patient="${patient.id}">OPEN PROFILE</button>
      </div>
    `
  } else if (state.drawer.type === 'density') {
    const density = getSelectedDensityCell()
    title = `${density.day} ${density.hour}`
    body = `
      <div class="health-drawer-metrics">
        <div><span>CAPACITY</span><strong>${escapeHtml(describeLoad(density.load).toUpperCase())}</strong></div>
        <div><span>RANGE</span><strong>${escapeHtml(getRangeLabel(state.range))}</strong></div>
      </div>
      <p>This slot reflects the projected appointment density for the selected operational window.</p>
    `
  } else if (state.drawer.type === 'insight') {
    const insight = getSelectedInsight()
    title = `${insight.day} INSIGHT`
    body = `
      <div class="health-drawer-metrics">
        <div><span>AVERAGE</span><strong>${escapeHtml(insight.average)}</strong></div>
        <div><span>BUBBLES</span><strong>${insight.count}</strong></div>
      </div>
      <p>${escapeHtml(insight.note)}</p>
    `
  } else if (state.drawer.type === 'report') {
    const report = reportMap.get(state.drawer.reportId)

    if (!report) {
      return ''
    }

    title = report.title
    body = `
      <div class="health-drawer-metrics">
        <div><span>STATUS</span><strong>${escapeHtml(report.status.toUpperCase())}</strong></div>
        <div><span>UPDATED</span><strong>${escapeHtml(report.lastGenerated.toUpperCase())}</strong></div>
      </div>
      <p>${escapeHtml(report.description)}</p>
      <div class="health-card-actions">
        <button class="health-action-button" type="button" data-report-action="generate" data-report-id="${report.id}">
          ${report.status === 'Ready' ? 'REFRESH NOW' : 'GENERATE NOW'}
        </button>
      </div>
    `
  } else if (state.drawer.type === 'action') {
    title = state.drawer.title
    body = `<p>${escapeHtml(state.drawer.body)}</p>`
  }

  return `
    <div class="health-drawer-backdrop" data-drawer-close></div>
    <aside class="health-drawer" role="dialog" aria-modal="true" aria-labelledby="health-drawer-title">
      <div class="health-drawer-head">
        <div>
          <span>ACTIVE DETAIL</span>
          <h2 id="health-drawer-title">${escapeHtml(title)}</h2>
        </div>
        <button class="health-drawer-close" type="button" data-drawer-close>+</button>
      </div>
      <div class="health-drawer-body">${body}</div>
    </aside>
  `
}

function renderBody() {
  if (state.view === 'dashboard') {
    return renderDashboard()
  }

  if (state.view === 'patients') {
    return renderPatientsView()
  }

  if (state.view === 'reports') {
    return renderReportsView()
  }

  return renderAccountView()
}

function render() {
  app.innerHTML = `
    <div class="health-page">
      <div class="health-surface">
        ${renderTopbar()}
        ${renderHeading()}
        ${renderBody()}
      </div>
      ${renderDrawer()}
    </div>
  `

  document.body.classList.toggle('is-drawer-open', Boolean(state.drawer))
}

function rerender({ focusSearch = false } = {}) {
  const cursorPosition = focusSearch ? state.search.length : 0
  render()

  if (focusSearch) {
    const input = app.querySelector('[data-search-input]')
    input?.focus()
    input?.setSelectionRange(cursorPosition, cursorPosition)
  }
}

function openActionDrawer(title, body) {
  state.drawer = {
    type: 'action',
    title,
    body,
  }
}

app.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest('[data-nav], [data-alert-filter], [data-range-toggle], [data-range-option], [data-quick-action], [data-open-patient], [data-open-slot], [data-open-density], [data-open-insight], [data-result-filter], [data-report-action], [data-account-toggle], [data-mark-reviewed], [data-schedule-followup], [data-drawer-close]') : null

  if (!target) {
    if (state.rangeMenuOpen) {
      state.rangeMenuOpen = false
      rerender()
    }
    return
  }

  if (target.hasAttribute('data-nav')) {
    state.view = target.getAttribute('data-nav') ?? 'dashboard'
    state.drawer = null
    state.rangeMenuOpen = false
    rerender()
    return
  }

  if (target.hasAttribute('data-alert-filter')) {
    const nextFilter = target.getAttribute('data-alert-filter') ?? 'all'
    state.alertFilter = state.alertFilter === nextFilter ? 'all' : nextFilter
    rerender()
    return
  }

  if (target.hasAttribute('data-range-toggle')) {
    state.rangeMenuOpen = !state.rangeMenuOpen
    rerender()
    return
  }

  if (target.hasAttribute('data-range-option')) {
    state.range = target.getAttribute('data-range-option') ?? 'today'
    state.rangeMenuOpen = false
    openActionDrawer('Range updated', `Dashboard metrics now reflect ${getRangeLabel(state.range)}.`)
    rerender()
    return
  }

  if (target.hasAttribute('data-quick-action')) {
    const action = target.getAttribute('data-quick-action')

    if (action === 'new-appointment') {
      state.drawer = {
        type: 'slot',
        slotId: state.selectedSchedule,
      }
    } else if (action === 'all-patients') {
      state.view = 'patients'
      state.drawer = null
    } else if (action === 'generate-report') {
      state.view = 'reports'
      state.drawer = {
        type: 'report',
        reportId: reports[0].id,
      }
    } else if (action === 'order-kits') {
      openActionDrawer('Order kits', 'Kit ordering was queued for the currently selected monitoring cohort.')
    }

    rerender()
    return
  }

  if (target.hasAttribute('data-open-patient')) {
    state.drawer = {
      type: 'patient',
      patientId: target.getAttribute('data-open-patient') ?? '',
    }
    rerender()
    return
  }

  if (target.hasAttribute('data-open-slot')) {
    state.selectedSchedule = target.getAttribute('data-open-slot') ?? appointments[0].id
    state.drawer = {
      type: 'slot',
      slotId: state.selectedSchedule,
    }
    rerender()
    return
  }

  if (target.hasAttribute('data-open-density')) {
    state.selectedDensity = target.getAttribute('data-open-density') ?? state.selectedDensity
    state.drawer = { type: 'density' }
    rerender()
    return
  }

  if (target.hasAttribute('data-open-insight')) {
    state.selectedInsight = target.getAttribute('data-open-insight') ?? state.selectedInsight
    state.drawer = { type: 'insight' }
    rerender()
    return
  }

  if (target.hasAttribute('data-result-filter')) {
    const nextFilter = target.getAttribute('data-result-filter') ?? 'all'
    state.resultFilter = state.resultFilter === nextFilter ? 'all' : nextFilter
    rerender()
    return
  }

  if (target.hasAttribute('data-report-action')) {
    const action = target.getAttribute('data-report-action')
    const reportId = target.getAttribute('data-report-id') ?? ''
    const report = reportMap.get(reportId)

    if (!report) {
      return
    }

    if (action === 'generate') {
      report.status = 'Ready'
      report.lastGenerated = `Today, ${state.range === 'today' ? '09:42' : state.range === 'week' ? '10:15' : '11:08'}`
      state.drawer = { type: 'report', reportId }
    } else if (action === 'open') {
      state.drawer = { type: 'report', reportId }
    }

    rerender()
    return
  }

  if (target.hasAttribute('data-account-toggle')) {
    const key = target.getAttribute('data-account-toggle')
    accountState[key] = !accountState[key]
    openActionDrawer('Preference updated', `${key} is now ${accountState[key] ? 'enabled' : 'disabled'}.`)
    rerender()
    return
  }

  if (target.hasAttribute('data-mark-reviewed')) {
    const patient = patientMap.get(target.getAttribute('data-mark-reviewed') ?? '')
    if (patient) {
      patient.reviewReady = !patient.reviewReady
      state.drawer = { type: 'patient', patientId: patient.id }
    }
    rerender()
    return
  }

  if (target.hasAttribute('data-schedule-followup')) {
    const patient = patientMap.get(target.getAttribute('data-schedule-followup') ?? '')
    if (patient) {
      patient.nextAppointment = `${getSelectedAppointment().time} ${getSelectedAppointment().suffix}`
      openActionDrawer('Follow-up scheduled', `${patient.displayName} was assigned to ${patient.nextAppointment}.`)
    }
    rerender()
    return
  }

  if (target.hasAttribute('data-drawer-close')) {
    state.drawer = null
    rerender()
  }
})

app.addEventListener('input', (event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement) || target.dataset.searchInput === undefined) {
    return
  }

  state.search = target.value
  rerender({ focusSearch: true })
})

render()
