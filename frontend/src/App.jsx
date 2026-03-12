import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { trainNetwork }    from './services/api'
import ControlsPanel       from './components/ControlsPanel'
import LossChart           from './components/LossChart'
import DecisionBoundary    from './components/DecisionBoundary'
import NetworkGraph        from './components/NetworkGraph'

// ── Default hyperparameter state ──────────────────────────────────────────────
const DEFAULT_CONFIG = {
  learningRate:  0.1,
  epochs:        5000,
  hiddenNeurons: 4,
}

// ── Root component ────────────────────────────────────────────────────────────
export default function App() {
  // Hyperparameters (controlled by ControlsPanel)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  // Training results
  const [lossHistory,      setLossHistory]      = useState([])
  const [predictions,      setPredictions]      = useState([])
  const [decisionBoundary, setDecisionBoundary] = useState([])

  // UI state
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [trained, setTrained] = useState(false)

  // ── Train handler ───────────────────────────────────────────────────────────
  const handleTrain = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await trainNetwork(config)
      setLossHistory(data.loss_history)
      setPredictions(data.predictions)
      setDecisionBoundary(data.boundary)
      setTrained(true)
    } catch (err) {
      // Distinguish network errors (backend not running) from API errors
      const isNetworkError = !err.response
      setError(
        isNetworkError
          ? 'Cannot reach the FastAPI backend. Start it with: uvicorn backend.api.server:app --reload'
          : `Training failed: ${err.response?.data?.detail ?? err.message}`
      )
    } finally {
      setLoading(false)
    }
  }, [config])

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Header trained={trained} loading={loading} />

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="mx-6 mt-4 px-4 py-3 flex items-start gap-2.5
                     bg-red-950/60 border border-red-700/40 rounded-xl
                     text-sm text-red-300 animate-fade-in"
        >
          <span className="mt-0.5 text-red-400 flex-shrink-0">⚠</span>
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 text-red-500 hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Main two-column layout ───────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-[1440px] mx-auto w-full">

        {/* Left panel — controls, fixed width on large screens */}
        <div className="lg:w-[290px] flex-shrink-0">
          <ControlsPanel
            config={config}
            setConfig={setConfig}
            onTrain={handleTrain}
            loading={loading}
          />
        </div>

        {/* Right panel — visualisations in a 2-column responsive grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-min">

          {/* Training loss line chart */}
          <LossChart lossHistory={lossHistory} />

          {/* Decision boundary heatmap */}
          <DecisionBoundary boundary={decisionBoundary} />

          {/* Network architecture + predictions table — full width */}
          <div className="md:col-span-2">
            <NetworkGraph
              hiddenNeurons={config.hiddenNeurons}
              predictions={predictions}
            />
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-4 border-t border-dark-700 text-center text-xs text-gray-700">
        Neural Network Visualizer · XOR problem · FastAPI + React + TailwindCSS
      </footer>
    </div>
  )
}

// ── Header sub-component ──────────────────────────────────────────────────────
function Header({ trained, loading }) {
  return (
    <header className="relative border-b border-dark-700 overflow-hidden">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-transparent" />

      <div className="relative flex items-center justify-between px-6 py-4">

        {/* Brand mark + title */}
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div className="w-9 h-9 rounded-xl bg-brand-600/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">
              Neural Network Visualizer
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Learning the XOR problem via backpropagation
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors duration-500 ${
          loading
            ? 'text-blue-300  border-blue-700/40  bg-blue-900/20'
            : trained
              ? 'text-emerald-400 border-emerald-700/40 bg-emerald-900/20'
              : 'text-gray-500  border-dark-600    bg-dark-800/60'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            loading ? 'bg-blue-400 animate-pulse'
                    : trained ? 'bg-emerald-400 animate-pulse'
                               : 'bg-gray-600'
          }`} />
          {loading ? 'Training…' : trained ? 'Model trained' : 'Awaiting training'}
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  trained: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
}
