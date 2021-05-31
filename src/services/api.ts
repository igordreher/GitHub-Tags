import axios from 'axios';

const baseURL = process.env.BASE_API_URL || 'http://localhost:3000/api/';

export default axios.create({ baseURL });