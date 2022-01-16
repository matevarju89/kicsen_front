import axios from 'axios';
import { store } from '../app/store';
import { LOGOUT } from '../constants/storeConstants';
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-type': 'application/json',
  },
});

/*
NOTE: intercept any error responses from the api
and check if the token is no longer valid.
ie. Token has expired or user is no longer
authenticated.
logout the user if the token has expired
*/
/*
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);*/

export default api;