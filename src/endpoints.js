const baseURL = process.env.REACT_APP_API_URL;

export const endpoints = {
  books: `${baseURL}/book`,       
  genres: `${baseURL}/genre`,
  locations: `${baseURL}/location`,
  logs: `${baseURL}/log`
};
