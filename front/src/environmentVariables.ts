export const { REACT_APP_BASE_API_ENDPOINT } = process.env;

if (!REACT_APP_BASE_API_ENDPOINT) {
  console.info(process.env);
  throw new Error("BASE_API_ENDPOINT is not set in .env");
}
