from fastapi import FastAPI
import numpy as np

app = FastAPI(title="Neural Network Visualizer API")

@app.get("/")
def home():
    return {"message": "Neural Network Visualizer API running"}

@app.get("/train")
def train():
    return {"status": "training endpoint coming soon"}

