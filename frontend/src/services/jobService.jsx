import axios from 'axios';

const API = 'http://localhost:5000/api/jobs';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getJobs = async (params = {}) => {
  const res = await axios.get(API, { params, ...getAuthHeader() });
  console.log('API RESPONSE', res.data);
  return res.data.jobs || res.data;
};

export const addJob = async (jobData) => {
  const res = await axios.post(API, jobData, getAuthHeader());
  return res.data;
};

export const deleteJob = async (id) => {
  await axios.delete(`${API}/${id}`, getAuthHeader());
};

export const updateJob = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, getAuthHeader());
  return res.data;
};
