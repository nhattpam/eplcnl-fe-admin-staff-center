import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class CenterService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  getAllCenter() {
    return axios.get(API_URL + "/centers", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateCenter(id, center) {
    return axios.put(API_URL + "/centers/" + id, center, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCenterById(id) {
    return axios.get(API_URL + "/centers/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllTutorsByCenter(id) {
    return axios.get(`${API_URL}/centers/${id}/tutors`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  sendEmail(id) {
    return axios.post(API_URL + `/centers/${id}/mail/`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getTotalAmountByCenter(id) {
    return axios.get(`${API_URL}/centers/${id}/total-amount`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new CenterService;