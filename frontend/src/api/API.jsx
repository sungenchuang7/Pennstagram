import axios from 'axios';
import { message } from 'antd';
// import { env } from '../../.eslintrc';

const prefix = 'api/';

// const domain = env === 'development'
//   ? 'http://localhost:8080'
//   : '';
// const domain = process.env.REACT_APP_API_DOMAIN || '';
const domain = 'http://localhost:8080';

export function setHeaders() {
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
}

export function reAuth(status) {
  if (status === 401) {
    localStorage.removeItem('app-token');
    message.error('Authentication Failed');
    window.location.reload(true);
  }
}

export function getProfilepagePost(userID, count) {
  let result;
  try {
    setHeaders();
    result = axios.get(`${domain}/${prefix}profilepagepost/${userID}/${count}`);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export function getHomepagePost(userID, count) {
  let result;
  try {
    setHeaders();
    result = axios.get(`${domain}/${prefix}homepagepost/${userID}/${count}`);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export function getUserData(userID) {
  let result;
  try {
    setHeaders();
    result = axios.get(`${domain}/${prefix}user/${userID}`);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export function getAllPosts() {
  // return axios.get('http://localhost:5001/posts'); // for json server
  let result;
  try {
    setHeaders();
    result = axios.get(`${domain}/${prefix}post`);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

// getPost should return a post object in JSON format if successful
export function getPost(postID) {
  let result;
  try {
    setHeaders();
    result = axios.get(`${domain}/${prefix}post/${postID}`);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export function newPosts(object) {
  let result;
  try {
    setHeaders();
    result = axios.post(`${domain}/${prefix}post`, object);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export async function createNewUser(user) {
  console.log('!!domain1: ', domain);
  const result = await axios.post(`${domain}/${prefix}user`, user);
  console.log('!!domain2: ', domain);
  return result;
}

export async function patchUserData(id, data) {
  let result;
  try {
    setHeaders();
    result = await axios.patch(`${domain}/${prefix}user/${id}`, data);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export async function patchPostData(id, data) {
  let result;
  try {
    setHeaders();
    result = await axios.patch(`${domain}/${prefix}post/${id}`, data);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export async function deleteFile(fileName) {
  let result;
  try {
    setHeaders();
    result = await axios.delete(`${domain}/${prefix}upload/${fileName}`);
  } catch (e) {
    reAuth((e.response && e.response.status) || null);
    message.error(e.message);
  }
  return result;
}

export function loginAPI(userID, password) {
  return axios.post(`${domain}/${prefix}login`, { userID, password });
}

export async function deletePost(fileName, id) {
  setHeaders();
  let result1;
  if (fileName !== '') {
    result1 = await axios.delete(`${domain}/${prefix}upload/${fileName}`);
  }
  const result2 = await axios.delete(`${domain}/post/${id}`);
  return [result1, result2];
}

export async function uploadFile(files) {
  let res;
  try {
    setHeaders();
    res = await axios.post(`${domain}/${prefix}upload`, files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    /* eslint-disable no-console */
    console.log(`Upload successful ${res}`);
  } catch (err) {
    /* eslint-disable no-console */
    console.log(err.message);
  }
  return res.data.url;
}
