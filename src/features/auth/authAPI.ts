// request all recipes
import http from '../../utility/http-common';
import { AuthPayloadData } from './types';

class AuthDataService {
  login(data: AuthPayloadData) {
    return http.post<AuthPayloadData>('/login', data);
  }
}

export default new AuthDataService();
