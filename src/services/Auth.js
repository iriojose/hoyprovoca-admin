import axios from 'axios';
import header from './header';
import autorizacion from './autorizacion';

export default () => {
    return axios.create({
        baseURL:`http://${autorizacion}/`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":header
        }
    });
};