import React from 'react';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditPostButton from '../components/EditPostButton';
import { patchPostData, uploadFile } from '../api/API';

jest.mock('../api/API');

describe('EditPostButton', () => {
  const mockActivityFeed = [{ _id: '123', text: 'Original Post', url: 'http://example.com/original.jpg' }];
  const mockSetActivityFeed = jest.fn();
  const mockId = '123';
  const mockFileName = 'original.jpg';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('allows editing a post', async () => {
    // Render the component with mock props
    render(
      <EditPostButton
        activityFeed={mockActivityFeed}
        setActivityFeed={mockSetActivityFeed}
        id={mockId}
        fileName={mockFileName}
      />,
    );

    // Simulate user actions
    fireEvent.click(screen.getByText('Edit')); // Open the popover
    fireEvent.change(screen.getByPlaceholderText('Share your thoughts...'), { target: { value: 'Updated Post' } });

    // Mock file upload
    const file = new File(['dummy content'], 'new-image.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('submitBtn');
    fireEvent.change(input, { target: { files: [file] } });

    // Click the submit button
    await waitFor(() => fireEvent.click(screen.getByText('Submit')));

    // Assertions
    // Wait for expected changes to occur before asserting
    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalled();
      expect(patchPostData).toHaveBeenCalledWith(mockId, expect.any(Object));
      expect(mockSetActivityFeed).toHaveBeenCalledWith(expect.any(Array));
      expect(screen.queryByText('Edited!')).toBeInTheDocument();
    });
  });

  // Add more tests for different scenarios...
});
