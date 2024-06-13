/**
 * OUR_SERVER denotes our server's base url
 * CLASS_SERVER denotes the class server's base url
 */
const OUR_SERVER = "http://localhost:3000/api/v1/";
const CLASS_SERVER = "https://husksheets.fly.dev/api/v1/";

// Determines which server to talk to
const clientConfig = {
  BASE_URL: OUR_SERVER,
};

export default clientConfig;