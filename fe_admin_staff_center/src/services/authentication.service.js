import axios from "axios";

const API_URL = "https://nhatpmse.twentytwo.asia/api";


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