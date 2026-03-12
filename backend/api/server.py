from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.model.network import NeuralNetwork

app = FastAPI(title="Neural Network Visualizer API", version="1.0.0")

# Allow CORS for local Vite dev server only
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Absolute path to the compiled React app (built into frontend/dist/)
DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"


@app.get("/train")
def train(
    learning_rate:  float = Query(0.1,  ge=0.001, le=1.0),
    epochs:         int   = Query(5000, ge=100,   le=10000),
    hidden_neurons: int   = Query(4,    ge=1,     le=64),
):
    """
    Train the neural network on the XOR problem and return:
    - loss_history : MSE loss recorded at every epoch
    - predictions  : model outputs for the 4 XOR inputs [[p00],[p01],[p10],[p11]]
    - boundary     : 50×50 grid of {x, y, value} for the decision boundary
    """
    network = NeuralNetwork(
        hidden_neurons=hidden_neurons,
        learning_rate=learning_rate,
    )
    loss_history, predictions = network.train(epochs=epochs)
    boundary = network.get_decision_boundary(resolution=50)

    return {
        "loss_history": loss_history,
        "predictions":  predictions.tolist(),
        "boundary":     boundary,
    }


# ── Serve compiled React frontend ─────────────────────────────────────────────
# Mount Vite's /assets/ folder (JS, CSS, images)
if (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")


@app.get("/")
def serve_root():
    """Serve the React app index page."""
    return FileResponse(DIST_DIR / "index.html")


@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """SPA fallback — all unmatched routes return index.html for React Router."""
    return FileResponse(DIST_DIR / "index.html")

