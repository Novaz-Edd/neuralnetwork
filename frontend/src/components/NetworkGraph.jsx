import React from 'react'
import PropTypes from 'prop-types'

// ── Layout constants ──────────────────────────────────────────────────────────
const NODE_R     = 26    // node circle radius (bigger for readability)
const MAX_HIDDEN = 10    // cap displayed nodes before showing ellipsis
const NODE_GAP   = 64   // minimum vertical pixels between node centres
const PAD_TOP    = 52   // space above first node (for column labels)
const PAD_BOT    = 32   // space below last node

const SVG_W = 640
// X-positions for the three columns
const COL = { input: 90, hidden: 320, output: 550 }

// XOR ground truth
const XOR_INPUTS   = [[0, 0], [0, 1], [1, 0], [1, 1]]
const XOR_EXPECTED = [0, 1, 1, 0]

// ── Derive SVG height from the tallest layer ──────────────────────────────────
function svgHeight(visibleHidden) {
  const tallest = Math.max(2, visibleHidden)   // input layer has 2, output 1
  return PAD_TOP + (tallest - 1) * NODE_GAP + PAD_BOT
}

// ── Evenly space `count` nodes vertically inside the SVG ─────────────────────
function layerY(count, totalH) {
  const usable = totalH - PAD_TOP - PAD_BOT
  if (count === 1) return [PAD_TOP + usable / 2]
  const gap = usable / (count - 1)
  return Array.from({ length: count }, (_, i) => PAD_TOP + i * gap)
}

// ── SVG node ─────────────────────────────────────────────────────────────────
function Node({ cx, cy, label, color = '#17243a', stroke = '#334155', textColor = '#fff' }) {
  return (
    <g>
      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={NODE_R + 4} fill={stroke} opacity={0.18} />
      <circle cx={cx} cy={cy} r={NODE_R} fill={color} stroke={stroke} strokeWidth={2} />
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="central"
        fill={textColor} fontSize={13} fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
      >
        {label}
      </text>
    </g>
  )
}

Node.propTypes = {
  cx:        PropTypes.number.isRequired,
  cy:        PropTypes.number.isRequired,
  label:     PropTypes.string.isRequired,
  color:     PropTypes.string,
  stroke:    PropTypes.string,
  textColor: PropTypes.string,
}

// ── SVG connection line ───────────────────────────────────────────────────────
function Edge({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="#2563eb" strokeWidth={1.2}
      opacity={0.30}
    />
  )
}

Edge.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
}

