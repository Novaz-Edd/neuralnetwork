import sys
import os

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
from backend.model.activations import Sigmoid, ReLU, Tanh

# Create sample input values
x = np.array([-2, -1, 0, 1, 2])

# Initialize activation functions
sigmoid = Sigmoid()
relu = ReLU()
tanh = Tanh()

# Run forward passes
print("Input:", x)
print("Sigmoid Output:", sigmoid.forward(x))
print("ReLU Output:", relu.forward(x))
print("Tanh Output:", tanh.forward(x))