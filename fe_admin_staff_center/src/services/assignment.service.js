import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class AssignmentService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveAssignment(assignment) {
    return axios.post(API_URL + "/assignments/", assignment, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllAssignment() {
    return axios.get(API_URL + "/assignments", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  

  updateAssignment(id, assignment) {
    return axios.put(API_URL + "/assignments/" + id, assignment, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getAssignmentById(id) {
    return axios.get(API_URL + "/assignments/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new AssignmentService;