import '@testing-library/jest-dom/extend-expect';
import { message } from 'antd';
import axios from 'axios';
import { reAuth, setHeaders } from '../api/API';

jest.mock('antd', () => ({
  message: {
    error: jest.fn(),
  },
  // Mock other 'antd' exports if needed
}));
// Mock the entire 'antd' module
describe('reAuth', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.removeItem = jest.fn();

    // Mock window.location.reload
    delete global.window.location;
    global.window.location = { reload: jest.fn() };
  });

  it('should clear localStorage, display an error message, and reload the page when status is 401', () => {
    reAuth(401);

    expect(localStorage.removeItem).toHaveBeenCalledWith('app-token');
    expect(message.error).toHaveBeenCalledWith('Authentication Failed');
    expect(window.location.reload).toHaveBeenCalledWith(true);
  });

  // Add more tests here for other conditions, if needed
});

describe('setHeaders', () => {
  jest.mock('axios', () => ({
    defaults: {
      headers: {
        common: {},
      },
    },
  }));

  it('should set the Authorization header with the value from localStorage', () => {
    // Mock localStorage.getItem
    const mockToken = 'mock-token';
    Storage.prototype.getItem = jest.fn(() => mockToken);

    // Call the function
    setHeaders();

    // Check if the Authorization header is correctly set
    expect(axios.defaults.headers.common.Authorization).toEqual(mockToken);
    expect(localStorage.getItem).toHaveBeenCalledWith('app-token');
  });

  // Add more tests here if needed
});
