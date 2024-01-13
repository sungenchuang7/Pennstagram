import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { patchUserData } from '../api/API';

jest.mock('axios', () => ({
  patch: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('patchUserData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('patchUserData successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.patch.mockResolvedValue(mockData);

    // Call the function
    const object = {};
    const result = await patchUserData('123', object);

    // Assertions
    expect(axios.patch).toHaveBeenCalledWith('http://localhost:8080/user/123', object);
    expect(result).toEqual(mockData);
  });

  test('patchUserData successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.patch.mockResolvedValue(mockData);

    // Call the function
    const object = {};
    const result = await patchUserData('123', object);

    // Assertions
    expect(axios.patch).toHaveBeenCalledWith('http://localhost:8080/user/123', object);
    expect(result).toEqual(mockData);
  });
});
