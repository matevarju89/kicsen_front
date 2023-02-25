import api from '../../utility/http-common';
import { RatingDao, RatingData } from './types';

class RatingDataService {
  getAll(family: string) {
    return api.get<Array<RatingData>>(`/ratings`);
  }

  get(id: string) {
    return api.get<RatingData>(`/ratings/${id}`);
  }

  create(data: RatingDao) {
    return api.post<RatingData>('/ratings', data);
  }

  update(data: RatingDao, id: any) {
    return api.put<any>(`/ratings/${id}`, data);
  }

  delete(id: any) {
    return api.delete<any>(`/ratings/${id}`);
  }

  deleteAll() {
    return api.delete<any>(`/ratings`);
  }
}

export default new RatingDataService();
