import axios from "axios";

const API_URL = "https://nhatpmse.twentytwo.asia/api";


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

  getTutorByAccountId(id) {
    return axios.get(API_URL + `/accounts/${id}/tutors`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getLearnerByAccountId(id) {
    return axios.get(API_URL + `/accounts/${id}/learners`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getStaffByAccountId(id) {
    return axios.get(API_URL + `/accounts/${id}/staffs`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getWalletByAccount(id) {
    return axios.get(API_URL + `/accounts/${id}/wallets`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadImage(account) {
    return axios.post(API_URL + "/accounts/image/", account, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  sendMailBanAccount(id) {
    return axios.post(API_URL + `/accounts/${id}/mail-lock`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllSalariesByAccount(id) {
    return axios.get(`${API_URL}/accounts/${id}/salaries`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new AccountService;