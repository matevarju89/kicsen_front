// request all users
import api from '../../utility/http-common';
import { FamilyData, UserData } from './types';

class UserDataService {
  getAll() {
    return api.get<Array<UserData>>('/users');
  }
  getBySinglePropertyValue(
    property: string,
    value: string,
    operator = 'equals'
  ) {
    return api.get<UserData>(`/users?where[${property}][${operator}]=${value}`);
  }
  getUserFamilies(id: string) {
    return api.get<Array<FamilyData>>(`/users/${id}/families`);
  }
  get(id: string) {
    return api.get<UserData>(`/users/${id}`);
  }

  create(data: UserData) {
    return api.post<UserData>('/users', data);
  }

  update(data: UserData, id: any) {
    return api.put<any>(`/users/${id}`, data);
  }

  delete(id: any) {
    return api.delete<any>(`/users/${id}`);
  }

  deleteAll() {
    return api.delete<any>(`/users`);
  }
}

export default new UserDataService();
