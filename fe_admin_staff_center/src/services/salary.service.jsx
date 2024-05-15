import axios from "axios";

import { API_URL } from './apiConfig';  // Adjust the path as necessary


class SalaryService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveSalary(salary) {
    return axios.post(API_URL + "/salaries/", salary, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllSalary() {
    return axios.get(API_URL + "/salaries", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  


  updateSalary(id, salary) {
    return axios.put(API_URL + "/salaries/" + id, salary, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getSalaryById(id) {
    return axios.get(API_URL + "/salaries/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

 

  
}
export default new SalaryService;