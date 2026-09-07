import axios from 'axios';

const API = axios.create({
  baseURL: 'https://snapshare1.onrender.com',
  withCredentials: true,
});

export default `API`;