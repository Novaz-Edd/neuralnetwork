import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
from backend.model.loss import MeanSquaredError

# sample true values
y_true = np.array([[1], [0], [1]])

# sample predictions
y_pred = np.array([[0.8], [0.2], [0.6]])

loss_fn = MeanSquaredError()

loss = loss_fn.forward(y_true, y_pred)

print("True values:", y_true)
print("Predictions:", y_pred)
print("Loss:", loss)