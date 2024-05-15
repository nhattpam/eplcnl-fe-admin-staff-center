import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class RefundSurveyService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveRefundSurvey(refundSurvey) {
    return axios.post(API_URL + "/refund-surveys/", refundSurvey, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllRefundSurvey() {
    return axios.get(API_URL + "/refund-surveys", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateRefundSurvey(id, refundSurvey) {
    return axios.put(API_URL + "/refund-surveys/" + id, refundSurvey, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getRefundSurveyById(id) {
    return axios.get(API_URL + "/refund-surveys/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new RefundSurveyService;