// ── Prediction result row ─────────────────────────────────────────────────────
function PredictionRow({ input, expected, predicted }) {
  const correct = Math.abs(predicted - expected) < 0.5
  return (
    <React.Fragment>
      <div className="px-4 py-3 text-center text-gray-200 bg-dark-800 border-t border-dark-600 font-mono text-sm">
        [{input.join(', ')}]
      </div>
      <div className="px-4 py-3 text-center text-gray-300 bg-dark-800 border-t border-dark-600 font-mono text-sm">
        {expected}
      </div>
      <div className={`px-4 py-3 text-center bg-dark-800 border-t border-dark-600 font-mono text-sm font-semibold flex items-center justify-center gap-1.5 ${
        correct ? 'text-emerald-400' : 'text-red-400'
      }`}>
        {predicted.toFixed(4)}
        <span className={`text-base leading-none ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct ? '✓' : '✗'}
        </span>
      </div>
    </React.Fragment>
  )
}

PredictionRow.propTypes = {
  input:     PropTypes.arrayOf(PropTypes.number).isRequired,
  expected:  PropTypes.number.isRequired,
  predicted: PropTypes.number.isRequired,
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NetworkGraph({ hiddenNeurons, predictions }) {
  const hasResults    = predictions.length > 0
  const visibleHidden = Math.min(hiddenNeurons, MAX_HIDDEN)
  const hasEllipsis   = hiddenNeurons > MAX_HIDDEN

  const SVG_H = svgHeight(visibleHidden)

  const inputY  = layerY(2,              SVG_H)
  const hiddenY = layerY(visibleHidden,  SVG_H)
  const outputY = layerY(1,              SVG_H)

  return (
    <div className="card p-6 space-y-6 animate-fade-in">
      <p className="card-title">Network Architecture</p>

      {/* ── Stack diagram on top, predictions table below ──────────────────── */}
      <div className="flex flex-col gap-8">

        {/* ── SVG Diagram ──────────────────────────────────────────────────── */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ minHeight: SVG_H, maxHeight: 520 }}
            aria-label="Neural network layer diagram"
          >
            {/* ── Layer column labels ───────────────────────────────────── */}
            <text x={COL.input}  y={22} textAnchor="middle" fontSize={12} fill="#64748b" fontWeight="700" letterSpacing="0.12em">INPUT</text>
            <text x={COL.hidden} y={22} textAnchor="middle" fontSize={12} fill="#3b82f6" fontWeight="700" letterSpacing="0.12em">HIDDEN ({hiddenNeurons})</text>
            <text x={COL.output} y={22} textAnchor="middle" fontSize={12} fill="#64748b" fontWeight="700" letterSpacing="0.12em">OUTPUT</text>

            {/* Activation labels below column names */}
            <text x={COL.input}  y={38} textAnchor="middle" fontSize={10} fill="#334155">—</text>
            <text x={COL.hidden} y={38} textAnchor="middle" fontSize={10} fill="#1e40af">ReLU</text>
            <text x={COL.output} y={38} textAnchor="middle" fontSize={10} fill="#334155">Sigmoid</text>

            {/* ── Edges: input → hidden ─────────────────────────────────── */}
            {inputY.flatMap((iy, ii) =>
              hiddenY.map((hy, hi) => (
                <Edge
                  key={`e-ih-${ii}-${hi}`}
                  x1={COL.input + NODE_R}  y1={iy}
                  x2={COL.hidden - NODE_R} y2={hy}
                />
              ))
            )}

            {/* ── Edges: hidden → output ───────────────────────────────── */}
            {hiddenY.flatMap((hy, hi) =>
              outputY.map((oy, oi) => (
                <Edge
                  key={`e-ho-${hi}-${oi}`}
                  x1={COL.hidden + NODE_R} y1={hy}
                  x2={COL.output - NODE_R} y2={oy}
                />
              ))
            )}

            {/* ── Input nodes ──────────────────────────────────────────── */}
            {inputY.map((y, i) => (
              <Node
                key={`in-${i}`}
                cx={COL.input} cy={y}
                label={`X${i + 1}`}
                color="#111c38"
                stroke="#475569"
              />
            ))}

            {/* ── Hidden nodes ─────────────────────────────────────────── */}
            {hiddenY.map((y, i) => (
              <Node
                key={`h-${i}`}
                cx={COL.hidden} cy={y}
                label={`H${i + 1}`}
                color="#1d4ed8"
                stroke="#3b82f6"
                textColor="#dbeafe"
              />
            ))}

            {/* Ellipsis badge when hidden count is capped */}
            {hasEllipsis && (
              <text
                x={COL.hidden} y={SVG_H - 8}
                textAnchor="middle" fontSize={22} fill="#475569" fontWeight="700"
              >
                ···
              </text>
            )}

            {/* ── Output node ──────────────────────────────────────────── */}
            {outputY.map((y, i) => (
              <Node
                key={`out-${i}`}
                cx={COL.output} cy={y}
                label="Y"
                color="#111c38"
                stroke="#475569"
              />
            ))}
          </svg>
        </div>

        {/* ── Predictions table ─────────────────────────────────────────── */}
        <div>
          <p className="label mb-3">Predictions</p>

          {hasResults ? (
            <div className="grid grid-cols-3 rounded-xl overflow-hidden ring-1 ring-dark-500">
              {/* Header */}
              {['Input', 'Expected', 'Predicted'].map(h => (
                <div key={h} className="px-4 py-3 bg-dark-700 text-gray-300 font-bold text-center uppercase tracking-widest text-xs">
                  {h}
                </div>
              ))}

              {/* Data rows */}
              {XOR_INPUTS.map((input, i) => (
                <PredictionRow
                  key={i}
                  input={input}
                  expected={XOR_EXPECTED[i]}
                  predicted={predictions[i]?.[0] ?? 0}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 py-4 text-center">
              Train the model to see predictions.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

NetworkGraph.propTypes = {
  hiddenNeurons: PropTypes.number.isRequired,
  predictions:   PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
}
