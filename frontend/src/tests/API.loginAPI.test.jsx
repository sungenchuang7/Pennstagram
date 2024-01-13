import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { loginAPI } from '../api/API';

jest.mock('axios', () => ({
  post: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('loginAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loginAPI successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.post.mockResolvedValue(mockData);

    // Call the function
    const result = await loginAPI('123', 'password');

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', { userID: '123', password: 'password' });
    expect(result).toEqual(mockData);
  });

  test('loginAPI successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.post.mockResolvedValue(mockData);

    // Call the function
    const result = await loginAPI('123', 'password');

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', { userID: '123', password: 'password' });
    expect(result).toEqual(mockData);
  });
});
