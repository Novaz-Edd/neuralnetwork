import numpy as np


class Dense:
    def __init__(self, input_size, output_size):
        # initialize weights randomly
        self.weights = np.random.randn(input_size, output_size) * 0.01
        
        # initialize bias
        self.bias = np.zeros((1, output_size))

    def forward(self, x):
        # store input for backpropagation
        self.input = x
        
        # linear transformation
        self.output = np.dot(x, self.weights) + self.bias
        
        return self.output
    
    def backward(self, grad_output, learning_rate):
        # gradient with respect to weights
        grad_weights = np.dot(self.input.T, grad_output)

        # gradient with respect to bias
        grad_bias = np.sum(grad_output, axis=0, keepdims=True)

        # gradient with respect to input
        grad_input = np.dot(grad_output, self.weights.T)

        # update weights
        self.weights -= learning_rate * grad_weights
        self.bias -= learning_rate * grad_bias

        return grad_input