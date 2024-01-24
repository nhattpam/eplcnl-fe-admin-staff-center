import axios from "axios";

const API_URL = "https://localhost:7215/api";


class StaffService {
	
	token = '';

  setToken(token) {
    this.token = token;
  }
  
    getAllStaff() {
      return axios.get(API_URL + "/staffs", {
        headers: {
          Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
        }
      });
    }


    updateStaff(id, staff) {
      return axios.put(API_URL + "/staffs/" + id, staff, {
		  headers: {
			Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
		  }
	  });
    }
  
  
    getStaffById(id) {
      return axios.get(API_URL + "/staffs/" + id, {
		  headers: {
			Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
		  }
	  });
    }
  }
export default new StaffService;