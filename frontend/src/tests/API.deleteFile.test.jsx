import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { deleteFile } from '../api/API';

jest.mock('axios', () => ({
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('deleteFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deleteFile successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.delete.mockResolvedValue(mockData);

    // Call the function
    const result = await deleteFile('123');

    // Assertions
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/upload/123');
    expect(result).toEqual(mockData);
  });

  test('deleteFile successfully fetches data', async () => {
    // Mock the axios.get request
    const mockData = { data: 'some data' };
    axios.delete.mockResolvedValue(mockData);

    // Call the function
    const result = await deleteFile('123');

    // Assertions
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/upload/123');
    expect(result).toEqual(mockData);
  });
});
