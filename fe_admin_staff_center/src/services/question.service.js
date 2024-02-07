import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class QuestionService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveQuestion(question) {
    return axios.post(API_URL + "/questions/", question, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllQuestion() {
    return axios.get(API_URL + "/questions", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateQuestion(id, question) {
    return axios.put(API_URL + "/questions/" + id, question, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getQuestionById(id) {
    return axios.get(API_URL + "/questions/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  uploadImage(question) {
    return axios.post(API_URL + "/questions/image/", question, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadAudio(question) {
    return axios.post(API_URL + "/questions/audio/", question, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllQuestionAnswersByQuestion(id) {
    return axios.get(`${API_URL}/questions/${id}/question-answers`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new QuestionService;