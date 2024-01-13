import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { getHomepagePost } from '../api/API';

jest.mock('axios', () => ({
  get: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('getHomepagePost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getHomepagePost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getHomepagePost('123', 5);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/homepagepost/123/5');
    expect(result).toEqual(mockData);
  });

  test('getHomepagePost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getHomepagePost('123', 5);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/homepagepost/123/5');
    expect(result).toEqual(mockData);
  });
});
