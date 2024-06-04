/**
 * @author kris-amerman
 * @description A client utility file. Offers common utility functions.
 */

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (data: any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFailure?: (error: any) => void
): Promise<void> => {
  // Retrieve username and password from sessionStorage
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  // If username and password exist, set Authorization header
  if (username && password) {
    options.headers = {
      ...options.headers,
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    };
  }

  // If method is POST and body is provided, stringify body and set appropriate headers
  if (options.method === "POST" && options.body) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        console.warn(`data.success was false: ${data.message}`)
        if (onFailure) {
          onFailure(data);
        }
      }
    } else {
      console.error("Error fetching");
      if (onFailure) {
        onFailure(null); // how to handle better
      }
    }
  } catch (error) {
    console.error("Error fetching", error);
    if (onFailure) {
      onFailure(error); // how to handle better
    }
  }
};
