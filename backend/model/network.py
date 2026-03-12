import numpy as np

from backend.model.layers import Dense
from backend.model.activations import Sigmoid, ReLU
from backend.model.loss import MeanSquaredError


class NeuralNetwork:
    """
    A simple feedforward neural network for the XOR problem.
    Architecture: 2 → hidden_neurons (ReLU) → 1 (Sigmoid)
    """

    def __init__(self, hidden_neurons: int = 4, learning_rate: float = 0.1):
        self.hidden_neurons = hidden_neurons
        self.learning_rate = learning_rate

        # Fixed XOR dataset
        self.X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
        self.y = np.array([[0], [1], [1], [0]], dtype=float)

        # Network layers
        self.layer1     = Dense(2, hidden_neurons)
        self.activation1 = ReLU()
        self.layer2     = Dense(hidden_neurons, 1)
        self.activation2 = Sigmoid()

        self.loss_fn = MeanSquaredError()

    # ── Forward pass ──────────────────────────────────────────────────────────
    def _forward(self, X: np.ndarray):
        z1 = self.layer1.forward(X)
        a1 = self.activation1.forward(z1)
        z2 = self.layer2.forward(a1)
        a2 = self.activation2.forward(z2)
        return z1, a1, z2, a2

    # ── Training ──────────────────────────────────────────────────────────────
    def train(self, epochs: int = 5000):
        """Train on XOR data and return (loss_history, final_predictions)."""
        loss_history = []

        for _ in range(epochs):
            z1, a1, z2, predictions = self._forward(self.X)

            loss = self.loss_fn.forward(self.y, predictions)
            loss_history.append(float(loss))

            # Backward pass
            grad_loss = self.loss_fn.backward(self.y, predictions)
            grad_z2   = grad_loss * self.activation2.backward(z2)
            grad_a1   = self.layer2.backward(grad_z2, self.learning_rate)
            grad_z1   = grad_a1 * self.activation1.backward(z1)
            self.layer1.backward(grad_z1, self.learning_rate)

        _, _, _, predictions = self._forward(self.X)
        return loss_history, predictions

    # ── Inference ─────────────────────────────────────────────────────────────
    def predict(self, X: np.ndarray) -> np.ndarray:
        _, _, _, output = self._forward(X)
        return output

    # ── Decision boundary grid ────────────────────────────────────────────────
    def get_decision_boundary(self, resolution: int = 50):
        """
        Return a list of {x, y, value} dicts covering the grid
        [-0.5, 1.5] × [-0.5, 1.5] at the given resolution.
        """
        xx, yy = np.meshgrid(
            np.linspace(-0.5, 1.5, resolution),
            np.linspace(-0.5, 1.5, resolution),
        )
        grid = np.c_[xx.ravel(), yy.ravel()]
        zz   = self.predict(grid).reshape(resolution, resolution)

        return [
            {"x": float(xx[i, j]), "y": float(yy[i, j]), "value": float(zz[i, j])}
            for i in range(resolution)
            for j in range(resolution)
        ]
