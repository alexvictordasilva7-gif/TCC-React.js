import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pet-shop-tcc-etec.onrender.com',
});

export default api;