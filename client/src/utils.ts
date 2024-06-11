import { Result } from "../../types/types";
import clientConfig from "./config/clientConfig";

const validEndpoints = [
  "register",
  "getPublishers",
  "getSheets",
  "createSheet",
  "deleteSheet",
  "getUpdatesForSubscription",
  "getUpdatesForPublished",
  "updatePublished",
  "updateSubscription",
] as const;

type Endpoint = (typeof validEndpoints)[number];

/**
 * Fetches data from the given endpoint with the given options and stored
 * authorization. If the fetch is successful, the onSuccess function is called,
 * otherwise the onFailure function is called.
 *
 * @param endpoint the endpoint to fetch data from
 * @param options the options to pass to the fetch function
 * @param onSuccess the function to call if the fetch is successful
 * @param onFailure the function to call if the fetch is unsuccessful
 */
export const fetchWithAuth = async (
  endpoint: Endpoint,
  options: RequestInit = {},
  onSuccess?: (data: Result) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFailure?: (error: any) => void
): Promise<void> => {
  // Ensure the endpoint is valid
  if (!validEndpoints.includes(endpoint)) {
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }

  // Construct endpoint URL
  const url = `${clientConfig.BASE_URL}${endpoint}`;

  // Retrieve username and password from sessionStorage
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  if (!username || !password) {
    throw new Error("Username and password are required for authorization.");
  }

  // Set Authorization header
  options.headers = {
    ...options.headers,
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  };

  // Set Content-Type header for POST requests with a body
  if (options.method === "POST" && options.body) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await fetch(url, options);

    // Immediately fail if "Unauthorized"
    if (response.status === 401) {
      onFailure?.({ message: "Unauthorized" });
      return;
    }

    let data: Result;
    const contentType = await response.headers.get("content-type");

    // Attempt to parse response as JSON
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const plaintext = await response.text();
      try {
        data = JSON.parse(plaintext);
      } catch (error) {
        console.error("Error parsing non-JSON plaintext -- ", error);
        return;
      }
    }

    if (response.ok) {
      if (data.success && data.success !== undefined) {
        // { success: true, ... }
        onSuccess?.(data);
      } else {
        // { success: false, ... }
        console.warn(data);
        onFailure?.(data);
      }
    } else {
      // Got some non-200 response other than 401
      console.error(`Encountered a bad response code: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description Helper to get the letter of the column
 * Starts from 'A ... Z, then 'AA ... AZ', etc.
 *
 * @author rishavsarma5
 */
export const getHeaderLetter = (curr: number): string => {
  let currentCol = curr;
  let letters = "";
  while (currentCol >= 0) {
    const remainder = currentCol % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    currentCol = Math.floor(currentCol / 26) - 1;
  }

  return letters;
};

/**
 * @description Helper to get the number of the column
 *
 * @author rishavsarma5
 */
export const getColumnNumber = (letter: string): number => {
  let columnNumber = 0;
  for (let i = 0; i < letter.length; i++) {
    columnNumber = columnNumber * 26 + (letter.charCodeAt(i) - 65 + 1);
  }
  return columnNumber - 1;
};
