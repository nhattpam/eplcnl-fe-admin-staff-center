import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class ClassLessonService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveClassLesson(classLesson) {
    return axios.post(API_URL + "/class-lessons/", classLesson, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllClassLesson() {
    return axios.get(API_URL + "/class-lessons", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  

  updateClassLesson(id, classLesson) {
    return axios.put(API_URL + "/class-lessons/" + id, classLesson, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getClassLessonById(id) {
    return axios.get(API_URL + "/class-lessons/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllClassTopicsByClassLesson(id) {
    return axios.get(`${API_URL}/class-lessons/${id}/topics`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new ClassLessonService;