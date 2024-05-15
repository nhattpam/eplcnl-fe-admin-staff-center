import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class AuthenticationService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    loginUser(email, password) {
        return axios.post(API_URL + "/authentications/login", {
            email: email,
            password: password,
        });
    }


}
export default new AuthenticationService;