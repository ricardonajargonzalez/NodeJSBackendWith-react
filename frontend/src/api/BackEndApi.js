import axios from 'axios';


export const backEndApi = axios.create({
    baseURL: 'https://ricardonajar.com/ApiSC/v1'
});


