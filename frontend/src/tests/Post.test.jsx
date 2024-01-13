import React from 'react';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Post from '../components/Post';
import { deletePost } from '../api/API';

// Mock the external API functions
jest.mock('../api/API', () => ({
  deletePost: jest.fn(),
  patchUserData: jest.fn(),
}));

describe('Post Component', () => {
  const mockProps = {
    avatar: 'avatar_url',
    id: 'post_id',
    userName: 'John Doe',
    userID: 'user_id',
    url: 'post_url',
    text: 'Sample post text',
    time: '1h ago',
    posts: [],
    setPosts: jest.fn(),
    likeList: [],
    loggedInUserID: 'user_id',
    commentList: [],
    fileName: 'file_name',
  };

  // At the top of your test file (e.g., Post.test.jsx)
  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Post {...mockProps} />
      </BrowserRouter>,
    );
    expect(screen.getByText('Sample post text')).toBeInTheDocument();
    // Add more assertions as needed
  });

  it('calls deletePost API on delete button click', async () => {
    deletePost.mockResolvedValue([null, { status: 200 }]);
    render(
      <BrowserRouter>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Post {...mockProps} />
      </BrowserRouter>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });
    await waitFor(() => expect(deletePost).toHaveBeenCalledWith('file_name', 'post_id'));
  });
});
