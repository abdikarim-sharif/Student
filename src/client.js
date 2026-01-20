// src/config/client.js
import axios from "axios";

//  IMPORTANT: replace this IP with your COMPUTER IP from Expo logs
const API_BASE_URL = "http://192.168.1.108:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export default client;
