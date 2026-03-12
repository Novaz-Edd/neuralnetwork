import PropTypes from 'prop-types'

// ── Hyperparameter bounds ─────────────────────────────────────────────────────
const BOUNDS = {
  learningRate:  { min: 0.001, max: 0.5,   step: 0.001 },
  epochs:        { min: 100,  max: 10000,  step: 100   },
  hiddenNeurons: { min: 2,    max: 32,     step: 1     },
}

// ── Custom slider with filled track ──────────────────────────────────────────
function Slider({ label, name, value, onChange, min, max, step }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="label">{label}</label>
        <span className="text-xs font-mono text-brand-400">
          {name === 'learningRate' ? value.toFixed(3) : value}
        </span>
      </div>

      <input
        id={name}
        type="range"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #2563eb ${pct}%, #172344 ${pct}%)`,
        }}
      />

      {/* Min / max hint */}
      <div className="flex justify-between text-gray-600 text-xs font-mono">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

Slider.propTypes = {
  label:    PropTypes.string.isRequired,
  name:     PropTypes.string.isRequired,
  value:    PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min:      PropTypes.number.isRequired,
  max:      PropTypes.number.isRequired,
  step:     PropTypes.number.isRequired,
}

// ── Number text input ─────────────────────────────────────────────────────────
function NumberInput({ label, name, value, onChange, min, max, step }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="label">{label}</label>
      <input
        id={name}
        type="number"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className="input-field"
      />
    </div>
  )
}

NumberInput.propTypes = {
  label:    PropTypes.string.isRequired,
  name:     PropTypes.string.isRequired,
  value:    PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min:      PropTypes.number.isRequired,
  max:      PropTypes.number.isRequired,
  step:     PropTypes.number.isRequired,
}

// ── Loading spinner SVG ───────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ControlsPanel({ config, setConfig, onTrain, loading }) {
  function handleChange(e) {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: Number(value) }))
  }

  return (
    <aside className="card p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white">Training Config</h2>
        <p className="text-xs text-gray-500 mt-0.5">XOR problem · 4 samples</p>
      </div>

      <hr className="border-dark-600" />

      {/* Learning rate slider */}
      <Slider
        label="Learning Rate"
        name="learningRate"
        value={config.learningRate}
        onChange={handleChange}
        {...BOUNDS.learningRate}
      />

      {/* Epochs number input */}
      <NumberInput
        label="Epochs"
        name="epochs"
        value={config.epochs}
        onChange={handleChange}
        {...BOUNDS.epochs}
      />

      {/* Hidden neurons number input */}
      <NumberInput
        label="Hidden Neurons"
        name="hiddenNeurons"
        value={config.hiddenNeurons}
        onChange={handleChange}
        {...BOUNDS.hiddenNeurons}
      />

      <hr className="border-dark-600" />

      {/* Architecture quick-view */}
      <div className="space-y-2">
        <p className="label">Architecture</p>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 rounded-md bg-dark-700 text-gray-400">2</span>
          <span className="text-dark-500">→</span>
          <span className="px-2 py-1 rounded-md bg-brand-800/40 text-brand-400 border border-brand-700/30">
            {config.hiddenNeurons}
          </span>
          <span className="text-dark-500">→</span>
          <span className="px-2 py-1 rounded-md bg-dark-700 text-gray-400">1</span>
        </div>
        <p className="text-xs text-gray-600">ReLU hidden · Sigmoid output · MSE loss</p>
      </div>

      {/* Train button */}
      <button
        onClick={onTrain}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner />
            Training…
          </span>
        ) : (
          '▶  Train Model'
        )}
      </button>
    </aside>
  )
}

ControlsPanel.propTypes = {
  config: PropTypes.shape({
    learningRate:  PropTypes.number.isRequired,
    epochs:        PropTypes.number.isRequired,
    hiddenNeurons: PropTypes.number.isRequired,
  }).isRequired,
  setConfig: PropTypes.func.isRequired,
  onTrain:   PropTypes.func.isRequired,
  loading:   PropTypes.bool.isRequired,
}
