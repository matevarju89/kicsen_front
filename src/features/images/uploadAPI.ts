// request all users
import api from '../../utility/http-common';

class ImageUploadService {
  create(data: any) {
    return api.post<any>('/images', data);
  }
}

export default new ImageUploadService();
