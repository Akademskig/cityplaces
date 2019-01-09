import axios from 'axios'


export default class LoginService {

    constructor() { }
    login(userCredentials) {
        const url = "http://localhost:5000/api/users"
        return axios.post(url, { userCredentials })
            .then(data => data)
            .catch(err => Promise.reject(err))

    }
}