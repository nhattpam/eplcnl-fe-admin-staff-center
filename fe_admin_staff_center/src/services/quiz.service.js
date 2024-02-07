import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class QuizService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveQuiz(quiz) {
    return axios.post(API_URL + "/quizzes/", quiz, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllQuiz() {
    return axios.get(API_URL + "/quizzes", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  

  updateQuiz(id, quiz) {
    return axios.put(API_URL + "/quizzes/" + id, quiz, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getQuizById(id) {
    return axios.get(API_URL + "/quizzes/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllQuestionsByQuiz(id) {
    return axios.get(`${API_URL}/quizzes/${id}/questions`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new QuizService;