import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { getUserData } from '../api/API';

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
    const result = await getUserData('123');

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/user/123');
    expect(result).toEqual(mockData);
  });

  test('getProfilepagePost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getUserData('123');

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/user/123');
    expect(result).toEqual(mockData);
  });
});
