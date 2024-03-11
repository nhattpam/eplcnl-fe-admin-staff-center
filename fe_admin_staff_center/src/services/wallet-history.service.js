import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class WalletHistoryService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveWalletHistory(wallet) {
    return axios.post(API_URL + "/wallet-histories/", wallet, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAlWalletHistory() {
    return axios.get(API_URL + "/wallet-histories", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateWalletHistory(id, wallet) {
    return axios.put(API_URL + "/wallet-histories/" + id, wallet, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getWalletHistoryById(id) {
    return axios.get(API_URL + "/wallet-histories/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new WalletHistoryService;