// data/api.js
import axios from 'axios';

export const API_KEY = '073d706a4419a033450d339b716b4ece';
export const BASE_URL = 'https://api.themoviedb.org/3';

if (!BASE_URL || BASE_URL === 'undefined') {
  console.error('BASE_URL is not properly configured.');
}

export const fetchMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchTVShows = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    throw error;
  }
};
