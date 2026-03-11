import numpy as np

from backend.model.layers import Dense
from backend.model.activations import Sigmoid, ReLU
from backend.model.loss import MeanSquaredError


# simple dataset (XOR problem)
X = np.array([
    [0,0],
    [0,1],
    [1,0],
    [1,1]
])

y = np.array([
    [0],
    [1],
    [1],
    [0]
])


# network
layer1 = Dense(2,4)
activation1 = ReLU()

layer2 = Dense(4,1)
activation2 = Sigmoid()

loss_fn = MeanSquaredError()

learning_rate = 0.1

loss_history = []

for epoch in range(5000):

    # forward pass
    z1 = layer1.forward(X)
    a1 = activation1.forward(z1)

    z2 = layer2.forward(a1)
    predictions = activation2.forward(z2)

    # compute loss
    loss = loss_fn.forward(y, predictions)

    loss_history.append(loss)

    # backward pass
    grad_loss = loss_fn.backward(y, predictions)

    grad_z2 = grad_loss * activation2.backward(z2)
    grad_a1 = layer2.backward(grad_z2, learning_rate)

    grad_z1 = grad_a1 * activation1.backward(z1)
    layer1.backward(grad_z1, learning_rate)

    if epoch % 500 == 0:
        print("Epoch:", epoch, "Loss:", loss)
    
# AFTER TRAINING FINISHES
print("\nFinal Predictions:")
print(predictions)

import matplotlib.pyplot as plt

plt.plot(loss_history)
plt.title("Training Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.show()

# Decision Boundary Visualization

# create a grid of points
xx, yy = np.meshgrid(
    np.linspace(-0.5, 1.5, 200),
    np.linspace(-0.5, 1.5, 200)
)

grid = np.c_[xx.ravel(), yy.ravel()]

# forward pass on the grid
z1 = layer1.forward(grid)
a1 = activation1.forward(z1)

z2 = layer2.forward(a1)
pred = activation2.forward(z2)

Z = pred.reshape(xx.shape)

# plot decision boundary
plt.contourf(xx, yy, Z, levels=50, cmap="coolwarm")

# plot training points
plt.scatter(X[:,0], X[:,1], c=y[:,0], edgecolors="black")

plt.title("Neural Network Decision Boundary")
plt.xlabel("X1")
plt.ylabel("X2")

plt.show()