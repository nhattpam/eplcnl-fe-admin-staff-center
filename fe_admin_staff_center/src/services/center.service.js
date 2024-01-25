import axios from "axios";

const API_URL = "https://localhost:7215/api";


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

}
export default new CenterService;