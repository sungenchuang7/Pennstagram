import React from 'react';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { uploadFile, newPosts } from '../api/API';
import Share from '../components/Share';

jest.mock('../api/API');

describe('Share', () => {
  const mockUserData = {
    avatar: 'user_avatar.jpg',
    userName: 'JohnDoe',
    userID: 'user123',
  };
  const mockActivityFeed = [];
  const mockSetActivityFeed = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows creating a new post', async () => {
    // Mock API responses
    uploadFile.mockResolvedValue('http://example.com/uploaded.jpg');
    newPosts.mockResolvedValue({ data: { id: 'newPost123' } });

    // Render the component with mock props
    render(
      <Share
        userData={mockUserData}
        activityFeed={mockActivityFeed}
        setActivityFeed={mockSetActivityFeed}
      />,
    );

    // Simulate user actions
    fireEvent.change(screen.getByPlaceholderText('Share your thoughts...'), { target: { value: 'New Post' } });
    const file = new File(['dummy content'], 'image.jpg', { type: 'image/jpeg' });
    const fileInput = document.getElementById('upload');
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Post'));

    // Assertions
    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledWith(expect.any(FormData));
      expect(newPosts).toHaveBeenCalledWith(expect.any(Object));
      expect(mockSetActivityFeed).toHaveBeenCalledWith(expect.any(Array));
      expect(screen.getByPlaceholderText('Share your thoughts...').value).toBe('');
    });
  });
});
