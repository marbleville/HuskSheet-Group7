// /**
//  * @jest-environment jest-environment-jsdom
//  */

// import { fetchWithAuth } from "../../client/src/utils";

// describe('fetchWithAuth function', () => {
//   let consoleErrorMock: jest.SpyInstance;

//   beforeEach(() => {
//     // Mocking sessionStorage
//     Object.defineProperty(window, 'sessionStorage', {
//       value: {
//         getItem: jest.fn((key) => {
//           if (key === 'username') return 'testUser';
//           if (key === 'password') return 'testPassword';
//           return null;
//         }),
//         setItem: jest.fn(),
//         removeItem: jest.fn(),
//         clear: jest.fn(),
//       },
//       writable: true,
//     });

//     // Mocking fetch API
//     global.fetch = jest.fn().mockImplementation(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ success: true, data: 'testData' }),
//       })
//     );

//     // Mocking console.error
//     consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

  // it('should fetch data successfully with authorization headers', async () => {
  //   const url = 'https://example.com/api';
  //   const options: RequestInit = { method: 'GET' }; 
  //   const onSuccess = jest.fn();
  //   const onFailure = jest.fn();

  //   await fetchWithAuth(url, options, onSuccess, onFailure);

  //   expect(global.fetch).toHaveBeenCalledWith(url, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Basic dGVzdFVzZXI6dGVzdFBhc3N3b3Jk', // base64 encoded 'testUser:testPassword'
  //     },
  //   });
  //   expect(onSuccess).toHaveBeenCalledWith({ success: true, data: 'testData' });
  //   expect(onFailure).not.toHaveBeenCalled();
  // });

  // it('should stringify body and set Content-Type header for POST requests', async () => {
  //   const url = 'https://example.com/api';
  //   const options: RequestInit = { method: 'POST', body: JSON.stringify({ key: 'value' }) }; 
  //   const onSuccess = jest.fn();
  //   const onFailure = jest.fn();

  //   await fetchWithAuth(url, options, onSuccess, onFailure);

  //   expect(global.fetch).toHaveBeenCalledWith(url, {
  //     method: 'POST',
  //     body: '{"key":"value"}',
  //     headers: {
  //       Authorization: 'Basic dGVzdFVzZXI6dGVzdFBhc3N3b3Jk',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // });

  // it('should call onFailure callback on unsuccessful fetch', async () => {
  //   global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: false }));

  //   const url = 'https://example.com/api';
  //   const options: RequestInit = { method: 'GET' }; 
  //   const onSuccess = jest.fn();
  //   const onFailure = jest.fn();

  //   await fetchWithAuth(url, options, onSuccess, onFailure);

  //   expect(onSuccess).not.toHaveBeenCalled();
  //   expect(onFailure).toHaveBeenCalledWith(null); 
  // });

  // it('should call onFailure callback on network error', async () => {
  //   global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error('Network error')));

  //   const url = 'https://example.com/api';
  //   const options: RequestInit = { method: 'GET' }; 
  //   const onSuccess = jest.fn();
  //   const onFailure = jest.fn();

  //   await fetchWithAuth(url, options, onSuccess, onFailure);

  //   expect(onSuccess).not.toHaveBeenCalled();
  //   expect(onFailure).toHaveBeenCalledWith(new Error('Network error'));
  // });
//});
