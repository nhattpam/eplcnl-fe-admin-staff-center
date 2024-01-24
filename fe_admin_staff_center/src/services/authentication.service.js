import axios from "axios";

const API_URL = "https://localhost:7215/api/authentications";


class AuthenticationService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    loginUser(email, password) {
        return axios.post(API_URL + "/login", {
            email: email,
            password: password,
        });
    }


}
export default new AuthenticationService;