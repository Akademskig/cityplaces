import axios from 'axios'


export default class LoginService {
    constructor() {
        this.url = "http://localhost:5000/api/"
    }

    createUser(userCredentials) {
        return axios.post(this.url + "users", { userCredentials })
            .then(data => data)
            .catch(err => Promise.reject(err))
    }

    signIn(userCredentials) {
        return axios.post(this.url + "auth/signin", { userCredentials })
            .then(data => data)
            .catch(err => Promise.reject(err))
    }
}