import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class ModuleService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveModule(module) {
    return axios.post(API_URL + "/modules/", module, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllModule() {
    return axios.get(API_URL + "/modules", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  

  updateModule(id, module) {
    return axios.put(API_URL + "/modules/" + id, module, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getModuleById(id) {
    return axios.get(API_URL + "/modules/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllLessonsByModule(id) {
    return axios.get(`${API_URL}/modules/${id}/lessons`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllQuizzesByModule(id) {
    return axios.get(`${API_URL}/modules/${id}/quizzes`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllAssignmentsByModule(id) {
    return axios.get(`${API_URL}/modules/${id}/assignments`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new ModuleService;