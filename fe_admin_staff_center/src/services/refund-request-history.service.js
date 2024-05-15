import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class RefundHistoryService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveRefundHistory(refundHistory) {
    return axios.post(API_URL + "/refund-histories/", refundHistory, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllRefundHistory() {
    return axios.get(API_URL + "/refund-histories", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateRefundHistory(id, refundHistory) {
    return axios.put(API_URL + "/refund-histories/" + id, refundHistory, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getRefundHistoryById(id) {
    return axios.get(API_URL + "/refund-histories/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new RefundHistoryService;