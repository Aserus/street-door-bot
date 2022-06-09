import axios from 'axios'
import { v1 as uuidv1 } from 'uuid';
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'



const API_AUTH_URL = 'https://intercom.pik-comfort.ru/api/customers/sign_in'
const API_BASEURL = 'https://iot.rubetek.com/api/alfred/v1/'
const API_USERAGENT = 'domophone-ios/230648 CFNetwork/1327.0.4 Darwin/21.2.0'
const API_VERSION = 2
const API_DEVICE_VERSION = '2021.12.1'
const API_DEVICE_OS = 'iOS'
const API_DEVICE_CLIENT = 'alfred'


export const generateDeviceUid = () => uuidv1()

export const fetchToken = async (phone,password,uid) => { 
    if(!phone) throw new Error('bad parameter: phone')  
    if(!password) throw new Error('bad parameter: password')  
    if(!uid) throw new Error('bad parameter: uid')  

    const params = {
        account: { phone, password },
        customer_device: { uid }
    }

    const res = await axios({
        method: 'post',
        url: API_AUTH_URL,
        timeout: 6000,
        headers: {
            'User-Agent': API_USERAGENT,
            'api-version': API_VERSION,
            ...params,            
        }
    })

    const { authorization } = res.headers
    if (!authorization) throw new Error('Bad auth')
    const tmp = authorization.split(' ')
    const token = tmp[1] || null
    if(!token) throw new Error('Token is null')
    return token
}


class PikApi {
    constructor(token, uid) {
        if(token){
            this.setToken(token, uid)
        }
    }    

    async login(phone,password,uid){
        if(!uid) uid= generateDeviceUid()
        const token = await fetchToken(phone,password,uid)
        this.setToken(token,uid)
        return true
    }



    setToken(token,uid){
        this.token = token
        this.uid = uid
        this.createInstance()
    }
    hasToken(){
        return !!this.token
    }


    createInstance(){
        const authorization = `Bearer ${this.token}`

        this.api = axios.create({
            baseURL: API_BASEURL,
            timeout: 6000,
            headers: {
                'authorization': authorization,
                'device-client-app': API_DEVICE_CLIENT,
                'api-version': API_VERSION,
                'accept-language': 'ru',
                'device-client-uid': this.uid,
                'user-agent': API_USERAGENT,
                'device-client-version': API_DEVICE_VERSION,
                'device-client-os': API_DEVICE_OS
            }            
        })
        return this.api
    }

    async intercomList(){
        const { data } = await this.api.get(`/personal/intercoms?page=1`)
        return data
    }

    async intercomOpen(intercomId){
        const { data } = await this.api.post(`/personal/relays/${intercomId}/unlock`)
        return data
    }

    tokenInfo(){
        const decoded = jwt.decode(this.token)
        const info = {
            uid: this.uid,
            token: this.token,
            expires: dayjs.unix(decoded.exp).toDate()
        }
        return info
    }


}





export default PikApi