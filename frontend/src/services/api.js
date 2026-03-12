import axios from 'axios'

// In production (Render static site) VITE_API_BASE_URL points to the backend
// web service URL. In development the Vite proxy forwards relative requests.
// Relative URL works for both local dev (Vite proxy) and production
// (FastAPI serves the frontend from the same origin as the API).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000,
})

/**
 * Train the neural network with the given hyperparameters.
 *
 * @param {{ learningRate: number, epochs: number, hiddenNeurons: number }} params
 * @returns {Promise<{
 *   loss_history: number[],
 *   predictions:  number[][],
 *   boundary:     Array<{ x: number, y: number, value: number }>
 * }>}
 */
export async function trainNetwork({ learningRate, epochs, hiddenNeurons }) {
  const { data } = await client.get('/train', {
    params: {
      learning_rate:  learningRate,
      epochs,
      hidden_neurons: hiddenNeurons,
    },
  })
  return data
}
