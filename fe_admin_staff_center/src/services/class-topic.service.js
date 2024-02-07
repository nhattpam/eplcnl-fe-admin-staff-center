import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class ClassTopicService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveClassTopic(classTopic) {
        return axios.post(API_URL + "/class-topics/", classTopic, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getAllClassTopic() {
        return axios.get(API_URL + "/class-topics", {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }



    updateClassTopic(id, course) {
        return axios.put(API_URL + "/class-topics/" + id, course, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


    getClassTopicById(id) {
        return axios.get(API_URL + "/class-topics/" + id, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getAllMaterialsByClassTopic(id) {
        return axios.get(`${API_URL}/class-topics/${id}/lesson-materials`, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


}
export default new ClassTopicService;