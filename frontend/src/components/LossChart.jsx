import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import PropTypes from 'prop-types'

// Register Chart.js components once at module level
ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
)

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Reduce an array to at most `maxPoints` evenly spaced elements. */
function subsample(arr, maxPoints = 300) {
  if (arr.length <= maxPoints) return arr
  const step = Math.ceil(arr.length / maxPoints)
  return arr.filter((_, i) => i % step === 0)
}

// ── Static chart options (no re-creation on every render) ────────────────────
const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: 'easeInOutQuart' },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0d1427',
      borderColor:     '#172344',
      borderWidth:     1,
      titleColor:      '#60a5fa',
      bodyColor:       '#94a3b8',
      padding:         10,
      callbacks: {
        label: ctx => ` Loss: ${ctx.parsed.y.toFixed(6)}`,
        title: ([ctx]) => `Epoch ${ctx.label}`,
      },
    },
  },
  scales: {
    x: {
      grid:   { color: 'rgba(255,255,255,0.04)' },
      border: { color: '#172344' },
      ticks:  { color: '#64748b', font: { size: 11, family: 'JetBrains Mono' }, maxTicksLimit: 7 },
      title:  { display: true, text: 'Epoch', color: '#64748b', font: { size: 12 } },
    },
    y: {
      grid:   { color: 'rgba(255,255,255,0.04)' },
      border: { color: '#172344' },
      ticks:  { color: '#64748b', font: { size: 11, family: 'JetBrains Mono' }, maxTicksLimit: 6 },
      title:  { display: true, text: 'MSE Loss', color: '#64748b', font: { size: 12 } },
    },
  },
}

// ── Empty state placeholder ───────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-52 gap-3 text-gray-600">
      <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-sm">Train the model to see the loss curve.</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LossChart({ lossHistory }) {
  const sampled = useMemo(() => subsample(lossHistory, 300), [lossHistory])

  const data = useMemo(() => {
    const n = lossHistory.length
    return {
      labels: sampled.map((_, i) => {
        // Compute the real epoch number corresponding to this sampled point
        const epoch = Math.round((i / Math.max(sampled.length - 1, 1)) * (n - 1))
        return epoch
      }),
      datasets: [
        {
          label:            'Training Loss',
          data:             sampled,
          borderColor:      '#3b82f6',
          backgroundColor:  'rgba(59,130,246,0.10)',
          borderWidth:      2,
          pointRadius:      0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#60a5fa',
          tension:          0.35,
          fill:             true,
        },
      ],
    }
  }, [sampled, lossHistory.length])

  const isEmpty      = lossHistory.length === 0
  const finalLoss    = isEmpty ? null : lossHistory[lossHistory.length - 1]
  const initialLoss  = isEmpty ? null : lossHistory[0]
  const improvement  = initialLoss && finalLoss ? ((1 - finalLoss / initialLoss) * 100).toFixed(1) : null

  return (
    <div className="card p-5 flex flex-col gap-4 animate-fade-in">
      <p className="card-title">Training Loss</p>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* Stats row */}
          <div className="flex gap-4">
            <Stat label="Final Loss"   value={finalLoss.toFixed(6)}  mono />
            <Stat label="Improvement"  value={`${improvement}%`}     mono />
            <Stat label="Data Points"  value={lossHistory.length}    mono />
          </div>

          {/* Chart */}
          <div style={{ height: '210px' }}>
            <Line data={data} options={CHART_OPTIONS} />
          </div>
        </>
      )}
    </div>
  )
}

LossChart.propTypes = {
  lossHistory: PropTypes.arrayOf(PropTypes.number).isRequired,
}

// ── Small stat badge ──────────────────────────────────────────────────────────
function Stat({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-semibold text-brand-400 ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  mono:  PropTypes.bool,
}
