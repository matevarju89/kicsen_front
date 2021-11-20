import api from './http-common';

// store our Token in LS and set axios headers if we do have a token

const setUser = (user: { token: string; username: string } | null) => {
  if (user) {
    api.defaults.headers.common['x-auth-token'] = user.token;
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('user');
  }
};

export default setUser;
