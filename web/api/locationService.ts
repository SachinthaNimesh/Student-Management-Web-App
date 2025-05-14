import axios from 'axios';
import { REACT_APP_URL } from '../config/config';

export const fetchLocationFromAPI = async () => {
    const response = await axios.get(REACT_APP_URL + '/location');
    return response.data;
}