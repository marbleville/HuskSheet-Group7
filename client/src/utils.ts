
/**
 * @author kris-amerman
 * @description A client utility file. Offers common utility functions.
 */



export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Retrieve username and password from sessionStorage
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
  
    // If username and password exist, set Authorization header
    if (username && password) {
      options.headers = {
        ...options.headers,
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      };
    }
  
    // If method is POST and body is provided, stringify body and set appropriate headers
    if (options.method === 'POST' && options.body) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
    }
  
    return fetch(url, options);
  };  