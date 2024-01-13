import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { getPost } from '../api/API';

jest.mock('axios', () => ({
  get: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('getPost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getPost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getPost('123');

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/post/123');
    expect(result).toEqual(mockData);
  });

  test('getPost successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getPost('123');

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/post/123');
    expect(result).toEqual(mockData);
  });
});
