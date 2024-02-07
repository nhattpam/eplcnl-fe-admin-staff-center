import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class LessonMaterialService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  savelessonMaterial(lessonMaterial) {
    return axios.post(API_URL + "/lesson-materials/", lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAlllessonMaterial() {
    return axios.get(API_URL + "/lesson-materials", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateLessonMaterial(id, lessonMaterial) {
    return axios.put(API_URL + "/lesson-materials/" + id, lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getLessonMaterialById(id) {
    return axios.get(API_URL + "/lesson-materials/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



  uploadMaterial(lessonMaterial) {
    return axios.post(API_URL + "/lesson-materials/material/", lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  

}
export default new LessonMaterialService;