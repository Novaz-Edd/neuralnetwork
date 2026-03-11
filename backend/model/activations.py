import numpy as np

class Sigmoid:
    def forward(self, x):
        return 1 / (1 + np.exp(-x))

    def backward(self, x):
        s = self.forward(x)
        return s * (1 - s)


class ReLU:
    def forward(self, x):
        return np.maximum(0, x)

    def backward(self, x):
        return (x > 0).astype(float)


class Tanh:
    def forward(self, x):
        return np.tanh(x)

    def backward(self, x):
        return 1 - np.tanh(x) ** 2
