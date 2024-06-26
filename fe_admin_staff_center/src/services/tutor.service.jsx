import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class TutorService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveTutor(tutor) {
    return axios.post(API_URL + "/tutors/", tutor, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllTutor() {
    return axios.get(API_URL + "/tutors", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  


  updateTutor(id, tutor) {
    return axios.put(API_URL + "/tutors/" + id, tutor, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getTutorById(id) {
    return axios.get(API_URL + "/tutors/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllCoursesByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/courses`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllPaperWorksByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/paper-works`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getTotalAmountByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/total-amount`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new TutorService;