import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { getProfilepagePost } from '../api/API';

jest.mock('axios', () => ({
  get: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('getProfilepagePost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getProfilepagePost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getProfilepagePost('123', 5);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/profilepagepost/123/5');
    expect(result).toEqual(mockData);
  });

  test('getProfilepagePost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getProfilepagePost('123', 5);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/profilepagepost/123/5');
    expect(result).toEqual(mockData);
  });
});
