import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from backend.model.network import NeuralNetwork

app = FastAPI(title="Neural Network Visualizer API", version="1.0.0")

# Base origins always allowed (local dev)
_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Production frontend URL injected via Render environment variable
_frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
if _frontend_url:
    _origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Neural Network Visualizer API is running."}


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

