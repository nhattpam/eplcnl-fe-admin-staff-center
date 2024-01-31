import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class CourseService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  savecourse(course) {
    return axios.post(API_URL + "/courses/", course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllCourse() {
    return axios.get(API_URL + "/courses", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  


  updateCourse(id, course) {
    return axios.put(API_URL + "/courses/" + id, course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCourseById(id) {
    return axios.get(API_URL + "/courses/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllModulesByCourse(id) {
    return axios.get(`${API_URL}/courses/${id}/modules`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllClassModulesByCourse(id) {
    return axios.get(`${API_URL}/courses/${id}/class-modules`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



  uploadImage(course) {
    return axios.post(API_URL + "/courses/image/", course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  

}
export default new CourseService;