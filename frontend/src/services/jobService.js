import axios from 'axios';

const API = 'http://localhost:5000/api/jobs';

export const getJobs = async (params = {}) => {
  const res = await axios.get(API, { params });
  console.log('API RESPONSE', res.data);
  return res.data.jobs || res.data;
};

export const addJob = async (jobData) => {
  const res = await axios.post(API, jobData);
  return res.data;
};

export const deleteJob = async (id) => {
  await axios.delete(`${API}/${id}`);
};
