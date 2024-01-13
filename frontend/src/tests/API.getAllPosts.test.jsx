import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { getAllPosts } from '../api/API';

jest.mock('axios', () => ({
  get: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('getAllPosts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllPosts successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getAllPosts();

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/post');
    expect(result).toEqual(mockData);
  });

  test('getAllPosts successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.get.mockResolvedValue(mockData);

    // Call the function
    const result = await getAllPosts();

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/post');
    expect(result).toEqual(mockData);
  });
});
