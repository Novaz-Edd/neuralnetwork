import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
from backend.model.layers import Dense

# sample input
x = np.array([[0.5, 0.2]])

# create dense layer
layer = Dense(2, 3)

# forward pass
output = layer.forward(x)

print("Input:", x)
print("Weights:", layer.weights)
print("Bias:", layer.bias)
print("Output:", output)