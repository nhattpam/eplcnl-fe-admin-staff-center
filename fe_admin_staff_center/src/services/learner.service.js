import axios from "axios";

const API_URL = "https://nhatpmse.twentytwo.asia/api";


class LearnerService {
	
	token = '';

  setToken(token) {
    this.token = token;
  }
  saveLearner(learner) {
    return axios.post(API_URL + "/learners/", learner, {
		headers: {
			Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
		  }
	});
  }

    getAllLearner() {
      return axios.get(API_URL + "/learners", {
        headers: {
          Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
        }
      });
    }


    updateLearner(id, learner) {
      return axios.put(API_URL + "/learners/" + id, learner, {
		  headers: {
			Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
		  }
	  });
    }
  
  
    getLearnerById(id) {
      return axios.get(API_URL + "/learners/" + id, {
		  headers: {
			Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
		  }
	  });
    }
  }
export default new LearnerService;