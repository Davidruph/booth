import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// USER AND AUTH ROUTES

// SIGNIN
export const signin = (user) => {
  return axios
    .post(`${API_BASE_URL}/signin`, JSON.stringify(user), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data; // Return response data
    })
    .catch((err) => {
      return err.response.data; // Return error response data
    });
};

// SIGNUP
export const signup = (user) => {
  return axios
    .post(`${API_BASE_URL}/signup`, JSON.stringify(user), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data; // Return response data
    })
    .catch((err) => {
      return err.response.data; // Return error response data
    });
};

// SETTING THE JWT TOKEN IN USER'S BROWSER
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

// SIGNOUT -> REMOVING JWT TOKEN
export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");

    axios
      .get(`${API_BASE_URL}/signout`)
      .then((response) => {
        console.log(response.data);
        next();
      })
      .catch((err) => console.log(err));
  }
};

// VALIDATION IF USER IS SIGNED IN
export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt"))
    return JSON.parse(localStorage.getItem("jwt"));
  else return false;
};
