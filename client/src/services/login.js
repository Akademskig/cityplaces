import axios from 'axios'
import { localApi } from '../config';


export default class LoginService {

    tokenPrefix = "Bearer"
    token
    username

    createUser(userCredentials) {
        return axios.post(localApi.registerUrl, { userCredentials })
            .then(data => data)
            .catch(err => Promise.reject(err))
    }

    signIn(userCredentials) {
        return axios.post(localApi.loginUrl, { userCredentials })
            .then(data => {
                localStorage.setItem("user_id", data.data.user._id)
                localStorage.setItem("user_name", data.data.user.name)
                this.username = data.data.user.name
                this.token = data.data.token
                return data
            })
            .catch(err => Promise.reject(err))
    }
}