import config from './config.js';

// Define the API base URL
const API_BASE_URL = config.apiUrl; // Replace with your API domain
const CONTROLLER = '/'; // Replace with your controller path

// API client with async/await
class ApiClient {
  // Ping the server to check if it's alive
  async ping() {
    const response = await fetch(`${API_BASE_URL}/ping`);
    return response.json();
  }

  // Create a new session and get its ID
  async createSession(name) {
    const response = await fetch(`${API_BASE_URL}${CONTROLLER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return response.json();
  }

  // Get session details
  async getSession(sessionId) {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`);
    return response.json();
  }

  // Add a player to the session
  async addPlayer(sessionId, name, type) {
    await fetch(`${API_BASE_URL}/${sessionId}/player`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, type }),
    });
  }

  // Create a game within the session and get its ID
  async createGame(sessionId, name) {
    await fetch(`${API_BASE_URL}/${sessionId}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
  }

  // Set a title for a game
  async setTitle(sessionId, title) {
    await fetch(`${API_BASE_URL}/${sessionId}/game/title`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
  }

  // Add a score for a game
  async addScore(sessionId, userName, score) {
    await fetch(`${API_BASE_URL}/${sessionId}/game/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name: userName, score }),
    });
  }

  // Get scores for a game
  async getScores(sessionId) {
    const response = await fetch(`${API_BASE_URL}/${sessionId}/game/score`);
    return response.json();
  }

  async revealScores(sessionId) {
    await fetch(`${API_BASE_URL}/${sessionId}/game/reveal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default ApiClient;
