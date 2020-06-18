import axios from 'axios';
import w from './variables_globales';

export default () => {
    return axios.create({
        baseURL:`${w.http}://${w.data}/api/empresa`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":w.header,
            "tenant-id":w.tenant_id
        }
    });
};