
import axios from 'axios';

// Centrilize the request by using this file...
const baseUrl = 'https://api.jotform.com/';
export async function runGetRequestWithParams(endPoint, queryString) {
  const response = await axios.get(`${baseUrl}/${endPoint}${queryString}`);
  if (response.status === 200) {
    return response;
  }
  return null;
}

export async function runPostRequestWithParams(endPoint, queryString, data) {
  const response = await axios.post(`${baseUrl}/${endPoint}${queryString}`, data);
  if (response.status === 200) {
    return response;
  }
  return null;
}

export async function runDeleteRequestWithParams(endPoint, queryString, data) {
  const response = await axios.delete(`${baseUrl}/${endPoint}${queryString}`);
  if (response.status === 200) {
    return response;
  }
  return null;
}

export function convertJsonDataToArray(data) {
  const keys = Object.keys(data);
  const arr = [];
  for (let i =0; i<keys.length; i++) {
    arr.push(data[keys[i]]);
  }
  console.log(arr);
  return arr;
}
