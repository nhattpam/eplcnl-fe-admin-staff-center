import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class RefundRequestService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  getAllRefundRequest() {
    return axios.get(API_URL + "/refund-requests", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateRefundRequest(id, refundRequest) {
    return axios.put(API_URL + "/refund-requests/" + id, refundRequest, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getRefundRequestById(id) {
    return axios.get(API_URL + "/refund-requests/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllRefundSurveyByRefundRequestId(id) {
    return axios.get(API_URL + `/refund-requests/${id}/refund-surveys` , {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new RefundRequestService;