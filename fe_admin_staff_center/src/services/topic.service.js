import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class ClassTopicService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveClassTopic(classTopic) {
        return axios.post(API_URL + "/topics/", classTopic, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getAllClassTopic() {
        return axios.get(API_URL + "/topics", {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }



    updateClassTopic(id, course) {
        return axios.put(API_URL + "/topics/" + id, course, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


    getClassTopicById(id) {
        return axios.get(API_URL + "/topics/" + id, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getAllMaterialsByClassTopic(id) {
        return axios.get(`${API_URL}/topics/${id}/materials`, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getAllQuizzesByClassTopic(id) {
        return axios.get(`${API_URL}/topics/${id}/quizzes`, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getAllAssignmentsByClassTopic(id) {
        return axios.get(`${API_URL}/topics/${id}/assignments`, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


}
export default new ClassTopicService;