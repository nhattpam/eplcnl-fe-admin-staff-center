import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class TransactionService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveTransaction(transaction) {
    return axios.post(API_URL + "/transactions/", transaction, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllTransaction() {
    return axios.get(API_URL + "/transactions", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateTransaction(id, transaction) {
    return axios.put(API_URL + "/transactions/" + id, transaction, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getTransactionById(id) {
    return axios.get(API_URL + "/transactions/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new TransactionService;