import { Result } from "../../types/types";

/**
 * Fetches data from the given URL with the given options and stored
 * authorization. If the fetch is successful, the onSuccess function is called,
 * otherwise the onFailure function is called.
 * 
 * @param url the URL to fetch data from
 * @param options the options to pass to the fetch function
 * @param onSuccess the function to call if the fetch is successful
 * @param onFailure the function to call if the fetch is unsuccessful
 */
export const fetchWithAuth = async (
	url: string,
	options: RequestInit = {},
	onSuccess?: (data: Result) => void,
	onFailure?: (error: any) => void
): Promise<void> => {
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

	// Set Content-Type header
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
		let contentType = await response.headers.get("content-type");
	
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
				console.warn(data.message);
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
