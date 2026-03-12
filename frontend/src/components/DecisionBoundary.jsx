import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

// ── Constants ─────────────────────────────────────────────────────────────────
const CANVAS_SIZE = 300           // CSS and pixel size
const RESOLUTION  = 50            // must match backend's resolution
const CELL        = CANVAS_SIZE / (RESOLUTION - 1) // px per grid cell

// XOR training inputs and their expected class labels
const XOR_POINTS = [
  { x: 0, y: 0, label: 0 },
  { x: 0, y: 1, label: 1 },
  { x: 1, y: 0, label: 1 },
  { x: 1, y: 1, label: 0 },
]

// ── Colour helpers ────────────────────────────────────────────────────────────

/**
 * Map a prediction value [0, 1] to an RGB triple.
 * Blue (class 0) → purple midpoint → red (class 1).
 */
function valueToRgb(v) {
  const r = Math.round(37  + (220 - 37)  * v)
  const g = Math.round(99  + (38  - 99)  * v)
  const b = Math.round(235 + (38  - 235) * v)
  return [r, g, b]
}

/**
 * Map a domain coordinate in [-0.5, 1.5] to a canvas pixel in [0, CANVAS_SIZE].
 */
const toPixel = v => ((v + 0.5) / 2) * CANVAS_SIZE

// ── Empty-state placeholder ───────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-52 gap-3 text-gray-600">
      <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
      <p className="text-sm">Train the model to see the decision boundary.</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DecisionBoundary({ boundary }) {
  const canvasRef = useRef(null)
  const isEmpty   = boundary.length === 0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return

    const ctx = canvas.getContext('2d')

    // Clear previous render
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // ── Draw heatmap cells ──────────────────────────────────────────────────
    boundary.forEach(({ x, y, value }) => {
      const px = toPixel(x)
      const py = CANVAS_SIZE - toPixel(y)  // flip Y axis
      const [r, g, b] = valueToRgb(value)
      ctx.fillStyle = `rgba(${r},${g},${b},0.88)`
      // +1 px overlap prevents seam gaps between cells
      ctx.fillRect(px - CELL / 2, py - CELL / 2, CELL + 1, CELL + 1)
    })

    // ── Overlay XOR training points ─────────────────────────────────────────
    XOR_POINTS.forEach(({ x, y, label }) => {
      const px = toPixel(x)
      const py = CANVAS_SIZE - toPixel(y)  // flip Y axis

      // Shadow ring
      ctx.beginPath()
      ctx.arc(px, py, 10, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fill()

      // Coloured fill: amber = class 1, emerald = class 0
      ctx.beginPath()
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.fillStyle = label === 1 ? '#fbbf24' : '#34d399'
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Label digit
      ctx.fillStyle = '#000'
      ctx.font = 'bold 9px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(label), px, py)
    })
  }, [boundary, isEmpty])

  return (
    <div className="card p-5 flex flex-col gap-4 animate-fade-in">
      <p className="card-title">Decision Boundary</p>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* Heatmap canvas */}
          <div className="flex justify-center">
            <div className="relative rounded-xl overflow-hidden ring-1 ring-dark-500 shadow-card">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{ display: 'block', width: CANVAS_SIZE, height: CANVAS_SIZE }}
                aria-label="Decision boundary heatmap"
              />

              {/* Axis labels */}
              <span className="absolute bottom-1.5 right-2 text-xs text-white/50 font-mono select-none">
                X₁ →
              </span>
              <span
                className="absolute top-2 left-1.5 text-xs text-white/50 font-mono select-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                ← X₂
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#34d399]" />
              Output ≈ 0
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#fbbf24]" />
              Output ≈ 1
            </span>
          </div>
        </>
      )}
    </div>
  )
}

DecisionBoundary.propTypes = {
  boundary: PropTypes.arrayOf(
    PropTypes.shape({
      x:     PropTypes.number.isRequired,
      y:     PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
}
