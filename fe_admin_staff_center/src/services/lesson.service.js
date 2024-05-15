import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class LessonService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  savelesson(lesson) {
    return axios.post(API_URL + "/lessons/", lesson, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAlllesson() {
    return axios.get(API_URL + "/lessons", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  


  updateLesson(id, lesson) {
    return axios.put(API_URL + "/lessons/" + id, lesson, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getLessonById(id) {
    return axios.get(API_URL + "/lessons/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadImage(lesson) {
    return axios.post(API_URL + "/lessons/image/", lesson, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadVideo(lesson) {
    return axios.post(API_URL + "/lessons/video/", lesson, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllMaterialsByLesson(id) {
    return axios.get(`${API_URL}/lessons/${id}/materials`, {
        headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
        }
    });
}

}
export default new LessonService;