import axios from "axios";

const API_URL = "https://nhatpmse.twentytwo.asia/api";


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
}
export default new TutorService;