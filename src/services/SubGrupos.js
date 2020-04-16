import axios from 'axios';
import variables from './variables_globales';

export default () => {
    return axios.create({
        baseURL:`http://${variables.data}/api/subgrupos`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":variables.header
        }
    });
};