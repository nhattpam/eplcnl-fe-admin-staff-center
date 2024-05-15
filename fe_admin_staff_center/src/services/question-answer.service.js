import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class QuestionAnswerService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveQuestionAnswer(questionAnswer) {
    return axios.post(API_URL + "/question-answers/", questionAnswer, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllQuestionAnswer() {
    return axios.get(API_URL + "/question-answers", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateQuestionAnswer(id, questionAnswer) {
    return axios.put(API_URL + "/question-answers/" + id, questionAnswer, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getQuestionAnswerById(id) {
    return axios.get(API_URL + "/question-answers/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  deleteQuestionAnswer(id){
    return axios.delete(API_URL + "/question-answers/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new QuestionAnswerService;