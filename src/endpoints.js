const baseURL = process.env.REACT_APP_API_URL;

export const endpoints = {
  books: `${baseURL}/Book`,
  genres: `${baseURL}/Genre`,
  locations: `${baseURL}/Location`,
  // Tilføj flere endpoints efter behov
};
