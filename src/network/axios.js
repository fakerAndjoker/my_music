import axios from "axios";

const instance = new axios.create({
    baseURL:'',
    timeout:10000
})

instance.defaults.baseURL = '/api'

export default instance
