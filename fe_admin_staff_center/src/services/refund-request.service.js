import axios from "axios";

const API_URL = "https://nhatpmse.twentytwo.asia/api";


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
}
export default new RefundRequestService;