import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class LessonMaterialService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  savelessonMaterial(lessonMaterial) {
    return axios.post(API_URL + "/materials/", lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAlllessonMaterial() {
    return axios.get(API_URL + "/materials", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateLessonMaterial(id, lessonMaterial) {
    return axios.put(API_URL + "/materials/" + id, lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getLessonMaterialById(id) {
    return axios.get(API_URL + "/materials/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



  uploadMaterial(lessonMaterial) {
    return axios.post(API_URL + "/materials/material/", lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  

}
export default new LessonMaterialService;