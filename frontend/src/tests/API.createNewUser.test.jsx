import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { createNewUser } from '../api/API';

jest.mock('axios', () => ({
  post: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('createNewUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createNewUser successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.post.mockResolvedValue(mockData);

    const object = {};
    // Call the function
    const result = await createNewUser(object);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/user', object);
    expect(result).toEqual(mockData);
  });

  test('createNewUser successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.post.mockResolvedValue(mockData);

    // Call the function
    const object = {};
    const result = await createNewUser(object);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/user', object);
    expect(result).toEqual(mockData);
  });
});
