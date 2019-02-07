import axios from 'axios'


import Config from "./config"

export default class LoginService {

    tokenPrefix = "Bearer"
    token
    username

    constructor() {
        this.url = new Config().url
    }

    createUser(userCredentials) {
        return axios.post(this.url + "/users", { userCredentials })
            .then(data => data)
            .catch(err => Promise.reject(err))
    }

    signIn(userCredentials) {
        return axios.post(this.url + "/auth/signin", { userCredentials })
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