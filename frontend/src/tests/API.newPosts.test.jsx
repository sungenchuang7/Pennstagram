import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { newPosts } from '../api/API';

jest.mock('axios', () => ({
  post: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('newPosts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('newPosts successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.post.mockResolvedValue(mockData);

    const object = {};
    // Call the function
    const result = await newPosts(object);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/post', object);
    expect(result).toEqual(mockData);
  });

  test('newPosts successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.post.mockResolvedValue(mockData);

    // Call the function
    const object = {};
    const result = await newPosts(object);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/post', object);
    expect(result).toEqual(mockData);
  });
});
