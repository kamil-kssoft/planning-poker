// it will be replaced on building Docker container
let apiUrl = 'API_URL_PLACEHOLDER';
console.log('apiUrl (before)', apiUrl);

if (apiUrl.startsWith('API_URL_PLACEHOL')) {
  apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
}
console.log('apiUrl (after)', apiUrl);

const config = {
  apiUrl: apiUrl,
};

export default config;
