import axios from "axios";

const API_URL = "https://localhost:7215/api";


class AccountService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveAccount(account) {
    return axios.post(API_URL + "/accounts/", account, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllAccount() {
    return axios.get(API_URL + "/accounts", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateAccount(id, account) {
    return axios.put(API_URL + "/accounts/" + id, account, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getAccountById(id) {
    return axios.get(API_URL + "/accounts/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new AccountService;