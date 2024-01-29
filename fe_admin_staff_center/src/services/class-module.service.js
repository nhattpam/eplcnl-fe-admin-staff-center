import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class ClassModuleService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveModule(module) {
    return axios.post(API_URL + "/class-modules/", module, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllModule() {
    return axios.get(API_URL + "/class-modules", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  

  updateModule(id, module) {
    return axios.put(API_URL + "/class-modules/" + id, module, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getModuleById(id) {
    return axios.get(API_URL + "/class-modules/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllClassLessonsByModule(id) {
    return axios.get(`${API_URL}/class-modules/${id}/class-lessons`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new ClassModuleService;