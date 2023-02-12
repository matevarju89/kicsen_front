// request all users
import api from '../../utility/http-common';
import { SmartTagDao, SmartTagData } from './types';

export type CreateManyBatchResponse = {
  count: number;
};

class SmartTagDataService {
  getAll() {
    return api.get<Array<SmartTagData>>('/smartTags');
  }

  get(id: string) {
    return api.get<SmartTagData>(`/smartTags/${id}`);
  }

  getfirstNumberOfSmartTags(howMany: number) {
    return api.get<Array<SmartTagData>>(`/smartTags/?take=${howMany}`);
  }

  getAllByLang(lang: string) {
    return api.get<Array<SmartTagData>>(`/smartTags/?where[lang]=${lang}`);
  }

  getByLanguagePaginated(lang: string, howMany: number) {
    return api.get<SmartTagData>(
      `/smartTags/?take=${howMany}&where[lang]=${lang}`
    );
  }

  create(data: SmartTagDao) {
    return api.post<SmartTagData>('/smartTags', data);
  }

  createMany(data: SmartTagDao[]) {
    return api.post<CreateManyBatchResponse>('/smartTags/createMany', data);
  }

  update(data: SmartTagDao, id: any) {
    return api.put<any>(`/smartTags/${id}`, data);
  }

  delete(id: any) {
    return api.delete<any>(`/smartTags/${id}`);
  }

  deleteAll() {
    return api.delete<any>(`/smartTags`);
  }
}

export default new SmartTagDataService();
