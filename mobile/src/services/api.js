import axios from 'axios';
import Constants from '../constants';

const api = axios.create({
    baseURL: Constants.API_ADDRESS
});

export default api;