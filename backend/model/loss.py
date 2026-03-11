import numpy as np


class MeanSquaredError:

    def forward(self, y_true, y_pred):
        """
        Compute mean squared error loss
        """
        return np.mean((y_true - y_pred) ** 2)

    def backward(self, y_true, y_pred):
        """
        Derivative of MSE with respect to predictions
        """
        return 2 * (y_pred - y_true) / y_true.size