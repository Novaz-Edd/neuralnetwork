<div align="center">

# 🧠 Neural Network Visualizer

**An interactive dashboard that teaches a neural network to solve the XOR problem in real time.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-neuralnetwork--05n8.onrender.com-3b82f6?style=for-the-badge&logo=render&logoColor=white)](https://neuralnetwork-05n8.onrender.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

![Neural Network Visualizer Screenshot](https://neuralnetwork-05n8.onrender.com/assets/index-Ccf10ojo.css)

</div>

---

## ✨ Overview

Neural Network Visualizer is a full-stack web application that lets you watch a neural network learn the **XOR problem** step by step. Adjust hyperparameters, click **Train Model**, and see live charts, a decision boundary heatmap, and per-prediction results update instantly.

The XOR problem is a classic benchmark: no single straight line can separate the outputs, so the network must learn a non-linear decision boundary — making it a perfect example of why hidden layers and non-linear activations matter.

---

## 🚀 Live Demo

**[https://neuralnetwork-05n8.onrender.com](https://neuralnetwork-05n8.onrender.com/)**

> The app runs on Render's free tier — it may take ~30 seconds to wake up on first visit.

---

## 🎯 Features

| Feature | Description |
|---|---|
| **Training Loss Chart** | Real-time Chart.js line graph showing MSE loss across every epoch |
| **Decision Boundary** | Canvas heatmap (blue → red) showing how the network partitions the input space |
| **Network Diagram** | SVG visualisation of input, hidden, and output layers with live connection weights |
| **Prediction Table** | Per-sample XOR output with ✓/✗ correctness indicators |
| **Hyperparameter Controls** | Adjust learning rate (slider), epochs, and hidden neuron count before each run |
| **Dark Theme UI** | Professional AI-dashboard aesthetic with TailwindCSS |
| **Responsive Layout** | Works on desktop and mobile |

---

## 🏗️ Architecture

```
neural-network-visualizer/
├── backend/
│   ├── api/
│   │   └── server.py          # FastAPI — /train endpoint + serves React build
│   └── model/
│       ├── network.py         # NeuralNetwork class (train, predict, boundary)
│       ├── layers.py          # Dense layer (forward + backprop)
│       ├── activations.py     # ReLU, Sigmoid, Tanh
│       └── loss.py            # Mean Squared Error
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Root layout & global state
│   │   ├── components/
│   │   │   ├── ControlsPanel.jsx    # Hyperparameter inputs & Train button
│   │   │   ├── LossChart.jsx        # Chart.js training loss graph
│   │   │   ├── DecisionBoundary.jsx # Canvas heatmap
│   │   │   └── NetworkGraph.jsx     # SVG network diagram + predictions table
│   │   └── services/
│   │       └── api.js               # Axios API client
│   └── dist/                  # Pre-built React app (served by FastAPI)
├── tests/
├── render.yaml                # Render deployment blueprint
└── requirements.txt
```

---

## 🧮 How It Works

### The XOR Problem

The network learns to map 4 binary inputs to their XOR outputs:

| X₁ | X₂ | XOR |
|:--:|:--:|:---:|
| 0  | 0  |  0  |
| 0  | 1  |  1  |
| 1  | 0  |  1  |
| 1  | 1  |  0  |

### Network Architecture

```
Input Layer (2)  →  Hidden Layer (ReLU)  →  Output Layer (Sigmoid)
      X₁  ──┐                                        ┐
             ├──▶  H₁ … Hₙ  ──▶  Y  (0 or 1)        │  MSE Loss
      X₂  ──┘                                        ┘
```

- **Forward pass:** linear transformation → activation → prediction
- **Backward pass:** MSE gradient → chain rule → weight updates via gradient descent
- **Decision boundary:** a 50×50 grid of predictions rendered as a heatmap

---

## 🛠️ Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — high-performance Python API framework
- [Uvicorn](https://www.uvicorn.org/) — ASGI server
- [NumPy](https://numpy.org/) — neural network math (no ML frameworks — built from scratch)

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — component-based UI with fast dev server
- [TailwindCSS 3](https://tailwindcss.com/) — utility-first dark-theme styling
- [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) — animated loss chart
- [Axios](https://axios-http.com/) — HTTP API client

**Deployment**
- [Render](https://render.com/) — single web service (FastAPI serves both API and React)

---

## 🖥️ Running Locally

### Prerequisites

- Python ≥ 3.11
- Node.js ≥ 18

### 1. Clone the repo

```bash
git clone https://github.com/Novaz-Edd/neuralnetwork.git
cd neuralnetwork/neural-network-visualizer
```

### 2. Backend

```bash
# Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn backend.api.server:app --reload
```

API is now live at `http://localhost:8000`

### 3. Frontend (dev server with hot reload)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` — the Vite dev server proxies `/train` requests to the FastAPI backend automatically.

---

## 📡 API Reference

### `GET /train`

Train the neural network and return results.

| Parameter | Type | Default | Range | Description |
|---|---|---|---|---|
| `learning_rate` | float | `0.1` | 0.001 – 1.0 | Gradient descent step size |
| `epochs` | int | `5000` | 100 – 10000 | Number of training iterations |
| `hidden_neurons` | int | `4` | 1 – 64 | Neurons in the hidden layer |

**Example request:**
```
GET /train?learning_rate=0.05&epochs=3000&hidden_neurons=8
```

**Response:**
```json
{
  "loss_history": [0.2501, 0.2498, ..., 0.0021],
  "predictions":  [[0.03], [0.97], [0.96], [0.04]],
  "boundary": [
    { "x": -0.5, "y": -0.5, "value": 0.02 },
    ...
  ]
}
```

---

## 🚢 Deployment

The app is deployed as a **single Render web service** — FastAPI serves both the REST API and the pre-built React frontend from `frontend/dist/`.

The `render.yaml` blueprint configures:
- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn backend.api.server:app --host 0.0.0.0 --port $PORT`

To deploy your own copy:
1. Fork this repo
2. Create a new **Web Service** on [Render](https://render.com) pointing to your fork
3. Render auto-detects `render.yaml` — hit **Deploy**

---

## 📄 License

MIT © [Novaz-Edd](https://github.com/Novaz-Edd)
