// src/endpoints.ts
const baseURL = process.env.REACT_APP_API_URL;

export const endpoints = {
  books: `${baseURL}/books`,
  bookImages: `${baseURL}/bookimages`,
  customers: `${baseURL}/customers`,
  employees: `${baseURL}/employees`,
  genres: `${baseURL}/genres`,
  locations: `${baseURL}/locations`,
  logs: `${baseURL}/logs`,
  users: `${baseURL}/users`,
  // Tilføj flere endpoints efter behov
};
